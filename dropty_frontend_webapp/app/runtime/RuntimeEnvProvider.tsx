"use client"

import React, { createContext, useContext, useEffect, useState } from "react";

type RuntimeEnv = {
  PORT?: string;
  [key: string]: any;
};

const RuntimeEnvContext = createContext<RuntimeEnv | null>(null);

export function RuntimeEnvProvider({ children }: { children: React.ReactNode }) {
  const [env, setEnv] = useState<RuntimeEnv | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // If the runtime script already set the value, use it
    if ((window as any).__RUNTIME_ENV__) {
      setEnv((window as any).__RUNTIME_ENV__ as RuntimeEnv);
      return;
    }

    // Otherwise load /runtime-env.js which should set window.__RUNTIME_ENV__
    const script = document.createElement("script");
    script.src = "/runtime-env.js";
    script.async = true;
    script.onload = () => {
      setEnv((window as any).__RUNTIME_ENV__ || {});
    };
    script.onerror = () => {
      // If the file is not found or fails, still set an empty object
      setEnv({});
    };
    document.head.appendChild(script);

    return () => {
      try {
        document.head.removeChild(script);
      } catch (e) {
        /* ignore */
      }
    };
  }, []);

  return (
    <RuntimeEnvContext.Provider value={env || {}}>
      {children}
    </RuntimeEnvContext.Provider>
  );
}

export function useRuntimeEnv() {
  const ctx = useContext(RuntimeEnvContext);
  if (ctx === null) {
    // If used outside of provider, return empty object to avoid runtime crashes
    return {} as RuntimeEnv;
  }
  return ctx as RuntimeEnv;
}
