export function TutorialPromptForUserCopy(
  partsLine: string,
  countSection: string,
  levelList: string,
  countLines: string,
) {
  return `___ HƯỚNG DẪN CHO AI ___

Bạn là chuyên gia ra đề thi TOEIC Reading. Hãy tạo câu hỏi theo các yêu cầu sau:

1. PART CẦN TẠO: ${partsLine}

2. CẤU TRÚC JSON TỔNG THỂ:
   - Cấp cao nhất là object gồm 2 trường: "passages" và "questions"
   - "passages": object, key là groupId, value là array chứa các passage object
   - "questions": array chứa tất cả câu hỏi
   - Mỗi passage object có:
       • "id": định danh passage (vd: "P1", "A", "B")
       • "title": tiêu đề passage
       • "content": array các block { "type": "text", "value": "..." }
         hoặc { "type": "blank" } cho Part 6
   - Mỗi question object có:
       • "part": 5, 6, hoặc 7
       • "type": loại câu hỏi
       • "difficulty": độ khó (${levelList})
       • "passageGroupId": tham chiếu đến key trong "passages" (Part 6/7)
       • "passageId": id của passage cụ thể trong group (Part 6/7)
       • "questionText": CHỈ nội dung câu hỏi, KHÔNG chứa passage
       • "options": mảng 4 đối tượng:
           - "id": A, B, C, D
           - "text": nội dung lựa chọn (tiếng Anh)
           - "order": 1-4
           - "isCorrect": true/false
           - "rationale": giải thích tiếng Việt (2-3 câu)
       • "correctOptionId": id đáp án đúng (vd: "B")
   - Với Part 5, bỏ qua "passageGroupId" và "passageId"

3. VÍ DỤ JSON ĐẦU RA:

   Part 5 (câu đơn):
   { "part": 5, "type": "word-form", "difficulty": "EASY",
     "questionText": "The management team ______ a new strategy.",
     "options": [
       { "id": "A", "text": "implement", "order": 1, "isCorrect": false, "rationale": "..." },
       { "id": "B", "text": "implements", "order": 2, "isCorrect": true, "rationale": "..." }
     ],
     "correctOptionId": "B" }

   Part 6 (1 passage + 1 question, blank trong passage):
   "passages": { "p6_email": [{ "id": "P1", "title": "Conference Update",
     "content": [
       { "type": "text", "value": "The conference will be held in March." },
       { "type": "blank" },
       { "type": "text", "value": "Attendees are encouraged to register early." }
     ] }] },
   "questions": [{ "part": 6, "passageGroupId": "p6_email", "passageId": "P1",
     "type": "transition", "questionText": "Which sentence best fits the blank?", ... }]

   Part 7 single (1 passage + nhiều questions):
   "passages": { "p7_memo": [{ "id": "P1", "title": "Memo from HR",
     "content": [{ "type": "text", "value": "All employees are reminded that ..." }] }] },
   "questions": [
     { "part": 7, "passageGroupId": "p7_memo", "passageId": "P1", "type": "main-idea",
       "questionText": "What is the main purpose?", ... },
     { "part": 7, "passageGroupId": "p7_memo", "passageId": "P1", "type": "detail",
       "questionText": "When is the deadline?", ... }
   ]

   Part 7 double (2 passages + nhiều questions):
   "passages": { "p7_double": [
     { "id": "A", "title": "Email from Ms. Chen",
       "content": [{ "type": "text", "value": "Dear Mr. Park, I am writing to confirm..." }] },
     { "id": "B", "title": "Mr. Park's Reply",
       "content": [{ "type": "text", "value": "Dear Ms. Chen, Thank you for your email..." }] }
   ] },
   "questions": [
     { "part": 7, "passageGroupId": "p7_double", "passageId": "A", "type": "main-idea",
       "questionText": "What is the purpose of the email?", ... },
     { "part": 7, "passageGroupId": "p7_double", "passageId": "A", "type": "detail",
       "questionText": "What problem does Ms. Chen report?", ... },
     { "part": 7, "passageGroupId": "p7_double", "passageId": "B", "type": "detail",
       "questionText": "How does Mr. Park respond?", ... }
   ]

${countSection}4. YÊU CẦU CHI TIẾT THEO TỪNG PART:

   PART 5 (Incomplete Sentences) - câu điền từ:
   - "word-form": Chọn dạng đúng của từ (danh từ, động từ, tính từ, trạng từ)
   - "comparison": So sánh hơn/kém với tính từ/trạng từ
   - "vocabulary": Chọn từ vựng/collocation đúng
   - "verb-tense": Chọn thì đúng của động từ
   - "preposition": Chọn giới từ đúng
   - "conjunction": Chọn liên từ/từ nối đúng
   - "participle": Chọn phân từ V-ing hoặc V3
   - "voice": Câu bị động/causative
   - "relative-clause": Mệnh đề quan hệ
   - "agreement": Hòa hợp chủ ngữ-động từ
   - "modal-verbs": Động từ khuyết thiếu
   - "conditionals": Câu điều kiện
   - "infinitive-gerund": Động từ nguyên mẫu và danh động từ
   - "parallel-structure": Cấu trúc song song
   - "pronoun": Đại từ
   - "determiner-quantifier": Lượng từ

   PART 6 (Text Completion) - Dùng passages[] + content blocks, dùng { "type": "blank" } cho chỗ trống:
   - "sentence-insertion": Chọn câu thích hợp để điền vào chỗ trống
   - "grammar": Chọn cấu trúc ngữ pháp đúng trong ngữ cảnh
   - "vocabulary": Chọn từ vựng phù hợp với ngữ cảnh
   - "transition": Chọn từ nối thể hiện quan hệ logic (however, therefore, moreover, meanwhile...)

   PART 7 (Reading Comprehension) - Dùng passages[] + content blocks. Mỗi passage chỉ viết 1 lần, nhiều câu hỏi dùng chung:
   - "main-idea": Xác định ý chính/mục đích của đoạn văn
   - "detail": Tìm thông tin chi tiết được đề cập trong đoạn
   - "inference": Suy luận thông tin không được nói trực tiếp
   - "vocabulary-in-context": Đoán nghĩa của từ trong ngữ cảnh
   - "reference": Xác định đại từ/trạng từ thay thế cho cái gì
   - "intention": Xác định ý định của tác giả
   - "next-step": Xác định bước tiếp theo sẽ xảy ra
   - "not-question": Tìm thông tin KHÔNG được đề cập

5. ĐỘ KHÓ YÊU CẦU: ${levelList}
   Trường "difficulty" của mỗi câu phải là một trong các giá trị: ${levelList}.

6. YÊU CẦU KHÁC:
   - Đúng 1 đáp án đúng duy nhất (isCorrect: true)
   - Các đáp án sai (distractors) phải hợp lý, dễ gây nhầm lẫn
   - Mỗi option phải có "rationale": giải thích bằng tiếng Việt (2-3 câu) nêu rõ quy tắc, giải thích tại sao đúng/sai
   - KHÔNG thêm text nào khác ngoài JSON (không markdown, không code block)
   - Đầu ra phải là JSON object duy nhất có dạng { "passages": {...}, "questions": [...] }${countLines.trim().length > 0 ? '\n   - Đảm bảo đúng số lượng câu hỏi cho mỗi part/type như yêu cầu ở mục 3' : ''}`
}
