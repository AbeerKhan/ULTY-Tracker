// netlify/functions/ulty-data.js

import yahooFinance from "yahoo-finance2";

export async function handler(event, context) {
  try {
    // Get ticker from query parameter (?symbol=AAPL), default to ULTY
    const params = event.queryStringParameters || {};
    const ticker = params.symbol || "ULTY";

    // Get date range params if provided
    const startDate = params.start || "2024-03-15"; // YYYY-MM-DD
    const interval = params.interval || "1wk";      // 1d, 1wk, 1mo

    // Call Yahoo Finance chart API
    const result = await yahooFinance.chart(ticker, {
      interval: interval,
      period1: startDate, // start date
    });

    // Return JSON response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          symbol: ticker,
          interval: interval,
          data: result.quotes || [], // chart returns { meta, quotes, indicators }
        },
        null,
        2
      ),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        {
          message: "Failed to fetch Yahoo Finance data",
          error: error.message,
        },
        null,
        2
      ),
    };
  }
}
