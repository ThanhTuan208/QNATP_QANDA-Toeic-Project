import { z } from 'zod'

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'Vui lòng nhập họ tên' })
      .max(256, { message: 'Họ tên không được vượt quá 256 ký tự' }),
    email: z
      .string()
      .trim()
      .min(1, { message: 'Vui lòng nhập email' })
      .email({ message: 'Email không hợp lệ' }),
    password: z
      .string()
      .min(1, { message: 'Vui lòng nhập mật khẩu' })
      .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
    confirmPassword: z.string().min(1, { message: 'Vui lòng xác nhận mật khẩu' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof RegisterSchema>
