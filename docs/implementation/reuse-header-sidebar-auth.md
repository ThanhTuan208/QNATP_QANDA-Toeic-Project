# Tái sử dụng Header, Sidebar, AuthModal từ tnp-ui-web

> Ngày: 07/07/2026
> Nhánh: `feature/QNAT-TuanNT-03`
> Mục tiêu: Lấy pattern component composition + form handling từ tnp-ui-web, adapt cho TOEIC project với Radix UI + NextAuth.

## 1. Vấn đề

Project hiện tại (`QNATP_QANDA-Toeic-Project`) có:
- `Navbar.tsx` đơn giản, không có sidebar
- Login/register là page riêng (`/login`, `/register`), form raw HTML, không validation
- Không có auth modal

Project nguồn (`tnp-ui-web`) có:
- Header + Sidebar đầy đủ với composition pattern
- AuthModal (Dialog + Tabs) cho login/register
- react-hook-form + Zod validation
- Nhưng dùng `base-luma` style (Base UI), không tương thích Radix UI của project hiện tại

## 2. Quyết định kiến trúc

**Không copy code nguyên xi.** Thay vào đó:

| Layer | Lấy từ tnp-ui-web | Viết mới cho TOEIC |
|---|---|---|
| Component composition | ✅ Header/Sidebar structure | — |
| Form pattern | ✅ useLoginForm/useRegisterForm controller | — |
| Auth engine | — | ❌ Dùng NextAuth (khác custom JWT của tnp) |
| Headless UI | — | ❌ Dùng Radix UI (khác Base UI của tnp) |
| CSS theme | — | ❌ Dùng theme TOEIC (green-teal) |
| Nav items | — | ❌ TOEIC-specific (Practice, Dashboard, Admin) |

## 3. Cấu trúc files

### Stage 1: Radix Primitives

```
src/components/ui/
├── actions/button.tsx          ← Giữ nguyên (Radix Slot)
├── feedback/sonner.tsx          ← [MỚI] Toast notifications
├── form/input.tsx               ← [MỚI] Native HTML input
├── form/label.tsx               ← [MỚI] Native HTML label
├── layout/badge.tsx             ← Giữ nguyên
├── layout/scroll-area.tsx       ← [MỚI] @radix-ui/react-scroll-area
├── navigation/tabs.tsx          ← [MỚI] @radix-ui/react-tabs
├── navigation/dropdown-menu.tsx ← [MỚI] @radix-ui/react-dropdown-menu
├── overlay/dialog.tsx           ← Giữ nguyên
└── overlay/sheet.tsx            ← [MỚI] @radix-ui/react-dialog (slide-in)
```

### Stage 2: Common Form Components

```
src/components/common/
├── Input/
│   ├── input.tsx                ← [MỚI] Wrapper với rightIcon prop
│   └── index.ts
└── Form/
    ├── form.tsx                 ← [MỚI] FormProvider + FormField + FormItem + FormLabel + FormControl + FormMessage
    ├── index.ts
    ├── FormInput/
    │   ├── form-input.tsx       ← [MỚI] Input + Label + error validation
    │   └── index.ts
    └── FormPassword/
        ├── form-password.tsx    ← [MỚI] Input + toggle show/hide + error
        └── index.ts
```

### Stage 3: Layout UI

```
src/components/layout/
├── Header/
│   ├── header.tsx               ← [VIẾT LẠI] Composition: Brand + Nav + Actions
│   ├── header-brand.tsx         ← [MỚI] Logo + hamburger button
│   ├── header-actions.tsx       ← [MỚI] Login/register/profile buttons
│   ├── header-navigation.tsx    ← [MỚI] Nav links từ constants
│   └── index.ts
├── Sidebar/
│   ├── sidebar.tsx              ← [MỚI] Composition: Overlay + Brand + Nav + Actions
│   ├── sidebar-brand.tsx        ← [MỚI] Logo + subtitle
│   ├── sidebar-navigation.tsx   ← [MỚI] Nav items từ constants + active state
│   ├── sidebar-actions.tsx      ← [MỚI] Settings + logout buttons
│   ├── sidebar-overlay.tsx      ← [MỚI] Mobile backdrop (framer-motion)
│   └── index.ts
├── main-layout.tsx              ← [VIẾT LẠI] Header + Sidebar + controller
└── Navbar.tsx                   ← Giữ nguyên (có thể xoá sau)
```

### Stage 4: Auth

```
src/features/auth/
├── types.ts                     ← [MỚI] LoginInput, RegisterInput
├── schemas/
│   ├── login.schema.ts          ← [MỚI] Zod: email + password
│   └── register.schema.ts       ← [MỚI] Zod: name + email + password + confirm
├── hooks/
│   ├── useLoginForm.ts          ← [MỚI] react-hook-form → signIn('credentials')
│   └── useRegisterForm.ts       ← [MỚI] react-hook-form → registerApi → signIn()
├── api/
│   └── register.api.ts          ← [MỚI] fetch POST /api/auth/register
└── components/
    ├── AuthModal/
    │   ├── AuthModal.tsx        ← [MỚI] Dialog + Tabs (pattern tnp)
    │   └── index.ts
    ├── login/
    │   └── login-form.tsx       ← [MỚI] FormInput/FormPassword + useLoginForm
    └── register/
        └── register-form.tsx    ← [MỚI] FormInput/FormPassword + useRegisterForm
```

