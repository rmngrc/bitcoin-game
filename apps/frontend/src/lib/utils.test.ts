import { formatPrice } from "./utils";

describe("utils", () => {
  it("formatPrice should format the price correctly", () => {
    expect(formatPrice(12345, "USD")).toBe("US$123.45");
    expect(formatPrice(12345, "EUR")).toBe("€123.45");
  });
});
