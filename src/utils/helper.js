// helper.js

// creating request
export const createRequestOptions = (url, params = {}) => ({
  method: "GET",
  url: `https://${process.env.REACT_APP_API_URL}${url}`,
  params,
  headers: {
    "x-rapidapi-key": process.env.REACT_APP_API_KEY,
    "x-rapidapi-host": process.env.REACT_APP_API_URL,
  },
});