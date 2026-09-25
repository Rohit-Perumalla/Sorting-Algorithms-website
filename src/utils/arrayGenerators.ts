export type ArrayPresetType = 'random' | 'nearly-sorted' | 'reversed' | 'few-unique';

export function generateArrayPreset(type: ArrayPresetType, size: number, min = 10, max = 100): number[] {
  const result: number[] = [];
  const range = max - min;

  switch (type) {
    case 'random': {
      for (let i = 0; i < size; i++) {
        result.push(Math.floor(Math.random() * range) + min);
      }
      break;
    }
    case 'nearly-sorted': {
      // Start sorted
      for (let i = 0; i < size; i++) {
        const val = Math.round(min + (i / (size - 1 || 1)) * range);
        result.push(val);
      }
      // Perform 2 to 3 random swaps
      const swapCount = Math.max(1, Math.floor(size * 0.1));
      for (let s = 0; s < swapCount; s++) {
        const idx1 = Math.floor(Math.random() * size);
        const idx2 = Math.floor(Math.random() * size);
        const temp = result[idx1];
        result[idx1] = result[idx2];
        result[idx2] = temp;
      }
      break;
    }
    case 'reversed': {
      for (let i = 0; i < size; i++) {
        const val = Math.round(max - (i / (size - 1 || 1)) * range);
        result.push(val);
      }
      break;
    }
    case 'few-unique': {
      // Only 3-5 distinct values
      const distinctVals = [
        min + Math.floor(range * 0.2),
        min + Math.floor(range * 0.5),
        min + Math.floor(range * 0.8)
      ];
      for (let i = 0; i < size; i++) {
        const pick = distinctVals[Math.floor(Math.random() * distinctVals.length)];
        result.push(pick);
      }
      break;
    }
  }

  return result;
}

export function parseCustomArrayInput(input: string): { valid: boolean; numbers: number[]; error?: string } {
  const cleaned = input.trim();
  if (!cleaned) {
    return { valid: false, numbers: [], error: 'Input cannot be empty.' };
  }

  // Split by comma, space, or semicolon
  const tokens = cleaned.split(/[\s,;]+/).filter(Boolean);
  if (tokens.length < 3) {
    return { valid: false, numbers: [], error: 'Please enter at least 3 numbers.' };
  }
  if (tokens.length > 80) {
    return { valid: false, numbers: [], error: 'Please enter at most 80 numbers for clean visualization.' };
  }

  const numbers: number[] = [];
  for (const token of tokens) {
    const num = Number(token);
    if (isNaN(num)) {
      return { valid: false, numbers: [], error: `Invalid number: "${token}"` };
    }
    if (num < 1 || num > 999) {
      return { valid: false, numbers: [], error: `Numbers must be between 1 and 999 (found ${num}).` };
    }
    numbers.push(Math.round(num));
  }

  return { valid: true, numbers };
}
