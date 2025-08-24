// ulty-data.js
const axios = require("axios");
const cheerio = require("cheerio");
const csv = require("csvtojson");

exports.handler = async function(event, context) {
  try {
    // 1. Fetch Yahoo Finance weekly prices CSV
    const yahooCSVUrl = "https://query1.finance.yahoo.com/v7/finance/download/ULTY?period1=1710566400&period2=1734777600&interval=1wk&events=history";
    const yahooRes = await axios.get(yahooCSVUrl);
    const pricesJSON = await csv().fromString(yahooRes.data);

    // 2. Fetch YieldMax dividends
    const yieldRes = await axios.get("https://www.yieldmaxetfs.com/our-etfs/ulty/");
    const $ = cheerio.load(yieldRes.data);
    let dividends = [];
    $("table.distribution-table tbody tr").each((i, el) => {
      const date = $(el).find("td:nth-child(1)").text().trim();
      const dividend = parseFloat($(el).find("td:nth-child(2)").text().replace("$","").trim());
      if(date && dividend) dividends.push({date, dividend});
    });

    // 3. Combine prices and dividends
    let weeks = pricesJSON.map(p => {
      const divObj = dividends.find(d => d.date === p.Date);
      return {
        week: p.Date,
        close: parseFloat(p.Close),
        dividend: divObj ? divObj.dividend : 0
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify(weeks)
    };

  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({error: "Failed to fetch data"})
    };
  }
};
