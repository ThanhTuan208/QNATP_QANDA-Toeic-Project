# TOEIC Reading — Markdown Documentation

> Tài liệu dự án luyện thi TOEIC Reading Part 5 & 6 (current)

---

## 📂 Cấu trúc docs

```
docs/
├── README.md                              ← Bạn đang ở đây
├── content/
│   └── build_part_5.md                    ← Phân tích 12 dạng câu hỏi Part 5
├── tech-stack/
│   └── tech_stack_final.md                ← Stack chính thức & quy trình phát triển
├── learning/
│   └── learning_mapping.md                ← Đối chiếu kiến thức tnp-ui-web → TOEIC
└── ai/
    └── ai_prompt_spec.md                  ← Spec cho AI generation (chưa implement)
```

---

## 📑 Danh sách tài liệu

### 🎯 Content

| Tài liệu | Mô tả |
|----------|-------|
| [build_part_5.md](docs/content/build_part_5.md) | 12 dạng câu hỏi Part 5, tần suất ra đề, ma trận đề thi, ví dụ ETS |

### ⚙️ Tech Stack

| Tài liệu | Mô tả |
|----------|-------|
| [tech_stack_final.md](docs/tech-stack/tech_stack_final.md) | Stack: Next.js + Prisma + PostgreSQL + Vercel. CLI tools, roadmap 16 ngày, folder structure, deploy checklist |
| [package_cheatsheet.md](docs/tech-stack/package_cheatsheet.md) | Packages, CLI commands, biome config, env setup, so sánh với tnp-ui-web |

### 📖 Learning

| Tài liệu | Mô tả |
|----------|-------|
| [learning_mapping.md](docs/learning/learning_mapping.md) | Đối chiếu từng thư viện tnp-ui-web → TOEIC. Code mẫu EF Core ↔ Prisma, .NET Controller ↔ API Routes, Zustand ↔ NextAuth |

### 🤖 AI (Future)

| Tài liệu | Mô tả |
|----------|-------|
| [ai_prompt_spec.md](docs/ai/ai_prompt_spec.md) | Prompt template + format cho AI sinh câu hỏi TOEIC Part 5 |

---

## 🔗 Liên kết nhanh

| Project | Đường dẫn |
|---------|-----------|
| Data câu hỏi | [`/data/questions.json`](/data/questions.json) — 33 câu mẫu |

---

## 🧭 Lộ trình đọc đề xuất

```
1. content/build_part_5.md          ← Hiểu Part 5 có những dạng gì
2. tech-stack/tech_stack_final.md   ← Hiểu stack chọn và cách build
3. learning/learning_mapping.md     ← Xem kiến thức nào đã biết, nào cần học
4. ai/ai_prompt_spec.md             ← (Khi cần gen câu hỏi tự động)
```
