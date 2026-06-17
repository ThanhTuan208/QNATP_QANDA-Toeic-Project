# Database Layer — Prisma

> Tài liệu hướng dẫn triển khai Prisma theo từng stage.

---

## Stage Map

```
docs/database/
├── README.md                   ← Bạn đang ở đây
├── STAGE_1_SCHEMA.md           ← Định nghĩa models, relations, enums
├── STAGE_2_MIGRATION.md        ← Tạo database, chạy migration
├── STAGE_3_SEED.md             ← Import data/questions.json vào DB
├── STAGE_4_CLIENT.md           ← PrismaClient singleton + query patterns
├── STAGE_5_ADVANCED.md         ← Aggregation, transaction, raw query
└── CHEATSHEET.md               ← Lệnh Prisma CLI + so sánh EF Core
```

---

## Lộ trình đọc

```
1. STAGE_1_SCHEMA.md    ← Hiểu models và relations
2. STAGE_2_MIGRATION.md ← Tạo database thật
3. STAGE_3_SEED.md      ← Đổ data câu hỏi vào DB
4. STAGE_4_CLIENT.md    ← Cách query trong code
5. STAGE_5_ADVANCED.md  ← Query phức tạp (khi cần)
6. CHEATSHEET.md        ← Tra cứu nhanh
```
