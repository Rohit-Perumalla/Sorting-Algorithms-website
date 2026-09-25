import { SortStep, ElementState, MergeTreeNodeSnapshot, MergeBufferState } from '../types/sorting';

interface InternalTreeNode {
  id: string;
  left: number;
  right: number;
  depth: number;
  parentId?: string;
  leftChildId?: string;
  rightChildId?: string;
  values: number[];
  state: 'pending' | 'dividing' | 'active-left' | 'active-right' | 'merging' | 'sorted';
}

export function generateMergeSortSteps(initialArray: number[], order: 'asc' | 'desc' = 'asc'): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0; // count auxiliary writes/copies as swaps
  let accesses = 0;

  // Build the complete recursion tree structure
  const treeNodesMap = new Map<string, InternalTreeNode>();

  function buildTreeStructure(left: number, right: number, depth: number, parentId?: string): string {
    const id = `${left}_${right}_d${depth}`;
    const values = arr.slice(left, right + 1);

    const node: InternalTreeNode = {
      id,
      left,
      right,
      depth,
      parentId,
      values: [...values],
      state: 'pending'
    };

    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      node.leftChildId = buildTreeStructure(left, mid, depth + 1, id);
      node.rightChildId = buildTreeStructure(mid + 1, right, depth + 1, id);
    }

    treeNodesMap.set(id, node);
    return id;
  }

  buildTreeStructure(0, n - 1, 0, undefined);

  const getTreeSnapshot = (): MergeTreeNodeSnapshot[] => {
    return Array.from(treeNodesMap.values()).map((node) => ({
      id: node.id,
      left: node.left,
      right: node.right,
      depth: node.depth,
      parentId: node.parentId,
      values: [...node.values],
      state: node.state
    }));
  };

  const pushStep = (
    indices: { [index: number]: ElementState },
    description: string,
    metaDetails?: {
      mergeSubarrays?: NonNullable<SortStep['meta']>['mergeSubarrays'];
      activeNodeId?: string;
      mergeBuffer?: MergeBufferState;
    },
    codeLine?: number,
    phase?: string
  ) => {
    const fullIndices: { [index: number]: ElementState } = {};
    for (let idx = 0; idx < n; idx++) {
      if (indices[idx]) {
        fullIndices[idx] = indices[idx];
      } else {
        fullIndices[idx] = 'default';
      }
    }

    steps.push({
      array: [...arr],
      indices: fullIndices,
      comparisons,
      swaps,
      accesses,
      description,
      phase: phase || 'Merge Sort',
      codeLine,
      meta: {
        mergeSubarrays: metaDetails?.mergeSubarrays,
        mergeTreeNodes: getTreeSnapshot(),
        activeMergeNodeId: metaDetails?.activeNodeId,
        mergeBuffer: metaDetails?.mergeBuffer
      }
    });
  };

  // Initial step
  pushStep({}, 'Initial array before Merge Sort begins', undefined, 1, 'Starting');

  function merge(left: number, mid: number, right: number, depth: number) {
    const nodeId = `${left}_${right}_d${depth}`;
    const leftChildId = `${left}_${mid}_d${depth + 1}`;
    const rightChildId = `${mid + 1}_${right}_d${depth + 1}`;

    const parentNode = treeNodesMap.get(nodeId);
    const leftNode = treeNodesMap.get(leftChildId);
    const rightNode = treeNodesMap.get(rightChildId);

    if (parentNode) parentNode.state = 'merging';
    if (leftNode) leftNode.state = 'active-left';
    if (rightNode) rightNode.state = 'active-right';

    const leftLen = mid - left + 1;
    const rightLen = right - mid;

    const leftArr: number[] = new Array(leftLen);
    const rightArr: number[] = new Array(rightLen);

    for (let i = 0; i < leftLen; i++) {
      leftArr[i] = arr[left + i];
      accesses++;
    }
    for (let j = 0; j < rightLen; j++) {
      rightArr[j] = arr[mid + 1 + j];
      accesses++;
    }

    const mergedAccum: number[] = [];

    const getBuffer = (iPtr?: number, jPtr?: number, target?: number): MergeBufferState => ({
      leftArray: [...leftArr],
      rightArray: [...rightArr],
      mergedArray: [...mergedAccum],
      leftPointer: iPtr,
      rightPointer: jPtr,
      activeTargetIndex: target
    });

    const mergeMeta = {
      leftStart: left,
      leftEnd: mid,
      rightStart: mid + 1,
      rightEnd: right
    };

    const highlightSubarrays: { [index: number]: ElementState } = {};
    for (let k = left; k <= mid; k++) highlightSubarrays[k] = 'heap-parent';
    for (let k = mid + 1; k <= right; k++) highlightSubarrays[k] = 'heap-child';

    pushStep(
      highlightSubarrays,
      `Merging subarrays: Left [${left}..${mid}] and Right [${mid + 1}..${right}].`,
      {
        mergeSubarrays: mergeMeta,
        activeNodeId: nodeId,
        mergeBuffer: getBuffer(0, 0)
      },
      4,
      `Merging range [${left}..${right}]`
    );

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftLen && j < rightLen) {
      comparisons++;
      accesses += 2;
      const leftVal = leftArr[i];
      const rightVal = rightArr[j];
      const chooseLeft = order === 'asc' ? leftVal <= rightVal : leftVal >= rightVal;

      const compHighlight = { ...highlightSubarrays };
      compHighlight[left + i] = 'comparing';
      compHighlight[mid + 1 + j] = 'comparing';

      pushStep(
        compHighlight,
        `Comparing left element ${leftVal} and right element ${rightVal}. ${
          chooseLeft ? `Picking ${leftVal}` : `Picking ${rightVal}`
        } next.`,
        {
          mergeSubarrays: mergeMeta,
          activeNodeId: nodeId,
          mergeBuffer: getBuffer(i, j, k)
        },
        5,
        `Comparing merge items`
      );

      const chosenVal = chooseLeft ? leftVal : rightVal;
      arr[k] = chosenVal;
      mergedAccum.push(chosenVal);
      if (parentNode) {
        parentNode.values = [...arr.slice(left, right + 1)];
      }

      if (chooseLeft) {
        i++;
      } else {
        j++;
      }
      swaps++;
      accesses++;

      const writeHighlight = { ...highlightSubarrays };
      writeHighlight[k] = 'merging';
      pushStep(
        writeHighlight,
        `Placed ${arr[k]} into position ${k} of merged segment.`,
        {
          mergeSubarrays: mergeMeta,
          activeNodeId: nodeId,
          mergeBuffer: getBuffer(i < leftLen ? i : undefined, j < rightLen ? j : undefined, k)
        },
        6,
        `Merging position ${k}`
      );
      k++;
    }

    while (i < leftLen) {
      const leftVal = leftArr[i];
      arr[k] = leftVal;
      mergedAccum.push(leftVal);
      if (parentNode) {
        parentNode.values = [...arr.slice(left, right + 1)];
      }
      swaps++;
      accesses++;
      i++;
      k++;

      const writeHighlight = { ...highlightSubarrays };
      writeHighlight[k - 1] = 'merging';
      pushStep(
        writeHighlight,
        `Copied remaining left element ${leftVal} into position ${k - 1}.`,
        {
          mergeSubarrays: mergeMeta,
          activeNodeId: nodeId,
          mergeBuffer: getBuffer(i < leftLen ? i : undefined, undefined, k - 1)
        },
        7,
        `Draining left half`
      );
    }

    while (j < rightLen) {
      const rightVal = rightArr[j];
      arr[k] = rightVal;
      mergedAccum.push(rightVal);
      if (parentNode) {
        parentNode.values = [...arr.slice(left, right + 1)];
      }
      swaps++;
      accesses++;
      j++;
      k++;

      const writeHighlight = { ...highlightSubarrays };
      writeHighlight[k - 1] = 'merging';
      pushStep(
        writeHighlight,
        `Copied remaining right element ${rightVal} into position ${k - 1}.`,
        {
          mergeSubarrays: mergeMeta,
          activeNodeId: nodeId,
          mergeBuffer: getBuffer(undefined, j < rightLen ? j : undefined, k - 1)
        },
        8,
        `Draining right half`
      );
    }

    if (parentNode) parentNode.state = 'sorted';
    if (leftNode) leftNode.state = 'sorted';
    if (rightNode) rightNode.state = 'sorted';

    const mergedDone: { [index: number]: ElementState } = {};
    for (let idx = left; idx <= right; idx++) {
      mergedDone[idx] = 'sorted';
    }
    pushStep(
      mergedDone,
      `Range [${left}..${right}] is now merged and sorted.`,
      {
        mergeSubarrays: mergeMeta,
        activeNodeId: nodeId,
        mergeBuffer: getBuffer()
      },
      9,
      `Range [${left}..${right}] merged`
    );
  }

  function mergeSortHelper(left: number, right: number, depth: number) {
    const nodeId = `${left}_${right}_d${depth}`;
    const currentNode = treeNodesMap.get(nodeId);

    if (left >= right) {
      if (currentNode) currentNode.state = 'sorted';
      pushStep(
        { [left]: 'sorted' },
        `Base case reached: Subarray [${left}..${right}] with element ${arr[left]} is trivially sorted.`,
        { activeNodeId: nodeId },
        1,
        `Base case [${left}]`
      );
      return;
    }

    const mid = Math.floor((left + right) / 2);
    if (currentNode) currentNode.state = 'dividing';

    const splitHighlight: { [index: number]: ElementState } = {};
    for (let k = left; k <= mid; k++) splitHighlight[k] = 'selected';
    for (let k = mid + 1; k <= right; k++) splitHighlight[k] = 'pivot';

    pushStep(
      splitHighlight,
      `Divide: Splitting range [${left}..${right}] at mid=${mid}. Left: [${left}..${mid}], Right: [${mid + 1}..${right}].`,
      {
        mergeSubarrays: {
          leftStart: left,
          leftEnd: mid,
          rightStart: mid + 1,
          rightEnd: right
        },
        activeNodeId: nodeId
      },
      2,
      `Divide [${left}..${right}]`
    );

    mergeSortHelper(left, mid, depth + 1);
    mergeSortHelper(mid + 1, right, depth + 1);
    merge(left, mid, right, depth);
  }

  mergeSortHelper(0, n - 1, 0);

  // Mark all nodes sorted at the end
  treeNodesMap.forEach((node) => {
    node.state = 'sorted';
  });

  const finalIndices: { [index: number]: ElementState } = {};
  for (let i = 0; i < n; i++) finalIndices[i] = 'sorted';
  steps.push({
    array: [...arr],
    indices: finalIndices,
    comparisons,
    swaps,
    accesses,
    description: 'Merge Sort complete! Array fully sorted in O(n log n) time.',
    phase: 'Completed',
    codeLine: 10,
    meta: {
      mergeTreeNodes: getTreeSnapshot()
    }
  });

  return steps;
}
