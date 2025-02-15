import { http, HttpResponse } from "msw";
import { v4 as uuidv4 } from "uuid";

// In memory store. It will be reset every time the server is restarted.
const score = 0;

export const handlers = [
  http.get(`${import.meta.env.VITE_API_URL}/price`, async () => {
    return HttpResponse.json({ symbol: "BTCUSDT", price: (getRandomPrice() / 100).toString() });
  }),
  http.get(`${import.meta.env.VITE_API_URL}/start`, ({ cookies }) => {
    if (!cookies.sessionId) {
      const sessionId = uuidv4();
      return HttpResponse.json(
        { score: 0 },
        {
          status: 200,
          headers: {
            "Set-Cookie": `sessionId=${sessionId}; Path=/; HttpOnly; Secure; Max-Age=${
              60 * 60 * 24 * 365 * 10
            }`,
          },
        },
      );
    }

    return HttpResponse.json({ score }, { status: 200 });
  }),
  http.post(`${import.meta.env.VITE_API_URL}/score`, () => {
    throw new Error("Not implemented");
  }),
];

function getRandomPrice() {
  return Math.random() * (9400000 - 9300000) + 9300000;
}
