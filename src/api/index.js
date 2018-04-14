import axios from "axios";
import get from "lodash.get";

import { LOCAL_JSON_DATA_DIR } from "../constants";

// Specify config defaults that will be applied to every request.
axios.defaults.headers["CB-VERSION"] = process.env.REACT_APP_COINBASE_API_CB_VERSION || "2018-04-13";

  return `https://www.coinbase.com/api/v2/prices/${cryptocurrency}-${currency}/historic?period=${durationType}`;
}

function getSpotPriceUrl(currency) {
  if (process.env.NODE_ENV !== "production") {
    return `${LOCAL_JSON_DATA_DIR}/${currency}-spot.json`;
  }

  return `https://api.coinbase.com/v2/prices/${currency}/spot?`;
}

function fetchPriceHistory(cryptocurrency, currency, durationType) {
  const url = getPriceHistoryUrl(cryptocurrency, currency, durationType);

  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(response => {
        const priceHistory = get(response, ["data", "data", "prices"], []);
        const formattedPriceHistory = priceHistory
          .sort((a, b) => new Date(a.time) - new Date(b.time))
          .map(e => ({ price: Number(e.price), time: new Date(e.time) }));
        resolve(formattedPriceHistory);
      })
      .catch(reject);
  });
}

function fetchSpotPrices(currency) {
  const url = getSpotPriceUrl(currency);

  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(response => {
        const spotPrices = get(response, ["data", "data"], []);
        const formattedSpotPrices = spotPrices.map(e => ({
          ...e,
          amount: Number(e.amount),
        }));
        resolve(formattedSpotPrices);
      })
      .catch(reject);
  });
}

export { getPriceHistoryUrl, getSpotPriceUrl, fetchPriceHistory, fetchSpotPrices };
