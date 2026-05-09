"use client";

import { useEffect } from "react";

export default function PageReady() {
  useEffect(() => {
    const showApp = () => {
      document.getElementById("app-content")!.style.visibility = "visible";
      document.getElementById("global-loader")!.style.display = "none";
    };

    // Safety backup (4 seconds)
    const timeout = setTimeout(showApp, 4000);

    if (document.readyState === "complete") {
      showApp();
    } else {
      window.addEventListener("load", showApp);
    }

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("load", showApp);
    };
  }, []);

  return null;
}
