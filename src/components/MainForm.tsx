import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { getLocationAsync } from "../util/getLocationAsync";
import Spinner from "./Spinner.tsx";
import { IPriceData } from "../App.tsx";
import { fetchStaticData, fetchDynamicData } from "../services/venueAPI.ts";
import PriceCalculator from "../util/PriceCalculator.ts";
import FormField from "./FormField";
import { formFields } from "../config/formConfig";
import { parseCoordinates } from "../util/parseCoordinates.ts";

export interface IFormInput {
  venueSlug: string;
  cartValue: number;
  userLatitude: string;
  userLongitude: string;
}

interface MainFormProps {
  setPriceData: (data: IPriceData | null) => void;
  setFetchIsLoading: (fetchIsLoading: boolean) => void;
  fetchIsLoading: boolean;
}

export default function MainForm({
  setPriceData,
  setFetchIsLoading,
  fetchIsLoading,
}: MainFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data): Promise<void> => {
      setFetchIsLoading(true);
      try {
        const staticResult = await fetchStaticData(data.venueSlug);
        if (!staticResult.success) {
          setPriceData({
            cartValue: 0,
            deliveryFee: 0,
            deliveryDistance: 0,
            smallOrderSurcharge: 0,
            errorMsg: staticResult.error,
          });
          return;
        }
        const [lon, lat] = staticResult.data;

        const dynamicResult = await fetchDynamicData(data.venueSlug);
        if (!dynamicResult.success) {
          setPriceData({
            cartValue: 0,
            deliveryFee: 0,
            deliveryDistance: 0,
            smallOrderSurcharge: 0,
            errorMsg: dynamicResult.error,
          });
          return;
        }
        const { minCartValue, basePrice, distanceRanges } = dynamicResult.data;
        const cartValueCents = data.cartValue * 100;
        const latitudeNum = parseCoordinates(data.userLatitude, "lat");
        const longitudeNum = parseCoordinates(data.userLongitude, "lon");

        // Check if coordinates are valid (they should be at this point).
        if (null === latitudeNum || null === longitudeNum) {
          setPriceData({
            cartValue: 0,
            smallOrderSurcharge: 0,
            deliveryFee: 0,
            deliveryDistance: 0,
            errorMsg: "Invalid coordinates.",
          });
          return;
        }

        const smallOrderSurcharge =
          PriceCalculator.calculateSmallOrderSurcharge(
            cartValueCents,
            minCartValue
          );
        const userDistance = PriceCalculator.haversineFormula(
          latitudeNum,
          longitudeNum,
          lat,
          lon
        );
        const deliveryFee = PriceCalculator.calculateDeliveryFee(
          userDistance,
          basePrice,
          distanceRanges
        );

        if (deliveryFee === null) {
          const maxDistance = distanceRanges.at(-1)?.min;
          setPriceData({
            cartValue: 0,
            smallOrderSurcharge: 0,
            deliveryFee: 0,
            deliveryDistance: 0,
            errorMsg: `Delivery not possible for the given distance (${userDistance.toFixed(0)} m). Maximum distance is ${maxDistance} m.`,
          });
          return;
        }

        setPriceData({
          cartValue: cartValueCents,
          smallOrderSurcharge,
          deliveryFee,
          deliveryDistance: userDistance,
          errorMsg: "",
        });
      } catch {
        setPriceData({
          cartValue: 0,
          smallOrderSurcharge: 0,
          deliveryFee: 0,
          deliveryDistance: 0,
          errorMsg: "Error calculating price. Try again.",
        });
      } finally {
        setFetchIsLoading(false);
      }
  };

  const handleGetLocation = (): void => {
    void (async () => {
      try {
        setIsLoading(true);
        const { latitude, longitude } = await getLocationAsync();
        setValue("userLatitude", latitude);
        setValue("userLongitude", longitude);
      } catch (error) {
        console.error(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    })();
  };

  return (
    <div className="w-full xl:max-w-sm mx-auto p-8 bg-[#fff] rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-center mb-8">Calculator</h2>
      <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
        {formFields.map((field) => (
          <FormField
            key={field.id}
            id={field.id}
            type={field.type}
            label={field.label}
            validation={field.validation}
            error={errors[field.id]}
            register={register}
            disabled={field.id.includes("user") && isLoading} // userLatitude and userLongitude
          />
        ))}

        <div className="flex justify-center">
          <button
            type="button"
            data-testid="getLocation"
            data-test-id="getLocation"
            onClick={handleGetLocation}
            aria-label="Get location"
            className="w-fit text-black p-3 mt-0 mb-6 font-extrabold hover:scale-105 transition-transform duration-100 ease-in-out"
          >
            Get Location
          </button>
        </div>
        <div className="mb-4 flex justify-center">
          <button
            type="submit"
            aria-label="Submit"
            className="w-full max-w-xs border border-black p-3 text-black font-extrabold mt-10 relative overflow-hidden bg-white transition-all duration-500 hover:text-white group z-10 uppercase"
            data-test-id="submit"
            data-testid="submit"
            disabled={fetchIsLoading}
          >
            submit
            <span className="absolute inset-0 bg-black transition-transform duration-200 -translate-x-full group-hover:translate-x-0 -z-10"></span>
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center z-20 pointer-events-none">
          <Spinner />
        </div>
      )}
    </div>
  );
}
