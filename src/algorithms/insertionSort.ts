import { SortStep, ElementState } from '../types/sorting';

export function generateInsertionSortSteps(initialArray: number[], order: 'asc' | 'desc' = 'asc'): SortStep[] {
  const steps: SortStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0; // In insertion sort, shifts or swaps
  let accesses = 0;

  const pushStep = (
    indices: { [index: number]: ElementState },
    description: string,
    keyIndex?: number,
    codeLine?: number,
    phase?: string,
    sortedUpTo: number = 0
  ) => {
    const fullIndices: { [index: number]: ElementState } = {};
    for (let idx = 0; idx < n; idx++) {
      if (indices[idx]) {
        fullIndices[idx] = indices[idx];
      } else if (idx <= sortedUpTo) {
        fullIndices[idx] = 'sorted';
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
      phase: phase || 'Insertion Sort',
      codeLine,
      meta: { keyIndex }
    });
  };

  pushStep({ 0: 'sorted' }, 'First element arr[0] is trivially sorted.', undefined, 1, 'Starting', 0);

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    accesses++;
    let j = i - 1;

    pushStep(
      { [i]: 'selected' },
      `Selected key element arr[${i}] = ${key}. Will insert into sorted subarray [0..${i - 1}].`,
      i,
      2,
      `Inserting key ${key}`,
      i - 1
    );

    while (j >= 0) {
      comparisons++;
      accesses += 2;
      const shouldShift = order === 'asc' ? arr[j] > key : arr[j] < key;

      pushStep(
        { [j]: 'comparing', [j + 1]: 'selected' },
        `Comparing key (${key}) with arr[${j}] (${arr[j]}). ${
          shouldShift ? `${arr[j]} ${order === 'asc' ? '>' : '<'} ${key}, shifting ${arr[j]} right.` : `${key} is in correct relative position.`
        }`,
        j + 1,
        4,
        `Scanning sorted subarray`,
        i - 1
      );

      if (shouldShift) {
        arr[j + 1] = arr[j];
        swaps++; // shift count
        accesses += 2;

        pushStep(
          { [j + 1]: 'swapping', [j]: 'selected' },
          `Shifted arr[${j}] (${arr[j + 1]}) right to index ${j + 1}.`,
          j,
          5,
          `Shifting elements`,
          i - 1
        );
        j--;
      } else {
        break;
      }
    }

    arr[j + 1] = key;
    accesses++;
    pushStep(
      { [j + 1]: 'sorted' },
      `Inserted key (${key}) at target index ${j + 1}. Sorted partition now covers [0..${i}].`,
      j + 1,
      6,
      `Key inserted`,
      i
    );
  }

  // Final sorted step
  const finalIndices: { [index: number]: ElementState } = {};
  for (let i = 0; i < n; i++) finalIndices[i] = 'sorted';
  steps.push({
    array: [...arr],
    indices: finalIndices,
    comparisons,
    swaps,
    accesses,
    description: 'Insertion Sort complete! Entire array is sorted.',
    phase: 'Completed',
    codeLine: 7
  });

  return steps;
}
