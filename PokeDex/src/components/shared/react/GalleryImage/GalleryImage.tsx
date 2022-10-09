import React, { useState } from 'react';
import Svg from 'react-native-remote-svg';
import { SvgUri } from 'react-native-svg';
import { Dimensions } from '@types';
import { getImageExtensionFromUrl, isImageExtension } from '@utils/files';
import { PlaceholderImageIcon } from '@components/shared/styled/images';
import LoadingSpinner from '@components/shared/react/LoadingSpinner/LoadingSpinner';
import SkeletonPlaceholder from '@components/shared/react/SkeletonPlaceholder/SkeletonPlaceholder';
import { ImageWrapper, Image } from './GalleryImage.styles';

type LoadingIndicatorType = 'spinner' | 'skeleton' | 'none';

const renderLoadingIndicator = (type: LoadingIndicatorType, size: number) => {
  switch (type) {
    case 'spinner':
      return <LoadingSpinner size={size} />;
    case 'skeleton':
      return <SkeletonPlaceholder />;
    default:
      return null;
  }
};

type GalleryImageProps = {
  url: string;
  dimensions: Dimensions;
  loadingIndicatorType?: LoadingIndicatorType;
};

const GalleryImage: React.FC<GalleryImageProps> = ({
  url,
  dimensions: { width, height },
  loadingIndicatorType = 'spinner'
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const extension = getImageExtensionFromUrl(url);

  // Useful only if loadingIndicatorType is set to 'spinner'
  const spinnerSize = 0.5 * Math.min(width, height);

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
          {renderLoadingIndicator(loadingIndicatorType, spinnerSize)}
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
          {isImageLoading
            ? renderLoadingIndicator(loadingIndicatorType, spinnerSize)
            : null}
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
