# Stage 2: Migration — Tạo Database

> CLI: `npx prisma migrate dev`

> ⚠ **Lưu ý Prisma v7:** Các lệnh CLI vẫn giống v5/v6, nhưng `prisma.config.ts` (file cấu hình riêng ở root) quản lý connection string thay vì thuộc tính `url` trong `schema.prisma`. Xem `ARCHITECTURE.md` hoặc `IMPLEMENTATION.md` để biết chi tiết adapter pattern.`

---

## 1. Migration là gì?

Migration = file ghi lại lịch sử thay đổi cấu trúc database.
- Lần 1: Tạo bảng từ schema
- Lần 2: Thêm cột (nếu sửa schema)
- Lần 3: Xóa bảng (nếu xóa model)

**Tương đương EF Core:** `dotnet ef migrations add Init` + `dotnet ef database update`

## 2. Quy trình

```bash
# 1. Sau khi viết xong schema.prisma
npx prisma migrate dev --name init
# → Tạo file migration đầu tiên trong prisma/migrations/
# → Apply lên database

# 2. Kiểm tra data
npx prisma studio
# → Mở browser: http://localhost:5555
# → Xem/CRUD data trực quan
```

## 3. Khi sửa schema (thêm field, thêm model)

```bash
# Sửa prisma/schema.prisma → chạy:
npx prisma migrate dev --name add_new_field
# → Tự động tạo migration mới + apply

# Nếu muốn reset DB (mất data):
npx prisma migrate reset --force
```

## 4. So sánh CLI

| Hành động | Prisma | EF Core |
|-----------|--------|---------|
| Tạo migration đầu | `prisma migrate dev --name init` | `dotnet ef migrations add Init` |
| Apply | tự động | `dotnet ef database update` |
| Xem SQL script | `prisma migrate dev --create-only` | `dotnet ef migrations script` |
| Reset DB | `prisma migrate reset --force` | `Drop-CreateDatabase` |
| Xem data | `prisma studio` | SSMS / SQL Server Object Explorer |

## 5. File sinh ra

```
prisma/migrations/
└── 20240617_init/
    ├── migration.sql    ← SQL thuần (có thể xem để kiểm tra)
    └── migration_lock.yaml
```
