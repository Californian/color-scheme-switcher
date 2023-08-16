import { useEffect } from "react";

import {
  ColorSchemeSwitcherContext,
  useSystemColorSchemeIsLight,
  useSunPosition,
  useGeolocation,
  useLocalStorage,
} from "@/utils";

interface ColorSchemeSwitcherProviderProps {
  defaultColorSchemeIsLight?: boolean;
  setColorSchemeIsLightCallback?: (v: boolean) => void;
  children: React.ReactNode;
}

const ColorSchemeSwitcherProvider: React.FC<
  ColorSchemeSwitcherProviderProps
> = ({
  defaultColorSchemeIsLight = false,
  setColorSchemeIsLightCallback,
  children,
}) => {
    const systemColorSchemeIsLight = useSystemColorSchemeIsLight(
      defaultColorSchemeIsLight
    );

    const [colorSchemeIsLight, setColorSchemeIsLight] = useLocalStorage<boolean>({
      key: "color-scheme-is-light",
      defaultValue: systemColorSchemeIsLight,
    });

    const [colorSchemeIsManual, setColorSchemeIsManual] =
      useLocalStorage<boolean>({
        key: "color-scheme-is-manual",
        defaultValue: false,
      });

    const [colorSchemeFollowsSun, setColorSchemeFollowsSun] =
      useLocalStorage<boolean>({
        key: "color-scheme-follows-sun",
        defaultValue: false,
      });

    // Only get geolocation if needed, to prevent unnecessary permissions
    // requests.
    const shouldRequestLocation = !colorSchemeIsManual && !!colorSchemeFollowsSun;
    const {
      coords: { latitude, longitude, altitude },
    } = useGeolocation(shouldRequestLocation);

    const sunIsUp = useSunPosition(latitude, longitude, altitude ?? 0);

    const setColorSchemeIsLightWithCallback = (value: boolean) => {
      setColorSchemeIsLight(value);
      if (setColorSchemeIsLightCallback) {
        setColorSchemeIsLightCallback(value);
      }
    };

    useEffect(() => {
      if (!colorSchemeIsManual) {
        if (colorSchemeFollowsSun) {
          setColorSchemeIsLightWithCallback(sunIsUp ?? defaultColorSchemeIsLight);
        } else {
          setColorSchemeIsLightWithCallback(
            systemColorSchemeIsLight ?? defaultColorSchemeIsLight
          );
        }
      }
    }, [
      colorSchemeIsManual,
      colorSchemeFollowsSun,
      sunIsUp,
      systemColorSchemeIsLight,
    ]);

    const providerValues = {
      colorSchemeIsLight: colorSchemeIsLight ?? false,
      colorSchemeIsManual: colorSchemeIsManual ?? false,
      colorSchemeFollowsSun: colorSchemeFollowsSun ?? false,
      setColorSchemeIsLight: setColorSchemeIsLightWithCallback,
      setColorSchemeIsManual,
      setColorSchemeFollowsSun,
    };

    return (
      <ColorSchemeSwitcherContext.Provider value={providerValues}>
        {children}
      </ColorSchemeSwitcherContext.Provider>
    );
  };

export { ColorSchemeSwitcherProvider };
