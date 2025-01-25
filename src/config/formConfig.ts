import { RegisterOptions } from "react-hook-form";
import { IFormInput } from "../components/MainForm";
import { isValidCoordinate } from "../util/parseCoordinates";

export const formFields: {
  id: keyof IFormInput;
  type: string;
  label: string;
  placeholder: string;
  validation: RegisterOptions<IFormInput, keyof IFormInput>;
}[] = [
  {
    id: "venueSlug",
    type: "text",
    label: "Venue slug",
    placeholder: "Enter venue slug",
    validation: {
      required: "Venue slug is required",
    },
  },
  {
    id: "cartValue",
    type: "text",
    label: "Cart value",
    placeholder: "Enter cart value (EUR)",
    validation: {
      validate: (value: string | number) =>
        !isNaN(Number(value)) ||
        "Please enter a valid number. Use a dot (.) as the decimal separator",
      required: "Cart value is required",
      valueAsNumber: true,
      min: { value: 0, message: "Cart value must be at least 0" },
    },
  },
  {
    id: "userLatitude",
    type: "text",
    label: "User latitude",
    placeholder: "Enter latitude (e.g., 48.8566N or -48.8566)",
    validation: {
      validate: (value: string | number) => {
        const valueStr = String(value);
        return (
          isValidCoordinate(valueStr, "lat") ||
          "Invalid latitude. Use format: 48.8566N or -48.8566"
        );
      },
      required: "Latitude is required",
    },
  },
  {
    id: "userLongitude",
    type: "text",
    label: "User longitude",
    placeholder: "Enter longitude (e.g., 2.3522E or -2.3522)",
    validation: {
      validate: (value: string | number) => {
        const valueAsString = String(value);
        return (
          isValidCoordinate(valueAsString, "lon") ||
          "Invalid longitude. Use format: 2.3522E or -2.3522"
        );
      },
      required: "Longitude is required",
    },
  },
];
