import { http } from "msw";

export const handlers = [http.get("/start", async () => {})];
