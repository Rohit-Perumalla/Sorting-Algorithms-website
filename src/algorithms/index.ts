import { AlgorithmId, AlgorithmInfo, SortStep } from '../types/sorting';
import { generateBubbleSortSteps } from './bubbleSort';
import { generateSelectionSortSteps } from './selectionSort';
import { generateInsertionSortSteps } from './insertionSort';
import { generateMergeSortSteps } from './mergeSort';
import { generateQuickSortSteps } from './quickSort';
import { generateHeapSortSteps } from './heapSort';

export {
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
  generateMergeSortSteps,
  generateQuickSortSteps,
  generateHeapSortSteps
};

export const ALGORITHMS: AlgorithmInfo[] = [
  {
    id: 'bubble',
    name: 'Bubble Sort',
    category: 'Exchange Sort',
    shortDesc: 'Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    bestTime: 'O(n)',
    avgTime: 'O(n²)',
    worstTime: 'O(n²)',
    spaceComplexity: 'O(1)',
    isStable: true,
    isInPlace: true,
    pseudocode: [
      'procedure bubbleSort(A : list of sortable items)',
      '    n := length(A)',
      '    repeat',
      '        swapped := false',
      '        for i := 1 to n-1 inclusive do',
      '            if A[i-1] > A[i] then',
      '                swap(A[i-1], A[i])',
      '                swapped := true',
      '            end if',
      '        end for',
      '        n := n - 1',
      '    until not swapped',
      'end procedure'
    ],
    explanation:
      'Bubble Sort works by repeatedly swapping adjacent elements that are out of order. In each full pass, the largest remaining element bubbles up to its final position at the end of the array. An optimized version detects if no swaps occurred during a pass and terminates early in O(n) best-case time.',
    pros: ['Very simple to implement and understand', 'O(1) auxiliary space (in-place)', 'Stable sorting algorithm', 'Detects already sorted arrays in O(n)'],
    cons: ['O(n²) time complexity makes it impractical for large datasets', 'Excessive swaps compared to selection or insertion sort'],
    idealFor: 'Teaching foundational algorithmic concepts, or detecting if a small array is already sorted.'
  },
  {
    id: 'selection',
    name: 'Selection Sort',
    category: 'Selection Sort',
    shortDesc: 'Divides input into sorted and unsorted regions, repeatedly finding the minimum element from the unsorted region.',
    bestTime: 'O(n²)',
    avgTime: 'O(n²)',
    worstTime: 'O(n²)',
    spaceComplexity: 'O(1)',
    isStable: false,
    isInPlace: true,
    pseudocode: [
      'procedure selectionSort(A : list of sortable items)',
      '    n := length(A)',
      '    for i := 0 to n - 2 do',
      '        minIndex := i',
      '        for j := i + 1 to n - 1 do',
      '            if A[j] < A[minIndex] then',
      '                minIndex := j',
      '            end if',
      '        end for',
      '        if minIndex != i then',
      '            swap(A[i], A[minIndex])',
      '        end if',
      '    end for',
      'end procedure'
    ],
    explanation:
      'Selection Sort maintains two subarrays: a sorted sublist built from left to right, and the remaining unsorted sublist. On every iteration, it scans the entire unsorted sublist to find the minimum value, then swaps it into the first unsorted position. It always performs exactly O(n) swaps, making it useful when memory write cycles are expensive.',
    pros: ['Guaranteed at most n swaps (minimal memory writes)', 'O(1) extra memory (in-place)', 'Consistent performance regardless of initial ordering'],
    cons: ['Always O(n²) comparisons even if input is already sorted', 'Not stable in standard array implementation'],
    idealFor: 'Systems where writing to memory/EEPROM/flash is significantly more costly than reading.'
  },
  {
    id: 'insertion',
    name: 'Insertion Sort',
    category: 'Insertion Sort',
    shortDesc: 'Builds the final sorted array one item at a time by consuming one element per iteration and inserting it into place.',
    bestTime: 'O(n)',
    avgTime: 'O(n²)',
    worstTime: 'O(n²)',
    spaceComplexity: 'O(1)',
    isStable: true,
    isInPlace: true,
    pseudocode: [
      'procedure insertionSort(A : list of sortable items)',
      '    for i := 1 to length(A) - 1 do',
      '        key := A[i]',
      '        j := i - 1',
      '        while j >= 0 and A[j] > key do',
      '            A[j + 1] := A[j]',
      '            j := j - 1',
      '        end while',
      '        A[j + 1] := key',
      '    end for',
      'end procedure'
    ],
    explanation:
      'Insertion Sort mimics the way people sort playing cards in their hands. It iterates through the array from index 1 to n-1. For each element (key), it scans backwards through the already sorted subarray, shifting larger elements one position to the right until the correct slot for key is found.',
    pros: ['Extremely fast for small arrays (n < 20)', 'Adaptive: O(n) on already sorted or nearly sorted data', 'Stable and in-place (O(1) space)', 'Online: can sort data as it arrives in a stream'],
    cons: ['O(n²) worst and average case on large randomized arrays', 'Requires many individual array shifts'],
    idealFor: 'Small inputs, nearly-sorted datasets, and as the base case in hybrid algorithms like Timsort and Introsort.'
  },
  {
    id: 'merge',
    name: 'Merge Sort',
    category: 'Divide & Conquer',
    shortDesc: 'Divides the array into two halves, recursively sorts them, and merges the two sorted halves into a single sorted array.',
    bestTime: 'O(n log n)',
    avgTime: 'O(n log n)',
    worstTime: 'O(n log n)',
    spaceComplexity: 'O(n)',
    isStable: true,
    isInPlace: false,
    pseudocode: [
      'procedure mergeSort(A : list of sortable items)',
      '    if length(A) <= 1 then return A',
      '    mid := length(A) / 2',
      '    left := mergeSort(A[0..mid-1])',
      '    right := mergeSort(A[mid..end])',
      '    return merge(left, right)',
      'end procedure',
      '',
      'procedure merge(left, right)',
      '    result := empty list',
      '    while left and right are not empty do',
      '        if left[0] <= right[0] then',
      '            append left[0] to result; drop left[0]',
      '        else',
      '            append right[0] to result; drop right[0]',
      '        end if',
      '    end while',
      '    append remaining left and right to result',
      '    return result',
      'end procedure'
    ],
    explanation:
      'Merge Sort uses a divide-and-conquer paradigm. It splits the array in half repeatedly until subarrays have 1 element, which are trivially sorted. Then, it zips together pairs of sorted arrays into larger sorted arrays in linear time O(n). It guarantees O(n log n) running time even in the worst case.',
    pros: ['Guaranteed O(n log n) worst-case time', 'Stable sorting (preserves original order of duplicates)', 'Predictable, consistent runtime', 'Ideal for linked lists and external disk sorting'],
    cons: ['Requires O(n) additional auxiliary memory for merging', 'Higher constant overhead than Quick Sort for small in-memory arrays'],
    idealFor: 'Applications requiring guaranteed predictable performance, stability, or sorting large files on external disk storage.'
  },
  {
    id: 'quick',
    name: 'Quick Sort',
    category: 'Divide & Conquer',
    shortDesc: 'Selects a pivot element and partitions the array into values smaller than and greater than the pivot, then recurses.',
    bestTime: 'O(n log n)',
    avgTime: 'O(n log n)',
    worstTime: 'O(n²)',
    spaceComplexity: 'O(log n)',
    isStable: false,
    isInPlace: true,
    pseudocode: [
      'procedure quickSort(A, low, high)',
      '    if low < high then',
      '        p := partition(A, low, high)',
      '        quickSort(A, low, p - 1)',
      '        quickSort(A, p + 1, high)',
      '    end if',
      'end procedure',
      '',
      'procedure partition(A, low, high)',
      '    pivot := A[high]',
      '    i := low - 1',
      '    for j := low to high - 1 do',
      '        if A[j] <= pivot then',
      '            i := i + 1',
      '            swap(A[i], A[j])',
      '        end if',
      '    end for',
      '    swap(A[i + 1], A[high])',
      '    return i + 1',
      'end procedure'
    ],
    explanation:
      'Quick Sort operates by picking a pivot element from the array and partitioning other elements into two sub-arrays according to whether they are less than or greater than the pivot. The sub-arrays are then sorted recursively. With excellent CPU cache locality, it is often 2-3x faster in practice than Merge Sort and Heap Sort.',
    pros: ['Extremely fast average-case performance with high CPU cache locality', 'In-place sorting with O(log n) call stack space', 'Easily parallelizable'],
    cons: ['O(n²) worst-case when pivot choices are poor (e.g. sorted array with last element pivot)', 'Unstable sorting algorithm'],
    idealFor: 'General-purpose in-memory sorting where average-case speed and low memory footprint are top priorities.'
  },
  {
    id: 'heap',
    name: 'Heap Sort',
    category: 'Selection Sort',
    shortDesc: 'Converts the array into a binary max-heap, then repeatedly extracts the maximum root element and sifts down.',
    bestTime: 'O(n log n)',
    avgTime: 'O(n log n)',
    worstTime: 'O(n log n)',
    spaceComplexity: 'O(1)',
    isStable: false,
    isInPlace: true,
    pseudocode: [
      'procedure heapSort(A : list of sortable items)',
      '    buildMaxHeap(A)',
      '    for i := length(A) - 1 down to 1 do',
      '        swap(A[0], A[i])',
      '        heapify(A, i, 0)',
      '    end for',
      'end procedure',
      '',
      'procedure heapify(A, size, root)',
      '    largest := root',
      '    left := 2 * root + 1',
      '    right := 2 * root + 2',
      '    if left < size and A[left] > A[largest] then largest := left',
      '    if right < size and A[right] > A[largest] then largest := right',
      '    if largest != root then',
      '        swap(A[root], A[largest])',
      '        heapify(A, size, largest)',
      '    end if',
      'end procedure'
    ],
    explanation:
      'Heap Sort utilizes a complete binary heap data structure built directly within the array without pointers. After constructing a Max-Heap in O(n) time, the maximum element is at the root (index 0). It swaps the root with the last unsorted element, shrinks heap size by 1, and sifts down the new root in O(log n) time.',
    pros: ['Guaranteed O(n log n) runtime across all cases (best, average, worst)', 'True O(1) in-place auxiliary memory', 'No recursive stack overflow risk'],
    cons: ['Poor CPU cache locality due to index jumps (2*i + 1)', 'Unstable sorting algorithm', 'Slightly slower constant factor than optimized Quick Sort'],
    idealFor: 'Embedded, safety-critical, or memory-constrained real-time systems requiring strict O(n log n) guarantees without recursion.'
  }
];

export function getStepsForAlgorithm(
  algorithmId: AlgorithmId,
  array: number[],
  order: 'asc' | 'desc' = 'asc'
): SortStep[] {
  switch (algorithmId) {
    case 'bubble':
      return generateBubbleSortSteps(array, order);
    case 'selection':
      return generateSelectionSortSteps(array, order);
    case 'insertion':
      return generateInsertionSortSteps(array, order);
    case 'merge':
      return generateMergeSortSteps(array, order);
    case 'quick':
      return generateQuickSortSteps(array, order);
    case 'heap':
      return generateHeapSortSteps(array, order);
    default:
      return generateBubbleSortSteps(array, order);
  }
}
