export type ImageExtension = 'svg' | 'png';

export const getFileExtensionFromUrl = (url: string) =>
  url
    .match(/\.[a-zA-Z]+$/)?.[0]
    ?.slice(1)
    .toLowerCase() || '';

export const isImageExtension = (
  extension: string
): extension is ImageExtension => {
  return ['svg', 'png'].includes(extension);
};

export const getImageExtensionFromUrl = (
  url: string
): ImageExtension | null => {
  const extension = getFileExtensionFromUrl(url);
  return isImageExtension(extension) ? extension : null;
};
