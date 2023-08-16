# Color Scheme Switcher

## Description

This package facilitates toggling color scheme between light and dark mode in a
react app.

This can be done either manually or automatically.

If done automatically, it can either use the system color scheme, or follow
daylight in the user's location.

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
