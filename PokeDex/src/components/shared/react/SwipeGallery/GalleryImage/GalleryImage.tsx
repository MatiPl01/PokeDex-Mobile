import React, { useState } from 'react';
import Svg from 'react-native-remote-svg';
import { SvgUri } from 'react-native-svg';
import { Dimensions } from '@types';
import { getImageExtensionFromUrl, isImageExtension } from '@utils/files';
import { PlaceholderImageIcon } from '@components/shared/styled/images';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { ImageWrapper, Image } from './GalleryImage.styles';

type GalleryImageProps = {
  url: string;
  dimensions: Dimensions;
};

const GalleryImage: React.FC<GalleryImageProps> = ({
  url,
  dimensions: { width, height }
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const extension = getImageExtensionFromUrl(url);

  const handleLoadEnd = () => setIsImageLoading(false);

  const renderImage = () => {
    if (extension === 'svg') {
      return isImageLoading ? (
        <>
          <Svg
            source={{ uri: url }}
            style={{ opacity: 0 }}
            onLoadEnd={handleLoadEnd}
          />
          <LoadingSpinner />
        </>
      ) : (
        <SvgUri uri={url} width={width} height={height} />
      );
    } else if (extension && isImageExtension(extension)) {
      return (
        <>
          <Image
            source={{ uri: url }}
            width={width}
            height={height}
            resizeMode="contain"
            onLoadEnd={handleLoadEnd}
          />
          {isImageLoading ? <LoadingSpinner /> : null}
        </>
      );
    } else {
      return (
        <PlaceholderImageIcon
          name="question"
          size={0.9 * Math.min(height, width)}
        />
      );
    }
  };

  return <ImageWrapper>{renderImage()}</ImageWrapper>;
};

export default React.memo(GalleryImage);
