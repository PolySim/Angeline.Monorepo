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
import { Textarea } from "../ui/textarea";

type FormAreaProps = {
  name: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
};

const FormArea = ({
  name,
  label,
  description,
  disabled,
  onChange,
  className,
  placeholder,
}: FormAreaProps) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Textarea
              disabled={disabled}
              {...field}
              placeholder={placeholder}
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

export { FormArea };
