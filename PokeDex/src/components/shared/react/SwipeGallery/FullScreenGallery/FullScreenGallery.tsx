import React from 'react';
import { Modal } from 'react-native';

export type FullScreenGalleryProps = {
  visible: boolean;
};

const FullScreenGallery: React.FC<FullScreenGalleryProps> = ({ visible }) => {
  return <Modal visible={visible}></Modal>;
};

export default FullScreenGallery;
