import { server } from "@/test-utils/server/node";
import "@testing-library/jest-dom/vitest";

afterEach(() => {
  server.resetHandlers();
});

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});
