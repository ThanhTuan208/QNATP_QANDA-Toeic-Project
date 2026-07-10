# Header Features Documentation

> Cập nhật: 08/07/2026
> Base: `src/constants/header.constant.ts` (nav items), `src/constants/sidebar.constant.ts` (route mapping)

---

## Kiến trúc Navigation

Project có **2 tầng navigation**:

| Tầng | Component | Constants | Đặc điểm |
|------|-----------|-----------|----------|
| **Sidebar** | `sidebar-navigation.tsx` | `sidebar.constant.ts` | 3 mục chính: Luyện tập, Tiến độ, Quản lý. Dùng icon + label. Route đơn giản. |
| **Header** | `header-navigation.tsx` | `header.constant.ts` | 4 mục chính, mỗi mục có dropdown chi tiết với icon + mô tả + href. |

> ⚠️ **Lưu ý**: Sidebar và Header có scope khác nhau. Sidebar là navigation tổng (điều hướng trang), Header là navigation chi tiết (điều hướng feature). Không nhất thiết phải khớp 1:1.

---

## Header Navigation (4 trụ cột)

Thứ tự ưu tiên: **Luyện tập → Đề thi thử → Tiến độ → Tài liệu**

```
Header (Dropdown Navigation)

├── Luyện tập (Practice)
│   ├── Grammar                    /practice/grammar
│   ├── Vocabulary                 /practice/vocabulary
│   ├── Mixed Practice             /practice/mixed-practice
│   ├── Saved Questions            /practice/save-question
│   └── Wrong Answers              /practice/wrong-answers
│
├── Đề thi thử (Mock Tests)
│   ├── Full                       /exam/full-question
│   ├── Listening                  /exam/listening-question
│   └── Reading                    /exam/reading-question
│
├── Tiến độ (Progress)
│   ├── Overview                   /progress/overview
│   ├── Learning Progress          /progress/learning-progress
│   ├── Practice History           /progress/practice-history
│   ├── Mistakes Review            /progress/mistakes-review
│   ├── Saved Questions            /progress/saved-questions
│   ├── Weak Areas                 /progress/weak-areas
│   ├── Goals                      /progress/goals
│   ├── Statistics                 /progress/statistics
│   ├── Achievements               /progress/achievements
│   └── Reports                    /progress/reports
│
└── Tài liệu (Resources)
    ├── Grammar Guide              /resources/grammar-guide
    ├── Vocabulary Library         /resources/vocabulary-library
    ├── Collocations               /resources/collocations
    ├── Tips & Strategies          /resources/tips-strategies
    ├── Study Roadmap              /resources/study-roadmap
    ├── Cheat Sheets               /resources/cheat-sheets
    ├── Blog                       /resources/blog
    ├── FAQ                        /resources/faq
    └── Downloads                  /resources/downloads
```

---

## Chi tiết từng mục

### 1. Luyện tập (Practice)

Học và thực hành theo chủ đề/kỹ năng.

| Mục | Mô tả | Route | Ghi chú |
|-----|-------|-------|---------|
| **Grammar** | Luyện tập theo chủ điểm ngữ pháp (Word Form, Verb Tense, Relative Clause, Preposition, Comparison, Passive Voice) | `/practice/grammar` | ✅ Implemented |
| **Vocabulary** | Luyện tập từ vựng TOEIC (Business, Office, Travel, Marketing, Finance) | `/practice/vocabulary` | ✅ Implemented |
| **Mixed Practice** | Bài luyện tổng hợp nhiều chủ đề, mô phỏng Part 5 | `/practice/mixed-practice` | ✅ Implemented |
| **Saved Questions** | Câu hỏi đã lưu để xem lại, phân loại theo thư mục | `/practice/save-question` | ✅ Implemented |
| **Wrong Answers** | Câu hỏi từng trả lời sai, ôn lại và theo dõi cải thiện | `/practice/wrong-answers` | ✅ Implemented |

### 2. Đề thi thử (Mock Tests)

Bài kiểm tra có cấu trúc giống đề thi TOEIC thật.

| Mục | Mô tả | Route | Ghi chú |
|-----|-------|-------|---------|
| **Full** | Đề thi hoàn chỉnh 100 câu Reading / 200 câu Full TOEIC | `/exam/full-question` | ✅ Implemented |
| **Listening** | Đề thi nghe (Part 1-4) | `/exam/listening-question` | ✅ Implemented |
| **Reading** | Đề thi đọc (Part 5-7) | `/exam/reading-question` | ✅ Implemented |