### Stage 5: Controllers

```
src/hooks/
└── useMainLayoutController.ts   ← [MỚI] useSession() + sidebar state

src/constants/
├── sidebar.constant.ts          ← [MỚI] Nav items: Luyện tập, Tiến độ, Quản lý
└── header.constant.ts           ← [MỚI] Nav links: Trang chủ, Luyện tập, Tiến độ

src/app/
├── (main)/layout.tsx            ← [SỬA] Dùng MainLayout thay Navbar
└── api/auth/register/route.ts   ← [MỚI] POST tạo user trong Prisma
```

## 4. Flow xử lý

### Khi user chưa đăng nhập (landing page)
```
page.tsx (home)
  → LandingNavSection (logo + title)
  → PracticeCardsSection (danh sách dạng câu hỏi)
  
Khi user bấm "Đăng nhập":
  → Mở AuthModal (Dialog + Tabs)
    → Form login (react-hook-form + Zod)
      → useLoginForm.onSubmit()
        → signIn('credentials', { email, password, redirect: false })
          → NextAuth Credentials provider → PrismaAdapter → JWT
        → Thành công: toast + router.refresh() + đóng modal
        → Thất bại: toast lỗi, modal vẫn mở
```

### Khi user đã đăng nhập (main layout)
```
(main)/layout.tsx
  → MainLayout
    → useMainLayoutController (useSession)
      → isAuthenticated = true
    → Sidebar (collapsible, mobile overlay)
    → Header (sticky, profile icon)
    → <main>{children}</main>
```

### Khi user đăng xuất
```
Sidebar → "Đăng xuất" button
  → signOut({ callbackUrl: '/' })
  → Redirect về trang chủ
```

## 5. Khác biệt với tnp-ui-web

| Khía cạnh | tnp-ui-web | TOEIC Project |
|---|---|---|
| **Headless UI** | Base UI | Radix UI |
| **Auth** | Custom JWT (Zustand + Axios interceptors) | NextAuth v5 (Credentials + JWT) |
| **Auth state** | Zustand store | useSession() + SessionProvider |
| **Auth UI** | Modal (Dialog + Tabs) | Modal (Dialog + Tabs) — giống pattern |
| **Form** | react-hook-form + Zod | react-hook-form + Zod — giống pattern |
| **Form hooks** | useLoginForm (Zustand.login) | useLoginForm (signIn) — khác data layer |
| **Layout controller** | useMainLayoutController (authStore) | useMainLayoutController (useSession) |
| **Sidebar nav items** | Trips, Explore, Messages | Practice, Dashboard, Admin |
| **CSS variables** | green-teal, sand, on-surface | green-teal, neutral-0..100 (gần tương đồng) |

## 6. Pattern mượn từ tnp-ui-web

### Component composition pattern
```tsx
// Header.tsx — composition pattern from tnp-ui-web
export default function Header({ ... }: HeaderProps) {
  return (
    <header>
      <HeaderBrand />
      <HeaderNavigation />
      <HeaderActions />
    </header>
  )
}
```

### Form controller pattern
```tsx
// useLoginForm.ts — controller pattern from tnp-ui-web
export function useLoginForm({ onSuccess }) {
  const form = useForm<LoginFormData>({ resolver: zodResolver(LoginSchema) })
  const [isPending, setIsPending] = useState(false)
  
  const onSubmit = async (data: LoginFormData) => {
    // data layer khác (signIn thay vì Zustand.login)
    // UI layer giống (toast, form.reset, onSuccess)
  }
  
  return { form, isPending, onSubmit }
}
```

### FormInput pattern
```tsx
// FormInput.tsx — generic field pattern from tnp-ui-web
<FormField
  control={control}
  name={name}
  render={({ field, fieldState, formState }) => (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <Input {...field} />
      </FormControl>
      {showError && <FormMessage />}
    </FormItem>
  )}
/>
```

## 7. Dependencies thay đổi

### Added
| Package | Version | Lý do |
|---|---|---|
| framer-motion | ^12.42.2 | Sidebar overlay animation |
| @radix-ui/react-tabs | ^1.1.17 | AuthModal tabs |
| @radix-ui/react-dropdown-menu | ^2.1.20 | Notification dropdown |
| @radix-ui/react-scroll-area | ^1.2.14 | Sidebar scroll |
| next-themes | ^0.4.6 | Sonner toast theme |
| sonner | ^2.0.7 | Toast notifications |
| tw-animate-css | ^1.4.0 | CSS animations (fade, slide, zoom) |

### Removed
| Package | Lý do |
|---|---|
| @base-ui/react | Không dùng, chọn Radix UI |

## 8. Còn lại (chưa làm)

- Landing page layout với AuthModal (hiện tại login/register vẫn là page riêng)
- useLandingLayoutController (nếu cần landing layout riêng)
- Profile modal (tnp-ui-web có, TOEIC chưa cần)
- Password hashing trong register API (hiện tại NextAuth authorize không check password)
