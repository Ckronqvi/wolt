import { UseFormRegister, FieldError, RegisterOptions } from "react-hook-form";
import { IFormInput } from "./MainForm"

export type FieldId = "venueSlug" | "cartValue" | "userLatitude" | "userLongitude";

interface FormFieldProps {
  id: FieldId;
  type: string;
  label: string;
  validation: RegisterOptions<IFormInput, keyof IFormInput>; 
  error: FieldError | undefined;
  disabled?: boolean;
  register: UseFormRegister<IFormInput>;
}

export default function FormField({
  id,
  type,
  label,
  validation,
  error,
  disabled = false,
  register,
}: FormFieldProps) {
  return (
    <div className="relative mb-8">
      <input
        id={id}
        data-testid={id}
        data-test-id={id}
        type={type}
        placeholder=" "
        className="peer w-full bg-transparent p-3 border-b border-gray-400 focus:outline-none focus:ring-0 focus:border-black"
        {...register(id, validation)}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}Error` : undefined}
        disabled={disabled}
      />
      <label
        htmlFor={id}
        className="absolute left-1 text-[#183288] text-md -top-4 transition-all duration-200 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-lg peer-placeholder-shown:text-black focus:text-sm peer-focus:-top-4 peer-focus:text-sm peer-focus:text-[#183288]"
      >
        {label}
      </label>
      {error && (
        <span id={`${id}Error`} className="text-red-700 text-sm">
          {error.message}
        </span>
      )}
    </div>
  );
}