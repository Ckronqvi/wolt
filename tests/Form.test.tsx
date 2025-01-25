import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import App from "../src/App";

describe("Form Integration Test", () => {
  it("fills in the form, submits, and verifies the result", async () => {
    // Mock scrollIntoView method
    const scrollIntoViewMock = vi.fn();
    // Mock the resultsRef.current scrollIntoView function
    Object.defineProperty(HTMLDivElement.prototype, "scrollIntoView", {
      value: scrollIntoViewMock,
    });

    render(<App />);

    // Perform the test steps (filling the form, clicking submit, etc.)
    const venueSlugInput = screen.getByTestId("venueSlug");
    const cartValueInput = screen.getByTestId("cartValue");
    const userLatitudeInput = screen.getByTestId("userLatitude");
    const userLongitude = screen.getByTestId("userLongitude");

    await userEvent.type(venueSlugInput, "home-assignment-venue-helsinki");
    await userEvent.type(cartValueInput, "7");
    await userEvent.type(userLatitudeInput, "60.17094");
    await userEvent.type(userLongitude, "24.93087");

    const submitButton = screen.getByTestId("submit");
    await userEvent.click(submitButton);

    // Wait for the result to appear
    await waitFor(
      () => {
        const totalPrice = screen.getByTestId("totalPrice");
        expect(totalPrice).toHaveTextContent("11.90 €");
      },
      { timeout: 3000 },
    );

    // Ensure scrollIntoView was called during the test
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it("displays an error message when the form is submitted with an invalid slug", async () => {
    render(<App />);

    const venueSlugInput = screen.getByTestId("venueSlug");
    const cartValueInput = screen.getByTestId("cartValue");
    const userLatitudeInput = screen.getByTestId("userLatitude");
    const userLongitude = screen.getByTestId("userLongitude");

    // invalid slug
    await userEvent.type(venueSlugInput, "invalid-venue-slug");
    await userEvent.type(cartValueInput, "7");
    await userEvent.type(userLatitudeInput, "60.17094");
    await userEvent.type(userLongitude, "24.93087");

    const submitButton = screen.getByTestId("submit");
    await userEvent.click(submitButton);

    await waitFor(
      () => {
        const errorMsg = screen.getByTestId("errorMsg");
        expect(errorMsg).toHaveTextContent("Oops... Something went wrong");
      },
      { timeout: 3000 },
    );

    // invalid cart value (-1)
    await userEvent.clear(cartValueInput);
    await userEvent.type(cartValueInput, "-1");
    await userEvent.click(submitButton);
    await waitFor(() => {
      const cartValueError = screen.getByText("Cart value must be at least 0");
      expect(cartValueError).toBeInTheDocument();
    });

    // invalid cart value (-1aa)
    await userEvent.type(cartValueInput, "aa");
    const cartValueError = screen.getByText(
      "Please enter a valid number. Use a dot (.) as the decimal separator",
    );
    expect(cartValueError).toBeInTheDocument();
  });

  it("displays an error message when the form is submitted with an 10.0000, 20.0000 as coordinates (too far away)", async () => {
    render(<App />);

    const venueSlugInput = screen.getByTestId("venueSlug");
    const cartValueInput = screen.getByTestId("cartValue");
    const userLatitudeInput = screen.getByTestId("userLatitude");
    const userLongitude = screen.getByTestId("userLongitude");

    // invalid coordinates
    await userEvent.type(venueSlugInput, "home-assignment-venue-helsinki");
    await userEvent.type(cartValueInput, "7");
    await userEvent.type(userLatitudeInput, "10.0000");
    await userEvent.type(userLongitude, "20.0000");

    const submitButton = screen.getByTestId("submit");
    await userEvent.click(submitButton);

    await waitFor(
      () => {
        const errorMsg = screen.getByTestId("errorMsg");
        expect(errorMsg).toHaveTextContent("Oops... Something went wrong");
      },
      { timeout: 3000 },
    );
  });
});

