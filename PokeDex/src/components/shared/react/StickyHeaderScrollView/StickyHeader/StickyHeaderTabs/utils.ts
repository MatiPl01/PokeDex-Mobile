import { binarySearchGTE } from '@utils/algorithms';
import { HeaderTab } from './StickyHeaderTab';

export const calcActiveTabIdx = (scrollY: number, tabs: HeaderTab[]) => {
  'worklet';
  return binarySearchGTE(tabs, scrollY, tab => tab.anchor);
};

export const calcActiveTabIdxOnTabsScroll = (
  scrollX: number,
  tabOffsets: number[]
) => {
  'worklet';
  const offsetBeforeIdx = binarySearchGTE(tabOffsets, scrollX);
  const offsetBefore = tabOffsets[offsetBeforeIdx];
  const offsetAfter = tabOffsets[offsetBeforeIdx + 1];

  if (offsetAfter)
    return offsetBeforeIdx + +(offsetAfter - scrollX < scrollX - offsetBefore);
  return offsetBeforeIdx;
};

export const calcTabOffsets = (tabWidths: number[], gap: number) => {
  'worklet';
  return tabWidths.reduce(
    (result, tabWidth, idx) => {
      result.push(result[idx] + tabWidth + gap);
      return result;
    },
    [0]
  );
};

export const calcActiveTabBackgroundWidth = (
  scrollX: number,
  tabWidths: number[],
  tabOffsets: number[]
) => {
  'worklet';
  if (!tabOffsets.length) return 0;
  const offsetBeforeIdx = binarySearchGTE(tabOffsets, scrollX);

  const offsetBefore = tabOffsets[offsetBeforeIdx];
  const offsetAfter = tabOffsets[offsetBeforeIdx + 1];
  const scrollPercent = (scrollX - offsetBefore) / (offsetAfter - offsetBefore);

  // console.log({
  //   tabWidths,
  //   tabOffsets,
  //   offsetBefore,
  //   offsetAfter,
  //   scrollPercent
  // });

  const prevWidth = tabWidths[offsetBeforeIdx];
  const nextWidth = tabWidths[offsetBeforeIdx + 1];

  // console.log({ prevWidth, scrollX, offsetBefore });

  return nextWidth
    ? prevWidth + scrollPercent * (nextWidth - prevWidth)
    : prevWidth / (1 + (scrollX - offsetBefore) / 1000) || 0;
};

export const calcTabsScrollOffset = (
  activeTabIdx: number,
  tabWidths: number[],
  sepWidth: number
) => {
  'worklet';
  let total = 0;
  for (let i = 0; i < activeTabIdx; i++) total += tabWidths[i] + sepWidth;
  return total;
};
