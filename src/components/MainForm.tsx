import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { getLocationAsync } from "../util/getLocationAsync";
import Loader from "./Loader.tsx";

interface IFormInput {
  venueSlug: string;
  cartValue: number;
  latitude: number;
  longitude: number;
}

export default function MainForm() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data);
  };

  const handleGetLocation = async () => {
    try {
      setIsLoading(true);
      const { latitude, longitude } = await getLocationAsync();
      setValue("latitude", latitude);
      setValue("longitude", longitude);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred.";
      console.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 mx-auto p-8 bg-[#d7e9e4]/20 rounded-lg">
      <h2 className="text-xl font-bold text-center mb-8">Calculator</h2>
      <form onSubmit={handleSubmit(onSubmit)} aria-labelledby="form-header">
        {[
          {
            id: "venueSlug",
            type: "text",
            label: "Venue Slug",
            placeholder: "Enter venue slug",
            validation: { required: "Venue slug is required" },
            error: errors.venueSlug,
          },
          {
            id: "cartValue",
            type: "number",
            label: "Cart Value",
            placeholder: "Enter cart value",
            validation: {
              required: "Cart value is required",
              min: { value: 0, message: "Cart value must be at least 0" },
            },
            error: errors.cartValue,
          },
          {
            id: "latitude",
            type: "number",
            label: "User Latitude",
            placeholder: "Enter latitude",
            validation: {
              required: "Latitude is required",
              valueAsNumber: true,
            },
            error: errors.latitude,
            disabled: isLoading,
          },
          {
            id: "longitude",
            type: "number",
            label: "User Longitude",
            placeholder: "Enter longitude",
            validation: {
              required: "Longitude is required",
              valueAsNumber: true,
            },
            error: errors.longitude,
            disabled: isLoading,
          },
        ].map(({ id, type, label, validation, error, disabled }) => (
          <div className="relative mb-8" key={id}>
            <input
              id={id}
              type={type}
              placeholder=" "
              className="peer w-full bg-transparent p-3 border-b border-gray-400 focus:outline-none focus:ring-0 focus:border-black"
              {...register(id as keyof IFormInput, validation)}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={`${id}Error`}
              disabled={disabled}
            />
            <label
              htmlFor={id}
              className="absolute left-1 text-[#7f2d00] text-sm -top-4 transition-all duration-200 pointer-events-none  peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-placeholder-shown:text-black focus:text-sm peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[#7f2d00]"
            >
              {label}
            </label>
            {error && (
              <span id={`${id}Error`} className="text-red-500 text-sm">
                {error.message}
              </span>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={handleGetLocation}
          className="w-full bg-[#eee8a9]/40 hover:bg-[#f9f871]/40 text-black p-3 rounded-lg mt-0 mb-6 font-extrabold"
        >
          Get Location
        </button>
        <div className="mb-4">
          <button
            type="submit"
            className="w-full bg-[#eee8a9]/40 hover:bg-[#f9f871]/40 p-3 rounded-lg text-black font-extrabold mt-10"
          >
            Submit
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center -z-10">
          <Loader />
        </div>
      )}
    </div>
  );
}
