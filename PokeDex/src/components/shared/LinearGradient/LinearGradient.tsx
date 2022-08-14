import React from 'react';
import OriginalLinearGradient, {
  LinearGradientProps as OriginalLinearGradientProps
} from 'react-native-linear-gradient';

interface LinearGradientProps
  extends Omit<OriginalLinearGradientProps, 'start' | 'end'> {
  startPoint: OriginalLinearGradientProps['start'];
  endPoint: OriginalLinearGradientProps['end'];
}

export const LinearGradient: React.FC<LinearGradientProps> = ({
  startPoint,
  endPoint,
  ...props
}) => <OriginalLinearGradient start={startPoint} end={endPoint} {...props} />;
