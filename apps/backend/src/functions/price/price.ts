const API_KEY = process.env.CRYPTOCOMPARE_API_KEY;

export const handler = async () => {
  try {
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,EUR?api_key=${API_KEY}`,
    );

    if (!response.ok) {
      throw new Error(`API request failed`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        price: data.USD,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
};
