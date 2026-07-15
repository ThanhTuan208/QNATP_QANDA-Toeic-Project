# Preset Refactoring — Phase 1: groups → distribution

> Cải thiện kiến trúc Preset của Session Builder: tăng type safety, domain language, khả năng mở rộng cho Part 1–4.

---

## 1. Lý do thay đổi

### Vấn đề hiện tại

Hiện tại `PartPreset` được định nghĩa như sau:

```typescript
// src/features/session-builder/constants/format-presets.ts
interface PartPreset {
  id: string
  name: string
  part: number        // magic number
  groups: {           // mảng không rõ ràng
    type: string      // string literal, dễ typo
    count: number
  }[]
}
```

**Các vấn đề:**

| Vấn đề | Mô tả |
|--------|-------|
| **Magic number** | `part: 5` — không biết 5 là Part 5 hay số câu hỏi |
| **groups là mảng** | Phải `.find()` để lookup, có thể duplicate entries |
| **type là string** | `'word-form'` xuất hiện dưới dạng string literal khắp nơi, dễ typo |
| **Tên groups mơ hồ** | Không nói lên đó là *số lượng câu hỏi phân phối* |
| **Thiếu metadata** | Không có `title`, `description`, `icon`, `difficulty` — UI phải hardcode |
| **Một file chứa tất cả** | `format-presets.ts` chứa cả Part 5, 6, 7 — khi thêm Part 1–4 sẽ quá dài |
| **Không có type-safe phân biệt Part** | Có thể gán type của Part 6 vào distribution của Part 5, TypeScript không bắt lỗi |

### Tác động

- Khi thêm Part 1–4: phải sửa file cũ, dễ conflict
- Khi đổi tên knowledge group: phải search/replace toàn bộ string literals
- Khi cần UI mới (icon, difficulty, badge): không có chỗ để lưu trong type

---

## 2. Kiến trúc mới

### File structure

```
src/features/session-builder/
├── constants/
│   ├── part.ts                        ← PART (const object)
│   └── knowledge-groups.ts            ← P5_GROUP, P6_GROUP, P7_GROUP
│
├── presets/
│   ├── preset.types.ts                ← Types + generic PartPreset
│   ├── preset.utils.ts                ← definePreset() (validation)
│   ├── part5.presets.ts               ← Presets cho Part 5
│   ├── part6.presets.ts               ← Presets cho Part 6
│   ├── part7.presets.ts               ← Presets cho Part 7
│   └── index.ts                       ← SYSTEM_PRESETS + re-exports
│
└── utils/
    └── preset-migration.ts            ← Migrate user presets (localStorage)
```

### Dependency graph

```
constants/part.ts         ← PART.P5, PART.P6, PART.P7
       │
       ▼
constants/knowledge-groups.ts  ← P5_GROUP, P6_GROUP, P7_GROUP
       │                        (const objects + derived types)
       ▼
presets/preset.types.ts        ← DistributionItem<T>, PartPreset<T, P>,
       │                         AnyPartPreset, UserPreset, PRESET_DIFFICULTY
       ▼
presets/preset.utils.ts        ← definePreset() (public)
       │
       ├──▶ presets/part5.presets.ts
       ├──▶ presets/part6.presets.ts
       └──▶ presets/part7.presets.ts
       │
       ▼
presets/index.ts               ← SYSTEM_PRESETS
```

### Domain boundary giữ nguyên

```
Preset (PartPreset)
       │ distribution
       ▼
Session Builder (getPresetConfig)
       │ knowledgeGroups: KnowledgeGroupConfig[]
       ▼
API (POST /api/sessions/generate)
       │
       ▼
Backend (Prisma queries)
```

Thay đổi chỉ ở layer Preset → Session Builder. API, IndexedDB, Backend không đổi.

---

## 3. Từng thay đổi chi tiết

### 3.1 groups[] → distribution[]

**Trước:**

```typescript
groups: [
  { type: 'word-form', count: 3 },
  { type: 'comparison', count: 3 },
]
```

**Sau:**

```typescript
distribution: [
  { type: P5_GROUP.WORD_FORM, count: 3 },
  { type: P5_GROUP.COMPARISON, count: 3 },
] as const
```

**Tại sao giữ array (không đổi thành Record)?**

Preset là *configuration*, cần iterate nhiều hơn lookup.
`distribution.map()` trực tiếp — không cần `Object.entries()` ở khắp nơi.

**Vấn đề duplicate được giải quyết bằng** `definePreset()` — validate uniqueness khi build.

### 3.2 String literal → Const object (KnowledgeGroupType)

**Trước:**

```typescript
// rải rác khắp codebase
type: 'word-form'
type: 'comparison'
type: 'verb-tense'
```

**Sau:**

