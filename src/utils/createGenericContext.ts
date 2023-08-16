import { createContext, useContext } from "react";

const createGenericContext = <T extends unknown>() => {
  // Create a context with a generic parameter or undefined
  const GenericContext = createContext<T | undefined>(undefined);

  // Check if the value provided to the context is defined or throw an error
  const useGenericContext = () => {
    const definitelyDefinedContext = useContext(GenericContext);
    if (typeof definitelyDefinedContext === "undefined") {
      throw new Error(
        "useGenericContext must be used within the associated Provider"
      );
    }
    return definitelyDefinedContext;
  };

  return [GenericContext, useGenericContext] as const;
};

export { createGenericContext };
