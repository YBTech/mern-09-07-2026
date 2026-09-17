import React, { useEffect, useState } from "react";

export default function CleanUpDemo() {
  return (
    <div>
      <ThirdPartySubscription />
      {/* <AutoCounter /> */}
    </div>
  );
}

function ThirdPartySubscription() {
  const [price, setPrice] = useState(0);

  useEffect(() => {
    const ws = new WebSocket("wss://ws-feed.exchange.coinbase.com");

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "subscribe",
          product_ids: ["BTC-USD"],
          channels: ["ticker"],
        }),
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.price) setPrice(Number(data.price));
      console.log("bitcoin price still coming in");
    };

    return () => {
      ws.close();
    };
  }, []);

  return <div>Bitcoin price: {price}</div>;
}

function AutoCounter() {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCounter((prev) => prev + 1);
      console.log("triggered");
    }, 1000);

    // clean up to avoid memory leak
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return <div>{counter}</div>;
}
