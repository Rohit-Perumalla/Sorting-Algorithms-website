import { SortStep, ElementState } from '../types/sorting';

export function generateSelectionSortSteps(initialArray: number[], order: 'asc' | 'desc' = 'asc'): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  let accesses = 0;

  const sortedIndices = new Set<number>();

  const pushStep = (
    indices: { [index: number]: ElementState },
    description: string,
    minIndex?: number,
    codeLine?: number,
    phase?: string
  ) => {
    const fullIndices: { [index: number]: ElementState } = {};
    for (let idx = 0; idx < n; idx++) {
      if (sortedIndices.has(idx)) {
        fullIndices[idx] = 'sorted';
      } else if (indices[idx]) {
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
      phase: phase || 'Selection Sort',
      codeLine,
      meta: { minIndex }
    });
  };

  pushStep({}, 'Initial array before Selection Sort starts', undefined, 1, 'Starting');

  for (let i = 0; i < n; i++) {
    let targetIdx = i;
    accesses++;

    pushStep(
      { [i]: 'selected' },
      `Assume position ${i} (value ${arr[i]}) is the current ${order === 'asc' ? 'minimum' : 'maximum'}.`,
      targetIdx,
      2,
      `Step ${i + 1} of ${n}`
    );

    for (let j = i + 1; j < n; j++) {
      comparisons++;
      accesses += 2;
      const isBetter = order === 'asc' ? arr[j] < arr[targetIdx] : arr[j] > arr[targetIdx];

      pushStep(
        { [targetIdx]: 'selected', [j]: 'comparing' },
        `Comparing array[${j}] (${arr[j]}) with current ${order === 'asc' ? 'min' : 'max'} array[${targetIdx}] (${arr[targetIdx]}).`,
        targetIdx,
        4,
        `Scanning index ${j}`
      );

      if (isBetter) {
        targetIdx = j;
        pushStep(
          { [targetIdx]: 'selected' },
          `Found new ${order === 'asc' ? 'minimum' : 'maximum'} at index ${targetIdx} (value ${arr[targetIdx]}).`,
          targetIdx,
          5,
          `New ${order === 'asc' ? 'min' : 'max'} found`
        );
      }
    }

    if (targetIdx !== i) {
      swaps++;
      accesses += 4;
      const temp = arr[i];
      arr[i] = arr[targetIdx];
      arr[targetIdx] = temp;

      pushStep(
        { [i]: 'swapping', [targetIdx]: 'swapping' },
        `Swapping index ${i} (${temp}) with ${order === 'asc' ? 'minimum' : 'maximum'} at index ${targetIdx} (${arr[i]}).`,
        targetIdx,
        6,
        'Swapping'
      );
    } else {
      pushStep(
        { [i]: 'selected' },
        `Index ${i} (${arr[i]}) is already in correct ${order === 'asc' ? 'smallest' : 'largest'} position. No swap needed.`,
        targetIdx,
        6,
        'In position'
      );
    }

    sortedIndices.add(i);
    pushStep(
      {},
      `Element ${arr[i]} at index ${i} is now locked in sorted position.`,
      undefined,
      7,
      `Sorted position ${i}`
    );
  }

  for (let k = 0; k < n; k++) sortedIndices.add(k);
  pushStep({}, 'Selection Sort completed! All elements sorted.', undefined, 8, 'Completed');

  return steps;
}
