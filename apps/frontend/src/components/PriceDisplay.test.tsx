import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PriceDisplay } from "./PriceDisplay";

describe("PriceDisplay", () => {
  it("renders the loading bitcoin price text when isLoading is true", () => {
    const price = { amount: 9512344, currency: "USD", symbol: "$" };

    render(<PriceDisplay price={price} isLoading={true} />);

    expect(screen.getByText("Loading Bitcoin price...")).toBeInTheDocument();
  });

  it("does not render the price if ref is null", () => {
    const price = undefined;

    render(<PriceDisplay price={price} isLoading={false} />);

    expect(screen.queryByText("US$")).not.toBeInTheDocument();
  });

  it("renders the price correctly", () => {
    const price = { amount: 9512344, currency: "USD", symbol: "$" };

    render(<PriceDisplay price={price} isLoading={false} />);

    expect(screen.getByText("The current Bitcoin Price is US$95,123.44")).toBeInTheDocument();
  });
});
