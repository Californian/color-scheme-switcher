import { useState, useEffect, useRef } from "react";

type MediaQueryCallback = (event: { matches: boolean; media: string }) => void;

/**
 * Older versions of Safari (shipped with Catalina and before) do not support
 * addEventListener on matchMedia https://stackoverflow.com/questions/56466261/matchmedia-addlistener-marked-as-deprecated-addeventlistener-equivalent
 * */
function attachMediaListener(
  query: MediaQueryList,
  callback: MediaQueryCallback
) {
  try {
    query.addEventListener("change", callback);
    return () => query.removeEventListener("change", callback);
  } catch (e) {
    // @ts-ignore
    query.addListener(callback);
    // @ts-ignore
    return () => query.removeListener(callback);
  }
}

const useSystemColorSchemeIsLight = (
  defaultColorSchemeIsLight: boolean = false
) => {
  const queryRef = useRef<MediaQueryList>();

  const [matches, setMatches] = useState(defaultColorSchemeIsLight);

  useEffect(() => {
    if ("matchMedia" in window) {
      queryRef.current = window.matchMedia("(prefers-color-scheme: light)");
      setMatches(queryRef.current.matches);
      return attachMediaListener(queryRef.current, (event) => {
        setMatches(event.matches);
      });
    }

    return undefined;
  }, []);

  return matches;
};

export { useSystemColorSchemeIsLight };
