import { useColorSchemeSwitcher } from "@/.";
import { Checkbox } from "@/examples/ColorSchemeApp/components";

interface ColorSchemeOptionsTogglerProps {}

// A simple component to demonstrate usage of the `useColorSchemeSwitcher` hook.
const ColorSchemeOptionsToggler: React.FC<
  ColorSchemeOptionsTogglerProps
> = () => {
  const {
    colorSchemeIsLight,
    colorSchemeIsManual,
    colorSchemeFollowsSun,
    setColorSchemeIsLight,
    setColorSchemeIsManual,
    setColorSchemeFollowsSun,
  } = useColorSchemeSwitcher();

  return (
    <div>
      <Checkbox
        label="Color Scheme is Manual"
        value={colorSchemeIsManual}
        setValue={setColorSchemeIsManual}
      />

      {colorSchemeIsManual ? (
        <Checkbox
          label="Color Scheme is Light"
          value={colorSchemeIsLight}
          setValue={setColorSchemeIsLight}
        />
      ) : (
        <Checkbox
          label="Color Scheme Follows Sun"
          value={colorSchemeFollowsSun}
          setValue={setColorSchemeFollowsSun}
        />
      )}
      <p>{`Color scheme is light? ${colorSchemeIsLight ? "yes" : "no"}`}</p>
      <p>{`Color scheme is manual? ${colorSchemeIsManual ? "yes" : "no"}`}</p>
      <p>{`Color scheme follows sun? ${
        colorSchemeFollowsSun ? "yes" : "no"
      }`}</p>
    </div>
  );
};

export { ColorSchemeOptionsToggler };
