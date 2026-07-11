'use client'

import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/common/Form/Form'
import { Input } from '@/components/common/Input'

interface FormInputProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> {
  control: Control<TFieldValues>
  name: TName
  label?: React.ReactNode
  placeholder?: string
  type?: string
  className?: string
  labelClassName?: string
  inputClassName?: string
}

const FormInput = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  className,
  labelClassName,
  inputClassName,
}: FormInputProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState, formState }) => {
        const value = field.value ?? ''
        const showError = (String(value).length > 0 || formState.isSubmitted) && fieldState.error
        return (
          <FormItem className={className}>
            {label && <FormLabel className={labelClassName}>{label}</FormLabel>}
            <FormControl>
              <Input type={type} placeholder={placeholder} className={inputClassName} {...field} />
            </FormControl>
            {showError && <FormMessage />}
          </FormItem>
        )
      }}
    />
  )
}

export { FormInput }
