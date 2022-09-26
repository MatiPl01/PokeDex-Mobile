import React, { createContext, useContext, useState } from 'react';

type FullScreenContextProps = {
  isFullScreenEnabled: boolean;
  enableFullScreen: () => void;
  disableFullScreen: () => void;
  toggleFullScreen: () => void;
};

const FullScreenContext = createContext<FullScreenContextProps>({
  isFullScreenEnabled: false,
  enableFullScreen: () => undefined,
  disableFullScreen: () => undefined,
  toggleFullScreen: () => undefined
});

export const useFullScreenContext = () => useContext(FullScreenContext);

type FullScreenProviderProps = {
  children: React.ReactNode;
};

export const FullScreenProvider: React.FC<FullScreenProviderProps> = ({
  children
}) => {
  const [isFullScreenEnabled, setIsFullScreenEnabled] = useState(false);

  const fullScreenContextValue: FullScreenContextProps = {
    isFullScreenEnabled,
    enableFullScreen: () => setIsFullScreenEnabled(true),
    disableFullScreen: () => setIsFullScreenEnabled(false),
    toggleFullScreen: () => setIsFullScreenEnabled(!isFullScreenEnabled)
  };

  return (
    <FullScreenContext.Provider value={fullScreenContextValue}>
      {children}
    </FullScreenContext.Provider>
  );
};
