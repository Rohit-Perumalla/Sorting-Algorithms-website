import { AlgorithmId, BenchmarkResult } from '../types/sorting';
import { getStepsForAlgorithm, ALGORITHMS } from '../algorithms';
import { generateArrayPreset } from './arrayGenerators';

export function runBenchmarkSuite(
  algorithmIds: AlgorithmId[],
  sizes: number[] = [10, 25, 50, 100],
  runsPerSize = 3
): BenchmarkResult[] {
  const results: BenchmarkResult[] = [];

  for (const size of sizes) {
    // Generate identical test arrays for all algorithms in each run for fair comparison
    const testArrays: number[][] = [];
    for (let r = 0; r < runsPerSize; r++) {
      testArrays.push(generateArrayPreset('random', size, 1, 500));
    }

    for (const algoId of algorithmIds) {
      const algoInfo = ALGORITHMS.find((a) => a.id === algoId);
      let totalTime = 0;
      let totalComparisons = 0;
      let totalSwaps = 0;
      let totalAccesses = 0;

      for (let r = 0; r < runsPerSize; r++) {
        const arrCopy = [...testArrays[r]];
        const t0 = performance.now();
        const steps = getStepsForAlgorithm(algoId, arrCopy, 'asc');
        const t1 = performance.now();

        const lastStep = steps[steps.length - 1];
        totalTime += t1 - t0;
        totalComparisons += lastStep.comparisons;
        totalSwaps += lastStep.swaps;
        totalAccesses += lastStep.accesses;
      }

      results.push({
        algorithmId: algoId,
        name: algoInfo ? algoInfo.name : algoId,
        size,
        timeMs: Number((totalTime / runsPerSize).toFixed(3)),
        comparisons: Math.round(totalComparisons / runsPerSize),
        swaps: Math.round(totalSwaps / runsPerSize),
        accesses: Math.round(totalAccesses / runsPerSize)
      });
    }
  }

  return results;
}
