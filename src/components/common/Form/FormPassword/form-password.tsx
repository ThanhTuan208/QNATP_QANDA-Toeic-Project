'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/common/Form/form'
import { Input } from '@/components/common/Input'

interface FormPasswordProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>
  name: TName
  label?: React.ReactNode
  placeholder?: string
  className?: string
  inputClassName?: string
}

const FormPassword = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  control,
  name,
  label,
  placeholder,
  className,
  inputClassName,
}: FormPasswordProps<TFieldValues, TName>) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState, formState }) => {
        const value = field.value ?? ''
        const showError = (String(value).length > 0 || formState.isSubmitted) && fieldState.error
        return (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                className={inputClassName}
                rightIcon={
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className='text-muted-foreground hover:text-foreground'
                  >
                    {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                  </button>
                }
                {...field}
              />
            </FormControl>
            {showError && <FormMessage />}
          </FormItem>
        )
      }}
    />
  )
}

export { FormPassword }
