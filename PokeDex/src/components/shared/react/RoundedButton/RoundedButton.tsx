import React, { PropsWithChildren } from 'react';
import { Button, ButtonText } from './RoundedButton.styles';

type RoundedButtonProps = PropsWithChildren<{
  onPress: () => void;
}>;

const RoundedButton: React.FC<RoundedButtonProps> = ({ onPress, children }) => (
  <Button onPress={onPress}>
    <ButtonText>{children}</ButtonText>
  </Button>
);

export default RoundedButton;
