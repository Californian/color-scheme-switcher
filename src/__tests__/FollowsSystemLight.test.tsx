import { render, screen } from "@testing-library/react";

import { ColorSchemeApp } from "@/examples/ColorSchemeApp/App";
import {
  getCurrentPositionMock,
  matchMediaMock,
  addListenerMock,
  addEventListenerMock,
} from "@/__tests__/__mocks__";

beforeEach(() => {
  jest.useFakeTimers();
});

const colorSchemeIsLightText = "Color scheme is light? yes";
const colorSchemeIsNotManualText = "Color scheme is manual? no";
const colorSchemeFollowsNotSunText = "Color scheme follows sun? no";

test("should follow the light system color scheme", async () => {
  jest.setSystemTime(0);

  getCurrentPositionMock.mockImplementation((success, _rejected) =>
    success({
      timestamp: 0,
      coords: {
        accuracy: 1000,
        altitude: 0,
        altitudeAccuracy: 100,
        heading: NaN,
        latitude: 0,
        longitude: 0,
        speed: null,
      },
    })
  );

  matchMediaMock.mockImplementation(() => true);
  addListenerMock.mockImplementation(
    () => (callback: any) => callback({ matches: true })
  );
  addEventListenerMock.mockImplementation((_eventType: string, callback: any) =>
    callback({ matches: true })
  );

  render(<ColorSchemeApp />);

  // Check for expected values.
  expect(screen.getByText(/^Color scheme is light\?/).textContent).toBe(
    colorSchemeIsLightText
  );
  expect(screen.getByText(/^Color scheme is manual\?/).textContent).toBe(
    colorSchemeIsNotManualText
  );
  expect(screen.getByText(/^Color scheme follows sun\?/).textContent).toBe(
    colorSchemeFollowsNotSunText
  );
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
