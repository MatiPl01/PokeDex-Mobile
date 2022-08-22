import React from 'react';
import SortableGridItemWrapper, {
  SortableGridItemProps
} from './SortableGridItemWrapper';

export type SortableGridRenderItemProps<T> = SortableGridItemProps & {
  renderItem: (item: T, width: number, height: number) => JSX.Element;
  item: T;
};

const SortableGridRenderItem = <T extends object>(
  props: SortableGridRenderItemProps<T>
) => {
  const { renderItem, item, ...restProps } = props;
  const { itemWidth, itemHeight } = props.gridConfig.value;

  return (
    <SortableGridItemWrapper {...restProps}>
      {renderItem(item, itemWidth, itemHeight)}
    </SortableGridItemWrapper>
  );
};

export default React.memo(
  SortableGridRenderItem
) as typeof SortableGridRenderItem;
