import { createGenericContext } from "@/utils";

const [ColorSchemeSwitcherContext, useColorSchemeSwitcher] =
  createGenericContext<{
    colorSchemeIsLight: boolean;
    colorSchemeIsManual: boolean;
    colorSchemeFollowsSun: boolean;
    setColorSchemeIsLight: (v: boolean) => void;
    setColorSchemeIsManual: (v: boolean) => void;
    setColorSchemeFollowsSun: (v: boolean) => void;
    setColorSchemeIsLightCallback?: (v: boolean) => void;
  }>();

export { ColorSchemeSwitcherContext, useColorSchemeSwitcher };
