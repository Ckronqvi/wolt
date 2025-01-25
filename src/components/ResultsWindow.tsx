import { useEffect, useRef } from "react";
import { IPriceData } from "../App";
import Spinner from "./Spinner";

interface ResultsWindowProps {
  priceData: IPriceData | null;
  fetchIsLoading: boolean;
}

export default function ResultsWindow({
  priceData,
  fetchIsLoading,
}: ResultsWindowProps) {
  const resultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (priceData && resultsRef.current && typeof window !== "undefined") {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [priceData]);

  if (fetchIsLoading) {
    return (
      <div
        ref={resultsRef}
        className="w-full p-9 rounded-lg flex justify-center items-center bg-black/20 shadow-lg"
        aria-busy="true"
      >
        <Spinner />
      </div>
    );
  }

  if (!priceData) {
    return (
      <div
        ref={resultsRef}
        className="bg-white/40 w-full p-9 rounded-lg text-center shadow-lg"
      />
    );
  }

  // Show error message if it exists
  if (priceData.errorMsg) {
    return (
      <div
        ref={resultsRef}
        className="bg-white w-full p-9 rounded-lg text-center lg:pt-20 shadow-lg"
      >
        <h2
          className="text-2xl font-bold mb-4 text-red-800"
          data-testid="errorMsg"
        >
          Oops... Something went wrong
        </h2>
        <p className="text-xl text-center text-red-800">{priceData.errorMsg}</p>
      </div>
    );
  }

  // Extract values for price breakdown
  const { cartValue, deliveryFee, deliveryDistance, smallOrderSurcharge } =
    priceData;

  const totalPrice = cartValue + deliveryFee + smallOrderSurcharge;

  return (
    <div
      ref={resultsRef}
      className="bg-[#fff] p-8 lg:px-20 lg:pb-20 rounded-lg flex flex-col justify-between w-full"
      aria-labelledby="price-breakdown-heading"
    >
      <h2
        className="text-xl font-semibold mb-4 text-center text-black"
        id="price-breakdown-heading"
      >
        Price Breakdown
      </h2>
      <ul className="space-y-3 text-lg text-gray-700 xl:p-10">
        <PriceItem
          label="Cart Value"
          value={(cartValue / 100).toFixed(2)}
          rawValue={cartValue}
          testId="cartValue"
        />
        <PriceItem
          label="Delivery Fee"
          value={(deliveryFee / 100).toFixed(2)}
          rawValue={deliveryFee}
          testId="deliveryFee"
        />
        <li className="flex justify-between border-b border-dotted border-gray-700">
          <strong>Delivery Distance:</strong>
          <span
            data-raw-value={deliveryDistance.toFixed(0)}
            data-test-id="deliveryDistance"
          >
            {deliveryDistance.toFixed(0)} m
          </span>
        </li>
        <PriceItem
          label="Small Order Surcharge"
          value={(smallOrderSurcharge / 100).toFixed(2)}
          rawValue={smallOrderSurcharge}
          testId="smallOrderSurcharge"
        />
      </ul>
      <div className="font-extrabold text-2xl text-center mt-6">
        <strong>Total Price:</strong>{" "}
        <span
          data-raw-value={totalPrice}
          data-test-id="totalPrice"
          data-testid="totalPrice"
        >
          {(totalPrice / 100).toFixed(2)} €
        </span>
      </div>
    </div>
  );
}

// PriceItem Component
const PriceItem = ({
  label,
  value,
  rawValue,
  testId,
}: {
  label: string;
  value: string | number;
  rawValue: number;
  testId: string;
}) => (
  <li
    className="flex justify-between border-b border-dotted border-gray-700"
    role="listitem"
  >
    <strong>{label}:</strong>
    <span data-raw-value={rawValue} data-test-id={testId} data-testid={testId}>
      {value} €
    </span>
  </li>
);
