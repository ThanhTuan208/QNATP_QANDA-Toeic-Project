# Database Schema Reference

> Tổng quan chi tiết về các bảng, thuộc tính, và quan hệ trong database TOEIC Web App.

---

## Table of Contents

1. [Enums](#enums)
2. [users](#users)
3. [questions](#questions)
4. [options](#options)
5. [attempts](#attempts)
6. [test_sessions](#test_sessions)
7. [tags](#tags)
8. [question_tags](#question_tags)
9. [Relationship Map](#relationship-map)

---

## Enums

### `QuestionType`
Enum các dạng câu hỏi Part 5, mapping trực tiếp với `TYPE_SLUG_MAP` trong `src/lib/utils.ts`.

| Value | Slug |
|---|---|
| `WORD_FORM` | `word-form` |
| `VOCABULARY` | `vocabulary` |
| `VERB_TENSE` | `verb-tense` |
| `PREPOSITION` | `preposition` |
| `CONJUNCTION` | `conjunction` |
| `PARTICIPLE` | `participle` |
| `VOICE` | `voice` |
| `RELATIVE_CLAUSE` | `relative-clause` |
| `COMPARISON` | `comparison` |
| `AGREEMENT` | `agreement` |

### `Difficulty`

| Value | Label |
|---|---|
| `EASY` | Dễ |
| `MEDIUM` | Trung bình |
| `HARD` | Khó |

### `QuestionSource`

| Value | Mục đích |
|---|---|
| `ETS` | Trích từ đề thi thật |
| `AI` | Sinh bởi AI |
| `ADMIN_IMPORT` | Import từ JSON qua trang admin |
| `MANUAL` | Nhập tay bởi admin |

### `SessionType`

| Value | Mục đích |
|---|---|
| `PRACTICE` | Luyện tập tự do |
| `TIMED_TEST` | Thi thử có giới hạn thời gian |

### `SessionStatus`

| Value | Ý nghĩa |
|---|---|
| `IN_PROGRESS` | Đang làm |
| `COMPLETED` | Đã hoàn thành |
| `ABANDONED` | Bỏ dở |

---

## `users`

> Bảng người dùng. Mapping với `next-auth` để hỗ trợ đăng nhập.

**Table name in DB:** `users`

### Thuộc tính

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `String` | `@id @default(cuid())` | Khóa chính, CUID tự sinh |
| `email` | `String` | `@unique` | Email dùng để đăng nhập, unique |
| `name` | `String?` | nullable | Tên hiển thị của người dùng |
| `image` | `String?` | nullable | URL ảnh đại diện (từ next-auth) |
| `role` | `String` | `@default("user")` | Phân quyền (`user` / `admin`) |
| `createdAt` | `DateTime` | `@default(now())` | Thời gian tạo tài khoản |

### Quan hệ

| Relation | Model | Field FK | Mục đích |
|---|---|---|---|
| `attempts` | `Attempt[]` | implicit (qua `userId` trong Attempt) | Lấy tất cả câu trả lời của user |
| `testSessions` | `TestSession[]` | implicit (qua `userId` trong TestSession) | Lấy tất cả phiên thi của user |

### Code reference

```ts
// src/app/api/attempts/route.ts — upsert dev user nếu chưa login
async function getUserId(): Promise<string> {
  const session = await auth()
  if (session?.user?.id) return session.user.id
  // fallback: dev user
  const dev = await prisma.user.upsert({
    where: { email: 'dev@toeic.local' },
    update: {},
    create: { email: 'dev@toeic.local', name: 'Dev User' },
  })
  return dev.id
}
```

---

## `questions`

> Bảng trung tâm chứa tất cả câu hỏi TOEIC Part 5.

**Table name in DB:** `questions`

### Thuộc tính

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `String` | `@id @default(cuid())` | Khóa chính |
| `code` | `String` | `@unique` | Mã câu hỏi (VD: `P5_001`), unique |
| `questionText` | `String` | required | Nội dung câu hỏi (có chỗ trống `______`) |
| `type` | `QuestionType` | required | Dạng câu hỏi (enum) |
| `difficulty` | `Difficulty` | required | Độ khó (EASY / MEDIUM / HARD) |
| `source` | `QuestionSource` | `@default(MANUAL)` | Nguồn gốc câu hỏi |
| `hint` | `String?` | nullable | Gợi ý cho người học |
| `note` | `String?` | nullable | Ghi chú nội bộ cho admin |
| `isActive` | `Boolean` | `@default(true)` | Câu hỏi còn được sử dụng không |
| `timesUsed` | `Int` | `@default(0)` | Số lần câu hỏi được đưa ra |
| `createdAt` | `DateTime` | `@default(now())` | Thời gian tạo |
| `updatedAt` | `DateTime` | `@updatedAt` | Thời gian sửa gần nhất |

### Quan hệ

| Relation | Model | FK trên model kia | Mục đích |
|---|---|---|---|
| `options` | `Option[]` | `questionId` | 4 lựa chọn A-B-C-D của câu hỏi |
| `attempts` | `Attempt[]` | `questionId` | Lịch sử người dùng trả lời câu hỏi này |
| `tags` | `QuestionTag[]` | `questionId` | Tags gắn với câu hỏi (qua bảng trung gian) |

### Code reference

```ts
// GET /api/questions — lấy danh sách câu hỏi (admin)
export async function GET() {
  const questions = await prisma.question.findMany({
    include: { options: { orderBy: { order: 'asc' } } },
  })
}
```

---

## `options`

> 4 lựa chọn A-B-C-D của mỗi câu hỏi. Mỗi câu hỏi có chính xác 1 option đúng.

**Table name in DB:** `options`

### Thuộc tính

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `String` | `@id @default(cuid())` | Khóa chính |
| `text` | `String` | required | Nội dung lựa chọn |
| `isCorrect` | `Boolean` | required | `true` nếu là đáp án đúng |
| `rationale` | `String` | required | Giải thích tại sao đúng/sai |
| `order` | `Int` | `@default(0)` | Thứ tự hiển thị (0=A, 1=B, 2=C, 3=D) |
| `questionId` | `String` | FK → `questions.id` | Khóa ngoại tới câu hỏi cha |

### Quan hệ

| Relation | Model | Mục đích |
|---|---|---|
| `question` | `Question` | Câu hỏi cha chứa option này (nhiều-1) |

### Index

| Cột | Loại | Mục đích |
|---|---|---|
| `questionId` | `@@index` | Tối ưu truy vấn options theo câu hỏi |

### Ràng buộc đặc biệt

- `onDelete: Cascade` — Khi xóa câu hỏi, tự động xóa toàn bộ options của nó.
- Mỗi câu hỏi phải có **đúng 1** option `isCorrect: true`.

---

## `attempts`

> Bảng ghi lại mỗi lần người dùng trả lời một câu hỏi. Dữ liệu cốt lõi cho thống kê và tính điểm.

**Table name in DB:** `attempts`

### Thuộc tính

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `String` | `@id @default(cuid())` | Khóa chính |
| `userId` | `String` | FK → `users.id` | Người dùng đã làm câu này |
| `questionId` | `String` | FK → `questions.id` | Câu hỏi được trả lời |
| `selectedOptionId` | `String?` | nullable | Option người dùng chọn (null nếu bỏ qua) |
| `isCorrect` | `Boolean` | required | Kết quả đúng/sai |
| `timeSpentSeconds` | `Int` | `@default(0)` | Thời gian suy nghĩ (giây) |
| `testSessionId` | `String?` | nullable FK → `test_sessions.id` | Phiên thi chứa attempt này (null nếu làm tự do) |
| `createdAt` | `DateTime` | `@default(now())` | Thời gian trả lời |

### Quan hệ

| Relation | Model | Mục đích |
|---|---|---|
| `user` | `User` | Người dùng đã làm (nhiều-1) |
| `question` | `Question` | Câu hỏi được trả lời (nhiều-1) |
| `testSession` | `TestSession?` | Test session chứa attempt (nếu có) |

### Indexes

| Cột | Loại | Mục đích |
|---|---|---|
| `userId` | Index | Tối ưu lấy lịch sử của 1 user |
| `testSessionId` | Index | Tối ưu lấy attempts theo session |

### Ràng buộc Cascade

- `user`: `onDelete: Cascade` — Xóa user thì xóa luôn attempts.
- `question`: `onDelete: Cascade` — Xóa câu hỏi thì xóa luôn attempts.
- `testSession`: không cascade — Tránh xóa attempts khi xóa session.

### Use case: `/api/stats`

```ts
// GET /api/stats tính toán thống kê từ bảng attempts
const [totalAttempts, correctAttempts, allAttempts, recentAttempts] =
  await Promise.all([
    prisma.attempt.count({ where: { userId } }),
    prisma.attempt.count({ where: { userId, isCorrect: true } }),
    prisma.attempt.findMany({
      where: { userId },
      select: { isCorrect: true, question: { select: { type: true } } },
    }),
    prisma.attempt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { question: { select: { type: true, difficulty: true } } },
    }),
  ])
```

---

## `test_sessions`

> Phiên làm bài (một lần người dùng bắt đầu làm và kết thúc). Cho phép luyện tập có cấu trúc.

**Table name in DB:** `test_sessions`

### Thuộc tính

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `String` | `@id @default(cuid())` | Khóa chính |
| `userId` | `String` | FK → `users.id` | Người dùng tạo session |
| `type` | `SessionType` | required | Loại session (PRACTICE / TIMED_TEST) |
| `timeLimitMinutes` | `Int?` | nullable | Thời gian giới hạn (phút), null nếu PRACTICE |
| `totalQuestions` | `Int` | `@default(0)` | Tổng số câu hỏi trong session |
| `correctCount` | `Int` | `@default(0)` | Số câu đúng |
| `status` | `SessionStatus` | `@default(IN_PROGRESS)` | Trạng thái session |
| `startedAt` | `DateTime` | `@default(now())` | Thời gian bắt đầu |
| `completedAt` | `DateTime?` | nullable | Thời gian hoàn thành |

### Quan hệ

| Relation | Model | Mục đích |
|---|---|---|
| `user` | `User` | Người dùng sở hữu session (nhiều-1) |
| `attempts` | `Attempt[]` | Các câu trả lời trong session (1-nhiều) |

### Index

| Cột | Loại | Mục đích |
|---|---|---|
| `userId` | Index | Tối ưu lấy danh sách session của 1 user |

---

## `tags`

> Danh sách tag để gắn thẻ cho câu hỏi (VD: `#causative`, `#collocation`, `#frequent`).

**Table name in DB:** `tags`

### Thuộc tính

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | `String` | `@id @default(cuid())` | Khóa chính |
| `name` | `String` | `@unique` | Tên tag (unique) |
| `description` | `String?` | nullable | Mô tả tag |

### Quan hệ

| Relation | Model | Mục đích |
|---|---|---|
| `questions` | `QuestionTag[]` | Các câu hỏi mang tag này (qua bảng trung gian) |

---

## `question_tags`

> Bảng trung gian cho quan hệ nhiều-nhiều giữa `questions` và `tags`.

**Table name in DB:** `question_tags`

### Thuộc tính

| Cột | Kiểu | Ràng buộc | Mô tả |
|---|---|---|---|
| `questionId` | `String` | Composite PK, FK → `questions.id` | ID câu hỏi |
| `tagId` | `String` | Composite PK, FK → `tags.id` | ID tag |

### Quan hệ

| Relation | Model | Mục đích |
|---|---|---|
| `question` | `Question` | Câu hỏi được gắn tag (nhiều-1) |
| `tag` | `Tag` | Tag được gắn cho câu hỏi (nhiều-1) |

### Composite Primary Key

```prisma
@@id([questionId, tagId])
```

Đảm bảo mỗi cặp question-tag là duy nhất, không thể gắn cùng 1 tag 2 lần cho 1 câu hỏi.

### Cascade

Cả 2 FK đều có `onDelete: Cascade` — Xóa question hoặc tag thì tự động xóa dòng trong bảng trung gian.

---

## Relationship Map

```
users ──┬── attempts ──┬── questions ──┬── options
        │               │               │
        │               │               └── question_tags ── tags
        │               │
        │               └── test_sessions
        │
        └── test_sessions ── attempts
```

### Mối quan hệ chính

| Từ | Đến | Kiểu | Khóa | Mục đích |
|---|---|---|---|---|
| `users` | `attempts` | 1-nhiều | `userId` | 1 user làm nhiều câu |
| `users` | `test_sessions` | 1-nhiều | `userId` | 1 user tạo nhiều phiên làm bài |
| `questions` | `options` | 1-nhiều | `questionId` | 1 câu hỏi có 4 options |
| `questions` | `attempts` | 1-nhiều | `questionId` | 1 câu hỏi được nhiều người trả lời |
| `questions` | `tags` | nhiều-nhiều | `question_tags` | 1 câu hỏi có nhiều tags, 1 tag có nhiều câu hỏi |
| `test_sessions` | `attempts` | 1-nhiều | `testSessionId` | 1 phiên làm bài có nhiều câu trả lời |

### CASCADE behavior tổng hợp

| Xóa | Ảnh hưởng |
|---|---|
| Xóa `User` | Tự động xóa `Attempt`, `TestSession` của user đó |
| Xóa `Question` | Tự động xóa `Option`, `Attempt`, `QuestionTag` của câu đó |
| Xóa `Tag` | Tự động xóa `QuestionTag` tương ứng |
| Xóa `TestSession` | Không ảnh hưởng `Attempt` (giữ lại lịch sử) |
