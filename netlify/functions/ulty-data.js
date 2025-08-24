// netlify/functions/ulty-data.js

import yahooFinance from "yahoo-finance2";

export async function handler(event, context) {
  try {
    const params = event.queryStringParameters || {};
    const ticker = params.symbol || "ULTY";
    const startDate = params.start || "2024-03-15";
    const interval = params.interval || "1wk";

    const result = await yahooFinance.chart(ticker, {
      interval: interval,
      period1: startDate,
    });

    // ✅ Return just the quotes array
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.quotes || []),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Failed to fetch data", error: error.message }),
    };
  }
}
