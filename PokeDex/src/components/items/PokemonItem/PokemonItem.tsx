import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { PokemonItem as PokemonItemType } from '@store/pokemon/pokemon.types';
import SkeletonPlaceholder from '@components/shared/react/SkeletonPlaceholder/SkeletonPlaceholder';
import { Separator } from '@components/shared/styled/layout';
import {
  ItemCard,
  ImageWrapper,
  ItemImage,
  ImageSkeletonWrapper,
  CardColumn,
  CardRow,
  ItemName,
  ItemCostText,
  DollarIcon
} from './PokemonItem.styles';

type PokemonItemProps = {
  item: PokemonItemType | null;
  isLoading: boolean;
  height: number;
};

const PokemonItem: React.FC<PokemonItemProps> = ({
  item,
  isLoading,
  height
}) => {
  const theme = useTheme();
  const imageWrapperWidth = 0.8 * height;
  const [isImageLoading, setIsImageLoading] = useState(true);

  if (isLoading)
    return (
      <ItemCard>
        <SkeletonPlaceholder />
      </ItemCard>
    );

  if (!item) return null;

  return (
    <ItemCard>
      <ImageWrapper width={imageWrapperWidth}>
        <ItemImage
          source={{ uri: item.imageUrl }}
          onLoadEnd={() => setIsImageLoading(false)}
        />
        {isImageLoading && (
          <ImageSkeletonWrapper size={imageWrapperWidth}>
            <SkeletonPlaceholder />
          </ImageSkeletonWrapper>
        )}
      </ImageWrapper>
      <CardColumn>
        <ItemName>{item.name}</ItemName>
        <Separator height={theme.space.sm} />
        <CardRow>
          <DollarIcon name="dollar" />
          <Separator width={theme.space.xs} />
          <ItemCostText>{item.cost}</ItemCostText>
        </CardRow>
      </CardColumn>
    </ItemCard>
  );
};

export default PokemonItem;
