# Prisma Cheatsheet

> Tra cứu nhanh lệnh CLI + query + so sánh EF Core.

---

## CLI Commands

```bash
# === MIGRATION ===
npx prisma migrate dev                   # Tạo + apply migration (dev)
npx prisma migrate dev --name init       # Lần đầu
npx prisma migrate deploy                # Apply migration (production)
npx prisma migrate reset --force         # Xóa DB + tạo lại từ đầu
npx prisma migrate status                # Kiểm tra migration status

# === DATA ===
npx prisma studio                        # GUI database (http://localhost:5555)
npx prisma db push                       # Sync schema trực tiếp (không tạo migration)
npx prisma db seed                       # Chạy seed script

# === GENERATE ===
npx prisma generate                      # Tạo PrismaClient từ schema
npx prisma validate                      # Kiểm tra schema có lỗi không
```

## Query Patterns

```typescript
// READ
prisma.question.findMany()               // Tất cả
prisma.question.findUnique({ where: { id } }) // 1 record theo PK
prisma.question.findFirst({ where: { type: 'WORD_FORM' } }) // 1 record theo điều kiện
prisma.question.count({ where: { isActive: true } }) // Đếm

// FILTER
where: { type: 'WORD_FORM', difficulty: 'HARD' }
where: { type: { in: ['WORD_FORM', 'VOCABULARY'] } }
where: { questionText: { contains: 'market' } }
where: { createdAt: { gte: new Date('2024-01-01') } }

// SORT + PAGINATION
orderBy: { createdAt: 'desc' }
take: 10, skip: 20

// RELATION
include: { options: { orderBy: { order: 'asc' } } }
include: { attempts: { where: { userId: 'abc' } } }

// CREATE
prisma.question.create({ data: { questionText: '...', options: { create: [...] } } })
prisma.question.createMany({ data: [...] }) // Batch

// UPDATE
prisma.question.update({ where: { id }, data: { isActive: false } })
prisma.question.updateMany({ where: { type: 'OLD' }, data: { type: 'NEW' } })

// DELETE
prisma.question.delete({ where: { id } })
prisma.question.deleteMany({ where: { isActive: false } })

// RAW
prisma.$queryRaw`SELECT * FROM "Question" ORDER BY RANDOM() LIMIT 10`
prisma.$executeRaw`UPDATE "Question" SET times_used = times_used + 1 WHERE id = ${id}`

// TRANSACTION
prisma.$transaction([prisma.question.create(...), prisma.option.create(...)])
prisma.$transaction(async (tx) => { ... })
```

## EF Core → Prisma Mapping

| EF Core | Prisma |
|---------|--------|
| `dotnet ef migrations add Init` | `prisma migrate dev --name init` |
| `dotnet ef database update` | `prisma migrate deploy` |
| `_context.Questions.ToListAsync()` | `prisma.question.findMany()` |
| `_context.Questions.FirstOrDefaultAsync(x => x.Id == id)` | `prisma.question.findUnique({ where: { id } })` |
| `_context.Questions.Where(x => x.Type == type).ToListAsync()` | `prisma.question.findMany({ where: { type } })` |
| `.Include(x => x.Options)` | `include: { options: true }` |
| `.OrderByDescending(x => x.CreatedAt)` | `orderBy: { createdAt: 'desc' }` |
| `.Skip(40).Take(20)` | `skip: 40, take: 20` |
| `_context.SaveChangesAsync()` | Tự động (mỗi create/update/delete) |
| `_context.Database.BeginTransactionAsync()` | `prisma.$transaction()` |
| `context.Database.MigrateAsync()` | `prisma migrate deploy` (CLI) |
| `SQL Server Management Studio` | `prisma studio` |
