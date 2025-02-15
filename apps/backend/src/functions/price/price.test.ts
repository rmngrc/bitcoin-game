import { handler } from "./price";

describe("handler", () => {
  it("returns price", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ USD: "50000.00" }),
    });

    const result = await handler();

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ price: "50000.00" });
  });

  it("returns 500 error if API request fails", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const result = await handler();

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      error: "API request failed",
    });
  });

  it("returns 500 with error message when an exception is thrown", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const result = await handler();

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ error: "Network error" });
  });
});
