import { useState } from "react";
import MainForm from "./components/MainForm";
import ResultsWindow from "./components/ResultsWindow";

export interface IPriceData {
  cartValue: number;
  deliveryFee: number;
  deliveryDistance: number;
  smallOrderSurcharge: number;
  errorMsg: string;
}

function App() {
  const [priceData, setPriceData] = useState<IPriceData | null>(null);
  const [fetchIsLoading, setFetchIsLoading] = useState(false);

  return (
    <div className="container mx-auto w-full flex flex-col lg:flex-row gradient-borders p-3 lg:p-6 gap-3">
      <MainForm
        setPriceData={setPriceData}
        setFetchIsLoading={setFetchIsLoading}
        fetchIsLoading={fetchIsLoading}
      />
      <ResultsWindow priceData={priceData} fetchIsLoading={fetchIsLoading} />
    </div>
  );
}

export default App;
