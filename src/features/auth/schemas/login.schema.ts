import { z } from 'zod'

export const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .nonempty({ message: 'Vui lòng nhập email' })
    .email({ message: 'Email không hợp lệ' }),
  password: z
    .string()
    .nonempty({ message: 'Vui lòng nhập mật khẩu' })
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
})

export type LoginFormData = z.infer<typeof LoginSchema>
