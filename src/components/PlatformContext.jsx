import React, { createContext, useContext, useState } from 'react';

const PlatformContext = createContext();

export const usePlatformContext = () => {
    return useContext(PlatformContext);
  };

export function PlatformContextProvider({ children }) {
    const [platform, setPlatform] = useState("tiktok")

    return (
        <PlatformContext.Provider value={{ platform, setPlatform }}>
          {children}
        </PlatformContext.Provider>
    );
}