```typescript
// constants/knowledge-groups.ts
export const P5_GROUP = {
  WORD_FORM:    'word-form',
  COMPARISON:   'comparison',
  VOCABULARY:   'vocabulary',
  VERB_TENSE:   'verb-tense',
  PREPOSITION:  'preposition',
  CONJUNCTION:  'conjunction',
  PARTICIPLE:   'participle',
  VOICE:        'voice',
  RELATIVE_CLAUSE: 'relative-clause',
  AGREEMENT:    'agreement',
} as const

export type P5KnowledgeGroup =
  (typeof P5_GROUP)[keyof typeof P5_GROUP]
```

**Lợi ích:**
- Autocomplete khi gõ `P5_GROUP.`
- Đổi tên knowledge group: sửa một chỗ
- Type-safe: `'word-form'` không còn là string literal rải rác

### 3.3 Magic number → PART enum

**Trước:** `part: 5`

**Sau:**

```typescript
// constants/part.ts
export const PART = {
  P1: 1, P2: 2, P3: 3, P4: 4,
  P5: 5, P6: 6, P7: 7,
} as const

export type Part = (typeof PART)[keyof typeof PART]
```

### 3.4 Generic PartPreset — type-safe theo Part

**Trước:**

```typescript
interface PartPreset {
  part: number
  groups: { type: string; count: number }[]
}

// Không có lỗi — dù Part 6 type vào Part 5
const invalid: PartPreset = {
  part: 5,
  groups: [{ type: 'grammar', count: 3 }],  // 'grammar' là P6_GROUP
}
```

**Sau:**

```typescript
type DistributionItem<T> = {
  type: T
  count: number
}

type PartPreset<TKnowledgeGroup, TPart extends Part> = {
  id: string
  part: TPart
  title: string
  description?: string
  difficulty?: PresetDifficulty
  icon?: string
  distribution: readonly DistributionItem<TKnowledgeGroup>[]
}

// Part-specific types
type Part5Preset = PartPreset<P5KnowledgeGroup, typeof PART.P5>
type Part6Preset = PartPreset<P6KnowledgeGroup, typeof PART.P6>
type Part7Preset = PartPreset<P7KnowledgeGroup, typeof PART.P7>

type AnyPartPreset =
  | Part5Preset
  | Part6Preset
  | Part7Preset
```

**Lợi ích:**

```typescript
// ❌ Compile error — P6 type trong Part 5 preset
const invalid: Part5Preset = {
  part: PART.P5,
  distribution: [{ type: P6_GROUP.GRAMMAR, count: 3 }],
  //                        ^^^^^^^^^^^^^
  //  Type '"grammar"' is not assignable to type 'P5KnowledgeGroup'
}
```

```typescript
// ✅ Type narrowing tự động
const preset: AnyPartPreset = ...

if (preset.part === PART.P5) {
  preset.distribution  // → DistributionItem<P5KnowledgeGroup>[]
  // TypeScript biết đây là Part 5, chỉ gợi ý P5_GROUP.*
}
```

### 3.5 Thêm metadata

**Trước:**

```typescript
{ id: 'p5-balanced', name: 'Balanced', part: 5, groups: [...] }
// không có chỗ cho description, icon, difficulty
```

**Sau:**

```typescript
{
  id: 'p5-balanced',
  part: PART.P5,
  title: 'Balanced',
  description: 'Equal mix of grammar and vocabulary',
  difficulty: PRESET_DIFFICULTY.MEDIUM,
  icon: 'scale',        // string key — không import lucide vào data
  distribution: [...]
}
```

**Nguyên tắc SoC:**
- Data không chứa React component (`icon: Scale`)
- Data chỉ chứa string key (`icon: 'scale'`)
- UI tự map: `const Icon = PRESET_ICONS[preset.icon]`

### 3.6 Tách file theo Part

**Trước:** Một file `format-presets.ts` chứa tất cả Part 5, 6, 7 preset data.

**Sau:** Mỗi Part một file riêng.

```
presets/
├── part5.presets.ts     ← 3 presets (balanced, grammar-heavy, vocab-focused)
├── part6.presets.ts     ← 2 presets (balanced, grammar-heavy)
├── part7.presets.ts     ← 3 presets (balanced, single-heavy, triple-heavy)
└── index.ts             ← export SYSTEM_PRESETS
```

**Khi thêm Part 1–4:** Chỉ việc tạo `part1.presets.ts` → `part4.presets.ts`, update `index.ts`. Không sửa file cũ.

### 3.7 definePreset() — validation tập trung

```typescript
// preset.utils.ts
function validateDistribution<T>(
  distribution: readonly DistributionItem<T>[]
): void {
  const types = distribution.map(d => d.type)
  const unique = new Set(types)

  if (unique.size !== types.length) {
    throw new Error('Duplicate knowledge group type in distribution')
  }
  if (distribution.some(d => d.count <= 0)) {
    throw new Error('Count must be greater than 0')
  }
}

function calculateTotal<T>(distribution: readonly DistributionItem<T>[]): number {
  return distribution.reduce((sum, d) => sum + d.count, 0)
}

export function definePreset<T extends AnyPartPreset>(preset: T): T {
  validateDistribution(preset.distribution)
  return preset
}
```

