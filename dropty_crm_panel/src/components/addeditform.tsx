"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

/* =====================
    FIELD TYPES
  ===================== */
export type FormField =
  | {
      type: "input";
      name: string;
      label: string;
      inputType?: React.HTMLInputTypeAttribute;
      placeholder?: string;
      required?: boolean;
      pattern?: {
        value: RegExp;
        message: string;
      };
      validate?: (value: any) => true | string;
      maxLength?: number;
      disabled?: boolean;
    }
  | {
      type: "select";
      name: string;
      label: string;
      options: { label: string; value: string }[];
      placeholder?: string;
      required?: boolean;
      disabled?: boolean;
    };

/* =====================
    PROPS
  ===================== */
interface AddEditFormProps {
  fields: FormField[];
  initialValues?: Record<string, any>;
  submitText?: string;
  cancelText?: string;
  onSubmit: (values: Record<string, any>) => void;
  onCancel: () => void;
  errors?: Record<string, string>;
  onFieldChange?: (name: string, value: any) => void;
  children?: React.ReactNode;
}

/* =====================
    COMPONENT
  ===================== */
export default function AddEditForm({
  fields,
  initialValues = {},
  submitText = "Submit",
  cancelText = "Cancel",
  onSubmit,
  onCancel,
  errors = {},
  onFieldChange,
  children,
}: AddEditFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: rhfErrors },
  } = useForm({
    defaultValues: initialValues,
    mode: "onChange", // 👈 ADD THIS
    reValidateMode: "onChange",
  });

  const prevInitialValues = useRef<Record<string, any> | null>(null);

  useEffect(() => {
    if (
      JSON.stringify(prevInitialValues.current) !==
      JSON.stringify(initialValues)
    ) {
      reset(initialValues);
      prevInitialValues.current = initialValues;
    }
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-4 mt-4">
      {errors.form && (
        <div className="flex items-center gap-3 rounded-lg border border-red-100 p-4 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          <p className="font-medium">{errors.form}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {fields.map((field) => {
          const error = errors[field.name] || rhfErrors[field.name]?.message;

          return (
            <div key={field.name} className="flex flex-col">
              {/* =====================
                  INPUT (CORRECT FLOATING LABEL)
              ===================== */}
              {field.type === "input" && (
                <div className="relative">
                  <Input
                    id={field.name}
                    type={field.inputType ?? "text"}
                    placeholder=" "
                    disabled={field.disabled}
                    className={`peer h-12 ${
                      field.disabled
                        ? "bg-muted cursor-not-allowed opacity-70"
                        : ""
                    }`}
                    maxLength={field.maxLength}
                    {...register(field.name, {
                      required: field.required
                        ? `${field.label} is required`
                        : false,
                      pattern: field.pattern,
                      validate: field.validate,
                      onChange: (e) => {
                        let value = e.target.value;

                        if (field.inputType === "tel") {
                          value = value.replace(/\D/g, "");
                          if (
                            field.maxLength &&
                            value.length > field.maxLength
                          ) {
                            value = value.slice(0, field.maxLength);
                          }
                          e.target.value = value;
                        }

                        onFieldChange?.(field.name, value);
                      },
                    })}
                  />

                  <label
                    htmlFor={field.name}
                    className="
                      absolute left-3 top-3
                      bg-white px-1
                      text-sm text-zinc-400
                      transition-all duration-200
                      pointer-events-none
                      peer-focus:-top-2
                      peer-focus:text-xs
                      peer-focus:text-primary
                      peer-not-placeholder-shown:-top-2
                      peer-not-placeholder-shown:text-xs
                      peer-not-placeholder-shown:text-zinc-500
                    "
                  >
                    {field.label}
                    {field.required && <span className="text-red-500"> *</span>}
                  </label>
                </div>
              )}

              {/* =====================
                  SELECT (FLOATING LABEL)
              ===================== */}
              {field.type === "select" && (
                <div className="relative">
                  <select
                    id={field.name}
                    disabled={field.disabled}
                    className={`
    peer h-12 w-full rounded-md border px-3
    bg-white text-zinc-900
    focus:outline-none focus:ring-2 focus:ring-primary/20
    ${field.disabled ? "bg-muted cursor-not-allowed opacity-70" : ""}
  `}
                    {...register(field.name, {
                      onChange: (e) =>
                        onFieldChange?.(field.name, e.target.value),
                    })}
                  >
                    <option value="" disabled hidden />
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <label
                    htmlFor={field.name}
                    className="
                      absolute left-3 top-3
                      bg-white px-1
                      text-sm text-zinc-400
                      transition-all duration-200
                      pointer-events-none
                      peer-focus:-top-2
                      peer-focus:text-xs
                      peer-focus:text-primary
                      peer-not-placeholder-shown:-top-2
                      peer-not-placeholder-shown:text-xs
                    "
                  >
                    {field.label}
                  </label>
                </div>
              )}

              {error && (
                <p className="mt-1 text-xs font-medium text-red-600">
                  {String(error)}
                </p>
              )}
            </div>
          );
        })}

        {children}
      </div>

      <div className="flex justify-end gap-3 border-t pt-6">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="border border-gray-400"
        >
          {cancelText}
        </Button>

        <Button type="submit" className="px-8 font-semibold">
          {submitText}
        </Button>
      </div>
    </form>
  );
}
