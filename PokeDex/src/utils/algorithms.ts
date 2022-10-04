export function binarySearchGTE<I, V>(
  array: I[],
  targetValue: V,
  valueExtractor: (item: I) => V = item => item as unknown as V
): number {
  'worklet';
  let leftIdx = 0;
  let rightIdx = array.length - 1;

  while (leftIdx <= rightIdx) {
    const midIdx = Math.floor((leftIdx + rightIdx) / 2);
    const midVal = valueExtractor(array[midIdx]);

    if (midVal <= targetValue) leftIdx = midIdx + 1;
    else if (midVal > targetValue) rightIdx = midIdx - 1;
  }

  return Math.max(0, rightIdx);
}
