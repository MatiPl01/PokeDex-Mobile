import { HeaderTab } from './StickyHeaderTab';

export const calcActiveTabIdx = (scrollY: number, tabs: HeaderTab[]) => {
  'worklet';

  let leftIdx = 0;
  let rightIdx = tabs.length - 1;

  while (leftIdx <= rightIdx) {
    const midIdx = Math.floor((leftIdx + rightIdx) / 2);

    if (tabs[midIdx].anchor <= scrollY) leftIdx = midIdx + 1;
    else if (tabs[midIdx].anchor > scrollY) rightIdx = midIdx - 1;
  }

  return Math.max(0, rightIdx);
};
