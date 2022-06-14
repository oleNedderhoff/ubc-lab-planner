import { FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { useController } from "react-hook-form";

export default function ControlledSelect({
  control,
  name,
  id,
  label,
  rules,
  ...props
}) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { invalid, error },
  } = useController({
    name,
    control,
    rules,
  });

  return (
    <FormControl py={4} isInvalid={invalid} id={id}>
      <FormLabel>{label}</FormLabel>

      <Select
        name={name}
        ref={ref}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        {...props}
      />

      <FormErrorMessage>{error && error.message}</FormErrorMessage>
    </FormControl>
  );
}
