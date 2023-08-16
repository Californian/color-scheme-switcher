import { act, fireEvent, render, screen } from "@testing-library/react";

import { ColorSchemeApp } from "@/examples/ColorSchemeApp/App";
import { getCurrentPositionMock } from "@/__tests__/__mocks__";

beforeEach(() => {
  jest.useFakeTimers();
});

const colorSchemeIsLightText = "Color scheme is light? yes";
const colorSchemeIsNotLightText = "Color scheme is light? no";
const colorSchemeIsNotManualText = "Color scheme is manual? no";
const colorSchemeFollowsSunText = "Color scheme follows sun? yes";
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

  // Toggle to follow sun. It is dark at the mocked location and time so this should not change the color scheme from dark.
  fireEvent.click(screen.getByText("Color Scheme Follows Sun"));
  expect(screen.getByText(/^Color scheme follows sun\?/).textContent).toBe(
    colorSchemeFollowsSunText
  );
  expect(screen.getByText(/^Color scheme is light\?/).textContent).toBe(
    colorSchemeIsNotLightText
  );

  // Mock progression of time to 12 hours later.
  jest.setSystemTime(12 * 60 * 60 * 1000);

  // Run sunrise actions.
  act(() => {
    jest.advanceTimersToNextTimer();
  });

  // Check for expected values.
  expect(screen.getByText(/^Color scheme is light\?/).textContent).toBe(
    colorSchemeIsLightText
  );
  expect(screen.getByText(/^Color scheme is manual\?/).textContent).toBe(
    colorSchemeIsNotManualText
  );
  expect(screen.getByText(/^Color scheme follows sun\?/).textContent).toBe(
    colorSchemeFollowsSunText
  );
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
