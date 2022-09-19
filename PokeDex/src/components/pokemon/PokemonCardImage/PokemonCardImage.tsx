import React, { useState } from 'react';
import Svg from 'react-native-remote-svg';
import { getImageExtensionFromUrl, isImageExtension } from '@utils/files';
import SkeletonPlaceholder from '@components/shared/react/SkeletonPlaceholder/SkeletonPlaceholder';
import { PlaceholderImageIcon } from '@components/shared/styled/images';
import { PokemonImage, PokemonSvg } from './PokemonCardImage.style';

type PokemonCardImageProps = {
  imageUrl: string | null;
  width: number;
  height: number;
  onLoadEnd?: () => void;
  className?: string;
};

const PokemonCardImage: React.FC<PokemonCardImageProps> = ({
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

  const extension = imageUrl && getImageExtensionFromUrl(imageUrl);

  if (extension === 'svg') {
    return isImageLoading ? (
      <>
        {/* The Svg component below is used to determine if the Svg image was fetched from the server and finished loading. Using this Svg component to display the image results in showing cropped image. Therefore, another library is used for displaying the actual image */}
        <Svg source={{ uri: imageUrl }} onLoadEnd={handleLoadEnd} />
        <SkeletonPlaceholder />
      </>
    ) : (
      <PokemonSvg width={width} height={height} uri={imageUrl} />
    );
  } else {
    return imageUrl && extension && isImageExtension(extension) ? (
      <>
        <PokemonImage
          source={{ uri: imageUrl }}
          onLoadEnd={handleLoadEnd}
          width={width}
          height={height}
        />
        {isImageLoading ? <SkeletonPlaceholder /> : null}
      </>
    ) : (
      <PlaceholderImageIcon name="question" size={height} />
    );
  }
};

export default React.memo(PokemonCardImage);
