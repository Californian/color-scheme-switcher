import { fireEvent, render, screen } from "@testing-library/react";

import { ColorSchemeApp } from "@/examples/ColorSchemeApp/App";

beforeEach(() => {
  jest.useFakeTimers();
});

const colorSchemeIsLightText = "Color scheme is light? yes";
const colorSchemeIsNotLightText = "Color scheme is light? no";
const colorSchemeIsManualText = "Color scheme is manual? yes";
const colorSchemeIsNotManualText = "Color scheme is manual? no";

test("should follow the light system color scheme", async () => {
  render(<ColorSchemeApp />);

  // Check for expected values.
  expect(screen.getByText(/^Color scheme is light\?/).textContent).toBe(
    colorSchemeIsNotLightText
  );
  expect(screen.getByText(/^Color scheme is manual\?/).textContent).toBe(
    colorSchemeIsNotManualText
  );

  // Toggle color scheme automaticity to manual.
  fireEvent.click(screen.getByText("Color Scheme is Manual"));

  // Check for expected values.
  expect(screen.getByText(/^Color scheme is light\?/).textContent).toBe(
    colorSchemeIsNotLightText
  );
  expect(screen.getByText(/^Color scheme is manual\?/).textContent).toBe(
    colorSchemeIsManualText
  );

  // Toggle color scheme to light mode.
  fireEvent.click(screen.getByText("Color Scheme is Light"));

  // Check for expected values.
  expect(screen.getByText(/^Color scheme is light\?/).textContent).toBe(
    colorSchemeIsLightText
  );
  expect(screen.getByText(/^Color scheme is manual\?/).textContent).toBe(
    colorSchemeIsManualText
  );
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
