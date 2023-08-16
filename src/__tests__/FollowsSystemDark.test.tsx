import { render, screen } from "@testing-library/react";

import { ColorSchemeApp } from "@/examples/ColorSchemeApp/App";
import {
  matchMediaMock,
  addListenerMock,
  addEventListenerMock,
} from "@/__tests__/__mocks__";

beforeEach(() => {
  jest.useFakeTimers();
});

const colorSchemeIsNotLightText = "Color scheme is light? no";
const colorSchemeIsNotManualText = "Color scheme is manual? no";
const colorSchemeFollowsNotSunText = "Color scheme follows sun? no";

test("should follow the dark system color scheme", async () => {
  jest.setSystemTime(0);

  matchMediaMock.mockImplementation(() => false);
  addListenerMock.mockImplementation(
    () => (callback: any) => callback({ matches: false })
  );
  addEventListenerMock.mockImplementation((_eventType: string, callback: any) =>
    callback({ matches: false })
  );

  render(<ColorSchemeApp />);

  // Check for expected values.
  expect(screen.getByText(/^Color scheme is light\?/).textContent).toBe(
    colorSchemeIsNotLightText
  );
  expect(screen.getByText(/^Color scheme is manual\?/).textContent).toBe(
    colorSchemeIsNotManualText
  );
  expect(screen.getByText(/^Color scheme follows sun\?/).textContent).toBe(
    colorSchemeFollowsNotSunText
  );
});
