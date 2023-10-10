import React, { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";

import "./App.scss";
import Quote from "./components/Quote";
import { hexCode, quoteURL } from "./utils/utils";

const randomArrVal = (arr) => {
  let randomNum = Math.floor(Math.random() * arr.length);
  return arr[randomNum];
};

function extractHexValues(arr) {
  const hexValues = [];

  for (const item of arr) {
    if (item.code && item.code.hex) {
      const hexWithoutHash = item.code.hex.replace("#", ""); // Remove the "#" symbol
      hexValues.push(hexWithoutHash);
    }
  }

  return hexValues;
}

const hexValuesArray = extractHexValues(hexCode);

const useFetch = (url) => {
  const [data, setData] = useState(null);

  async function fetchData() {
    const response = await fetch(url);
    const json = await response.json();
    setData(json);
  }

  useEffect(() => {
    fetchData();
  }, [url]);
  return data;
};

function App() {
  const [quoteIndex, setQuoteIndex] = useState(0); // Track the current quote index

  const quotes = useFetch(quoteURL);
  const [currentQuote, setCurrentQuote] = useState({ author: "", quote: "" });

  useEffect(() => {
    if (quotes) {
      handleNewQuote();
      setQuoteIndex(randomArrVal(quotes.quotes));
    }
  }, [quotes]);

  const handleNewQuote = () => {
    let quoteArr = quotes.quotes;
    setCurrentQuote(randomArrVal(quoteArr));
  };

  const accentColor = `#${randomArrVal(hexValuesArray)}`;

  const appStyle = {
    backgroundColor: accentColor,
    color: accentColor, // Set the text color to match the background color for visibility
  };

  return (
    <div className={`App App-${quoteIndex}`} style={appStyle}>
      {currentQuote.quote === "" ? (
        <Spinner
          className="loading-spinner"
          animation="grow"
          variant="light"
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        <Quote
          accentColor={accentColor}
          currentQuote={currentQuote}
          handleNewQuote={handleNewQuote}
        />
      )}
    </div>
  );
}

export default App;
