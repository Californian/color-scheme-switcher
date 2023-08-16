// If running outside of this repository, replace with the following line.
// import { ColorSchemeSwitcherProvider } from "color-scheme-switcher";
import { ColorSchemeSwitcherProvider } from "@/.";
import { ColorSchemeOptionsToggler } from "@/examples/ColorSchemeApp/components";

interface ColorSchemeAppProps {}

const ColorSchemeApp: React.FC<ColorSchemeAppProps> = () => {
  return (
    <ColorSchemeSwitcherProvider>
      <ColorSchemeOptionsToggler />
    </ColorSchemeSwitcherProvider>
  );
};

export { ColorSchemeApp };