**API public của module:** chỉ `definePreset()`. Mọi thứ khác là private.

### 3.8 UserPreset — tách version khỏi domain

**Trước:** Không có version. User preset trong localStorage có cấu trúc giống PartPreset.

**Sau:**

```typescript
type UserPreset = {
  version: 2
  createdAt: number
  updatedAt?: number
  id: string
  title: string
  part: Part
  distribution: readonly DistributionItem<string>[]
}
```

**Tách biệt rõ:**
- `PartPreset` = domain model (không có version)
- `UserPreset` = persistence model (có version, timestamps)
- System preset không bao giờ serialize → không cần version

---

## 4. Implementation kế hoạch

### Step-by-step

| Step | File | Thay đổi |
|------|------|----------|
| 1 | `constants/part.ts` | **Tạo mới** — `PART` const object + `Part` type |
| 2 | `constants/knowledge-groups.ts` | **Mở rộng** — thêm `P5_GROUP`, `P6_GROUP`, `P7_GROUP` as const + derived types |
| 3 | `presets/preset.types.ts` | **Tạo mới** — `DistributionItem<T>`, `PartPreset<T,P>`, `AnyPartPreset`, `UserPreset`, `PRESET_DIFFICULTY` |
| 4 | `presets/preset.utils.ts` | **Tạo mới** — `definePreset()` + private helpers |
| 5 | `presets/part5.presets.ts` | **Tạo mới** — 3 presets dùng `definePreset()` + `P5_GROUP` |
| 6 | `presets/part6.presets.ts` | **Tạo mới** — 2 presets |
| 7 | `presets/part7.presets.ts` | **Tạo mới** — 3 presets |
| 8 | `presets/index.ts` | **Tạo mới** — `SYSTEM_PRESETS`, re-export types + `definePreset` |
| 9 | `utils/preset-migration.ts` | **Tạo mới** — migration user preset V1 → V2 |
| 10 | `utils/presets.ts` | **Sửa** — `getPresetConfig()` dùng `.distribution` |
| 11 | Components (`PresetCard`, `GroupStepper`, ...) | **Sửa** — `.groups` → `.distribution` |
| 12 | `constants/format-presets.ts` | **Xoá** — sau khi tất cả import đã chuyển |

### Không thay đổi

- `SessionConfig.knowledgeGroups` (`Record<number, KnowledgeGroupConfig[]>`)
- API contract (`/api/sessions/generate`)
- IndexedDB schema (`PracticeSession`)
- UI-level presets (`presets-data.ts` — Quick/Balanced/Smart/Exam/Custom)
- Backend (`quiz.service.ts`, Prisma)

### Migration user preset

```typescript
// utils/preset-migration.ts
const USER_PRESET_KEY = 'qanda-user-format-presets'

function migrateV1toV2(old: V1Preset): UserPreset {
  return {
    version: 2,
    createdAt: Date.now(),
    ...old,
    distribution: old.groups.map(g => ({
      type: g.type,
      count: g.count,
    })),
  }
}
```

Chạy một lần khi load. Nếu phát hiện version < 2, migrate và save lại.

---

## 5. Tổng kết

### So sánh trước/sau

| Tiêu chí | Trước | Sau |
|----------|-------|-----|
| Lookup knowledge group | `groups.find(g => g.type === 'x')` | `distribution.find(d => d.type === P5_GROUP.X)` |
| Type safety theo Part | ❌ Part 5 có thể chứa type Part 6 | ✅ Compile error |
| Validation | Không, có thể duplicate | ✅ `definePreset()` check uniqueness + count |
| Thêm Part mới | Sửa file cũ | Tạo file mới, update index |
| Metadata (icon, difficulty) | Không có chỗ lưu | ✅ Field riêng |
| Version | Không | ✅ UserPreset có version |
| Domain/Persistence tách biệt | Chung | ✅ PartPreset (domain) ≠ UserPreset (persistence) |
| Public API | Nhiều file, nhiều export | `definePreset()` là public API chính |

### Kiến trúc tương lai (Phase 2 — khi có nhu cầu)

```
DistributionStrategy    ← weights/strategy (new domain)
        │
        ▼
buildDistribution(totalQuestions)
        │
        ▼
PartPreset              ← distribution (giữ nguyên model)
        │
        ▼
SessionConfig
```

`DistributionStrategy` là domain *mới*, không phải nâng cấp của `PartPreset`.
PartPreset vẫn là configuration hoàn chỉnh; Strategy chỉ sinh ra distribution.
