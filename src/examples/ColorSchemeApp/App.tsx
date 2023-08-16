import { useState } from "react";
// If running outside of this repository, replace with the following line.
// import { ColorSchemeSwitcherProvider } from "color-scheme-switcher";
import { ColorSchemeSwitcherProvider } from "@/.";

import { ColorSchemeOptionsToggler } from "@/examples/ColorSchemeApp/components";

interface ColorSchemeAppProps {}

const ColorSchemeApp: React.FC<ColorSchemeAppProps> = () => {
  // Set a default color scheme for the app.
  const DEFAULT_COLOR_SCHEME = "light";

  // Usually this `_colorScheme` state variable would be used in a component
  // library's theme provider. If your component library can use the
  // `colorSchemeIsLight` boolean as-is, wrap the theme provider in a component
  // that calls the `useColorSchemeSwitcher` hook and passes it to the theme.
  const [_colorScheme, setColorScheme] = useState<"dark" | "light">(
    DEFAULT_COLOR_SCHEME
  );

  // A callback to set the theme provider's color scheme variable when
  // `color-scheme-switcher`'s color scheme state changes.
  const setColorSchemeIsLightCallback = (colorSchemeIsLight: boolean) =>
    setColorScheme(colorSchemeIsLight ? "light" : "dark");

  return (
    <ColorSchemeSwitcherProvider
      defaultColorSchemeIsLight={DEFAULT_COLOR_SCHEME === "light"}
      setColorSchemeIsLightCallback={setColorSchemeIsLightCallback}
    >
      <ColorSchemeOptionsToggler />
    </ColorSchemeSwitcherProvider>
  );
};

export { ColorSchemeApp };
