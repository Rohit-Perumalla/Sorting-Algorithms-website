import { SortStep, ElementState } from '../types/sorting';

export function generateBubbleSortSteps(initialArray: number[], order: 'asc' | 'desc' = 'asc'): SortStep[] {
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
    pass?: number,
    codeLine?: number
  ) => {
    const fullIndices: { [index: number]: ElementState } = {};
    for (let i = 0; i < n; i++) {
      if (sortedIndices.has(i)) {
        fullIndices[i] = 'sorted';
      } else if (indices[i]) {
        fullIndices[i] = indices[i];
      } else {
        fullIndices[i] = 'default';
      }
    }
    steps.push({
      array: [...arr],
      indices: fullIndices,
      comparisons,
      swaps,
      accesses,
      description,
      phase: pass ? `Pass ${pass} of ${n - 1}` : 'Initial state',
      codeLine,
      meta: { pass }
    });
  };

  pushStep({}, 'Initial array before Bubble Sort starts', 0, 1);

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    const currentPass = i + 1;

    for (let j = 0; j < n - i - 1; j++) {
      // Comparison step
      comparisons++;
      accesses += 2;
      const shouldSwap = order === 'asc' ? arr[j] > arr[j + 1] : arr[j] < arr[j + 1];

      pushStep(
        { [j]: 'comparing', [j + 1]: 'comparing' },
        `Comparing array[${j}] (${arr[j]}) and array[${j + 1}] (${arr[j + 1]}). ${
          shouldSwap ? `${arr[j]} ${order === 'asc' ? '>' : '<'} ${arr[j + 1]}, swap needed.` : 'Already in order, no swap.'
        }`,
        currentPass,
        3
      );

      if (shouldSwap) {
        // Swap values
        swaps++;
        accesses += 4;
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swapped = true;

        pushStep(
          { [j]: 'swapping', [j + 1]: 'swapping' },
          `Swapped array[${j}] and array[${j + 1}] -> (${arr[j]}, ${arr[j + 1]})`,
          currentPass,
          5
        );
      }
    }

    // After pass i, the element at n - 1 - i is guaranteed sorted
    sortedIndices.add(n - 1 - i);
    pushStep(
      {},
      `Pass ${currentPass} complete. Element ${arr[n - 1 - i]} is sorted into position ${n - 1 - i}.`,
      currentPass,
      7
    );

    // If no two elements were swapped by inner loop, array is sorted
    if (!swapped) {
      for (let k = 0; k < n; k++) sortedIndices.add(k);
      pushStep(
        {},
        'No swaps occurred in this pass! Early termination: array is completely sorted.',
        currentPass,
        8
      );
      break;
    }
  }

  // Mark all as sorted in the end
  for (let k = 0; k < n; k++) sortedIndices.add(k);
  pushStep({}, 'Bubble sort finished! All elements sorted.', n - 1, 9);

  return steps;
}
