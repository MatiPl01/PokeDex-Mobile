import React, { useState } from 'react';
import { View } from 'react-native';
import Svg from 'react-native-remote-svg';
import SkeletonPlaceholder from '@components/shared/react/SkeletonPlaceholder/SkeletonPlaceholder';
import { ImageExtension } from '@utils/files';
import {
  PlaceholderImageIcon,
  PokemonImage,
  PokemonSvg
} from './PokemonCardImage.style';

type PokemonCardImageProps = {
  extension: ImageExtension | null;
  imageUrl: string | null;
  width: number;
  height: number;
  onLoadEnd?: () => void;
  className?: string;
};

const PokemonCardImage: React.FC<PokemonCardImageProps> = ({
  extension,
  imageUrl,
  width,
  height,
  onLoadEnd
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleLoadEnd = () => {
    setIsImageLoading(false);
    if (onLoadEnd) onLoadEnd();
  };

  if (extension === 'svg') {
    return isImageLoading ? (
      <>
        {/* The Svg component below is used to determine if the Svg image was fetched from the server and finished loading. Using this Svg component to display the image results in showing cropped image. Therefore, another library is used for displaying the actual image */}
        <View style={{ opacity: 0 }}>
          <Svg source={{ uri: imageUrl }} onLoadEnd={handleLoadEnd} />
        </View>
        <SkeletonPlaceholder />
      </>
    ) : (
      <PokemonSvg width={width} height={height} uri={imageUrl} />
    );
  } else {
    return imageUrl ? (
      <>
        <PokemonImage
          source={{ uri: imageUrl }}
          onLoadEnd={handleLoadEnd}
          width={width}
          height={height}
          loading={isImageLoading}
        />
        {isImageLoading && <SkeletonPlaceholder />}
      </>
    ) : (
      <PlaceholderImageIcon name="question" size={height} />
    );
  }
};

export default React.memo(PokemonCardImage);
