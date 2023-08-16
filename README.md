# Color Scheme Switcher

![NPM Version](https://flat.badgen.net/npm/v/color-scheme-switcher)
![License](https://flat.badgen.net/npm/license/color-scheme-switcher)
![Minzipped
Size](https://flat.badgen.net/bundlephobia/minzip/color-scheme-switcher)
![Dependencies](https://flat.badgen.net/bundlephobia/dependency-count/color-scheme-switcher)
![Dependents](https://flat.badgen.net/npm/dependents/color-scheme-switcher)

## Description

This package facilitates toggling the color scheme of a react app between dark
and light mode.

This can be done either manually or automatically.

If done automatically, it can either follow the system color scheme, or follow
daylight in the user's location.

This library is careful not to request geolocation permissions, which could be
intrusive to users, unless it will be used.

## Installation

```bash
npm i color-scheme-switcher
```

Note: `react` and `react-dom` are peer dependencies.

## Usage

### Provider Options

| Option                          | Type                       | Optional? | Default | Description                                                                                             |
| ------------------------------- | -------------------------- | --------- | ------- | ------------------------------------------------------------------------------------------------------- |
| `defaultColorSchemeIsLight`     | `boolean`                  | Yes       | `false` | This sets whether the default color scheme is light mode or dark mode before the page has fully loaded. |
| `setColorSchemeIsLightCallback` | `(value: boolean) => void` | Yes       | None    | This is a function which will be run whenever the color scheme changes.                                 |

### Integration

See [src/examples](src/examples) for other examples.

1. In your `_app.tsx` (or similar) file, wrap children with the provider.

   ```typescript [src/pages/_app.tsx]
   import { ColorSchemeSwitcherProvider } from "color-scheme-switcher";
   import { SomeComponentLibraryProvider } from "some-component-library";

   const App: AppType = ({ Component, pageProps }) => {
     const defaultColorSchemeIsLight = true;
     const [colorScheme, setColorScheme] = useState<"light" | "dark">(
       defaultColorSchemeIsLight ? "light" : "dark"
     );

     const setColorSchemeIsLightCallback = (colorSchemeIsLight: boolean) => {
       setColorScheme(colorSchemeIsLight ? "light" : "dark");
     };

     return (
       <ColorSchemeSwitcherProvider
         defaultColorSchemeIsLight={defaultColorSchemeIsLight}
         setColorSchemeIsLightCallback={setColorSchemeIsLightCallback}
       >
         <SomeComponentLibraryProvider colorScheme={colorScheme}>
           <Component {...pageProps} />
         </SomeComponentLibraryProvider>
       </ColorSchemeSwitcherProvider>
     );
   };

   export default App;
   ```

2. In a component or page (or similar), use the context from this package.

   ```typescript [src/pages/index.tsx]
   import { useColorSchemeSwitcher } from "color-scheme-switcher";
   import { Checkbox } from "@/components";

   interface HomePageProps {}

   const HomePage: React.FC<HomePageProps> = () => {
     const {
       colorSchemeIsLight,
       colorSchemeIsManual,
       colorSchemeFollowsSun,
       setColorSchemeIsLight,
       setColorSchemeIsManual,
       setColorSchemeFollowsSun,
     } = useColorSchemeSwitcher();

     return (
       <div
         sx={{
           color: colorSchemeIsLight ? "black" : "white",
           backgroundColor: colorSchemeIsLight ? "white" : "black",
         }}
       >
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
         <p>{`Color scheme is manual? ${
           colorSchemeIsManual ? "yes" : "no"
         }`}</p>
         <p>{`Color scheme follows sun? ${
           colorSchemeFollowsSun ? "yes" : "no"
         }`}</p>
       </div>
     );
   };

   export default HomePage;
   ```

## To-Do

- Document exported utils.
- Add options for changing other defaults.

## Development

1. Fork this repository.

2. Install development dependencies.

   ```bash
   npm i -D
   ```

3. Start build and test watchers.

   ```bash
   npm run build:watch
   ```

   ```bash
   npm run test:watch
   ```

4. Modify code.

5. Ensure all tests pass.

6. Push code to your fork.

7. Submit a merge request into the `development` branch of this repository.