**Kế hoạch mở rộng** (chưa implement trong code):

| Mục | Mô tả | Ghi chú |
|-----|-------|---------|
| **Mini Test** | Bài kiểm tra ngắn (20, 30, 50 câu) | 🔜 Planned |
| **ETS Collection** | Danh sách đề ETS (2023, 2024, 2025) | 🔜 Planned |
| **Test History** | Lưu bài thi đã hoàn thành (điểm, thời gian, tỷ lệ đúng) | 🔜 Planned |
| **Review Test** | Xem lại bài thi (đáp án, giải thích, phân tích lỗi) | 🔜 Planned |

### 3. Tiến độ (Progress)

Theo dõi và phân tích toàn bộ quá trình học tập.

| Mục | Mô tả | Route | Ghi chú |
|-----|-------|-------|---------|
| **Overview** | Tổng quan: Estimated TOEIC Score, Accuracy, Questions Answered, Study Time, Current Streak | `/progress/overview` | ✅ Implemented |
| **Learning Progress** | Tiến độ từng chủ đề (Grammar: 95%, Vocabulary: 91%, ...) | `/progress/learning-progress` | ✅ Implemented |
| **Practice History** | Lịch sử luyện tập (bài làm, điểm, thời gian) | `/progress/practice-history` | ✅ Implemented |
| **Mistakes Review** | Xem lại lỗi sai, theo dõi tỷ lệ cải thiện | `/progress/mistakes-review` | ✅ Implemented |
| **Saved Questions** | Câu hỏi đã lưu từ Tiến độ (mục đích theo dõi khác với Luyện tập) | `/progress/saved-questions` | ✅ Implemented |
| **Weak Areas** | Phần kiến thức còn yếu cần cải thiện | `/progress/weak-areas` | ✅ Implemented |
| **Goals** | Thiết lập mục tiêu (TOEIC 700, 30 câu/ngày, 10 giờ/tuần) | `/progress/goals` | ✅ Implemented |
| **Statistics** | Thống kê: Accuracy, Correct/Wrong, Time Spent, Weekly/Monthly Activity | `/progress/statistics` | ✅ Implemented |
| **Achievements** | Thành tựu (100 Questions, 7-Day Streak, Grammar Master) | `/progress/achievements` | ✅ Implemented |
| **Reports** | Báo cáo học tập chi tiết | `/progress/reports` | ✅ Implemented |

### 4. Tài liệu (Resources)

Trung tâm học liệu — khác với Luyện tập (học kiến thức → Resources, thực hành → Practice).

| Mục | Mô tả | Route | Ghi chú |
|-----|-------|-------|---------|
| **Grammar Guide** | Kho ngữ pháp: giải thích, ví dụ, lưu ý, lỗi thường gặp, mẹo | `/resources/grammar-guide` | ✅ Implemented |
| **Vocabulary Library** | Thư viện từ vựng: nghĩa, phiên âm, ví dụ, synonyms, collocations | `/resources/vocabulary-library` | ✅ Implemented |
| **Collocations** | Collocation TOEIC (make a decision, reach an agreement, ...) | `/resources/collocations` | ✅ Implemented |
| **Tips & Strategies** | Mẹo làm bài: Time Management, Common Traps, Elimination Strategy | `/resources/tips-strategies` | ✅ Implemented |
| **Study Roadmap** | Lộ trình học tập | `/resources/study-roadmap` | ✅ Implemented |
| **Cheat Sheets** | Tài liệu tóm tắt nhanh | `/resources/cheat-sheets` | ✅ Implemented |
| **Blog** | Bài viết chia sẻ: kinh nghiệm học, phân tích đề ETS, lộ trình | `/resources/blog` | ✅ Implemented |
| **FAQ** | Câu hỏi thường gặp | `/resources/faq` | ✅ Implemented |
| **Downloads** | Tài liệu tải về: PDF Grammar, Vocabulary List, Study Planner, Cheat Sheets | `/resources/downloads` | ✅ Implemented |

---

## Route Mapping

### Header Dropdown → Route

Header dùng route trực tiếp từ `header.constant.ts`, mỗi dropdown item có href riêng.
