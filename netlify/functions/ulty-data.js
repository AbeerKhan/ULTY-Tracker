// netlify/functions/ulty-data.js

// Import dependencies
import yahooFinance from "yahoo-finance2"; // official Yahoo wrapper
import csv from "csvtojson";               // in case you want CSV parsing later
import cheerio from "cheerio";             // in case you use scraping later
import axios from "axios";                 // in case you keep some axios calls

export async function handler(event, context) {
  try {
    // Get ticker from query parameter (?symbol=AAPL), default to ULTY
    const params = event.queryStringParameters || {};
    const ticker = params.symbol || "ULTY";

    // Get date range params if provided
    const startDate = params.start || "2024-03-15"; // YYYY-MM-DD
    const interval = params.interval || "1wk";      // 1d, 1wk, 1mo

    // Call Yahoo Finance historical API
    const result = await yahooFinance.historical(ticker, {
      period1: startDate,
      interval: interval,
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
          count: result.length,
          data: result,
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
