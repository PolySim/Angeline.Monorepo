"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

type FormInputProps = {
  name: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  type?: string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
};

const FormInput = ({
  name,
  label,
  description,
  disabled,
  type,
  onChange,
  className,
  placeholder,
}: FormInputProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              disabled={disabled}
              {...field}
              placeholder={placeholder}
              type={type}
              onChange={(e) => {
                field.onChange(e);
                onChange?.(e.target.value);
              }}
              className={className}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export { FormInput };
