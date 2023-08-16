const mockWindowMatchMedia = () => {
  const matchMediaMock = jest.fn();
  const addEventListenerMock = jest.fn();
  const addListenerMock = jest.fn();

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: matchMediaMock,
      media: query,
      onchange: null,
      addListener: addListenerMock, // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: addEventListenerMock,
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }),
  });

  return { matchMediaMock, addListenerMock, addEventListenerMock };
};

const { matchMediaMock, addListenerMock, addEventListenerMock } =
  mockWindowMatchMedia();

export { matchMediaMock, addListenerMock, addEventListenerMock };
