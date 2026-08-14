"use client";

import { useEffect, useState } from "react";

export function useIsDark() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    // Reads real DOM state, unavailable during SSR/the initial client
    // render — has to happen post-mount, not via a lazy initializer, or
    // the client's first render would mismatch the server's.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(root.dataset.theme === "dark");

    const observer = new MutationObserver(() => {
      setIsDark(root.dataset.theme === "dark");
    });
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}
