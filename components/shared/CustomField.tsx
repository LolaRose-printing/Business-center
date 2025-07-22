import React from "react";
import { Control } from "react-hook-form";
import { z } from "zod";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "../ui/form";

import { formSchema } from "./TransformationForm";

type FormData = z.infer<typeof formSchema>;

type CustomFieldProps = {
  control: Control<FormData> | undefined;
  render: (props: { field: any }) => React.ReactNode;
  name: keyof FormData;
  formLabel?: string;
  className?: string;
};

export const CustomField: React.FC<CustomFieldProps> = ({
  control,
  render,
  name,
  formLabel,
  className,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {formLabel && <FormLabel>{formLabel}</FormLabel>}
          <FormControl>{render({ field })}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
