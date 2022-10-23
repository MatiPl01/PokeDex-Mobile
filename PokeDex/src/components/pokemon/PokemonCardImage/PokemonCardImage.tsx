import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Svg from 'react-native-remote-svg';
import { useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { getImageExtensionFromUrl, isImageExtension } from '@utils/files';
import { createAnimatedStyles } from '@utils/reanimated';
import SkeletonPlaceholder from '@components/shared/react/SkeletonPlaceholder/SkeletonPlaceholder';
import { PlaceholderImageIcon } from '@components/shared/styled/images';
import { PokemonImage, PokemonSvg, Wrapper } from './PokemonCardImage.style';

const useAnimatedVisibilityStyles = createAnimatedStyles({
  image: {
    opacity: [0, 1]
  },
  skeleton: {
    opacity: [1, 0]
  }
});

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
  const skeletonVisibilityAnimationProgress = useSharedValue(0);
  const animatedVisibilityStyle = useAnimatedVisibilityStyles(
    skeletonVisibilityAnimationProgress
  );

  useEffect(() => {
    skeletonVisibilityAnimationProgress.value = withDelay(
      200,
      withTiming(+!isImageLoading, {
        duration: 300
      })
    );
  }, [isImageLoading]);

  const handleLoadEnd = () => {
    setIsImageLoading(false);
    if (onLoadEnd) onLoadEnd();
  };

  const extension = imageUrl && getImageExtensionFromUrl(imageUrl);

  const renderImage = () => {
    if (extension === 'svg') {
      return (
        <>
          {isImageLoading ? (
            <>
              {/* The Svg component below is used to determine if the Svg image was fetched from the server and finished loading. Using this Svg component to display the image results in showing cropped image. Therefore, another library is used for displaying the actual image */}
              <View style={{ opacity: 0 }}>
                <Svg source={{ uri: imageUrl }} onLoadEnd={handleLoadEnd} />
              </View>
            </>
          ) : (
            <PokemonSvg width={width} height={height} uri={imageUrl} />
          )}
        </>
      );
    } else {
      return imageUrl && extension && isImageExtension(extension) ? (
        <>
          <PokemonImage
            source={{ uri: imageUrl }}
            onLoadEnd={handleLoadEnd}
            width={width}
            height={height}
            loading={isImageLoading}
          />
        </>
      ) : (
        <PlaceholderImageIcon name="question" size={height} />
      );
    }
  };

  return (
    <>
      <Wrapper style={animatedVisibilityStyle.image}>{renderImage()}</Wrapper>
      <Wrapper style={animatedVisibilityStyle.skeleton}>
        <SkeletonPlaceholder />
      </Wrapper>
    </>
  );
};

export default React.memo(PokemonCardImage);
