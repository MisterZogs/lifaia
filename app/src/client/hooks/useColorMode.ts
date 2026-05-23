import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

export default function useColorMode() {
  const [colorMode, setColorMode] = useLocalStorage("color-theme", "dark");

  useEffect(() => {
    const className = "dark";
    const htmlClass = window.document.documentElement.classList;

    colorMode === "dark"
      ? htmlClass.add(className)
      : htmlClass.remove(className);
  }, [colorMode]);

  return [colorMode, setColorMode];
}
