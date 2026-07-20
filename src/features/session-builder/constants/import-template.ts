export const IMPORT_TEMPLATE = `{
  "passages": {
    "p6_email": [
      {
        "id": "E1",
        "title": "Conference Update",
        "content": [
          { "type": "text", "value": "The conference will be held in March." },
          { "type": "blank" },
          { "type": "text", "value": "Attendees are encouraged to register early." },
          { "type": "text", "value": "The early bird discount ends on February 15." }
        ]
      }
    ],
    "p7_memo": [
      {
        "id": "M1",
        "title": "Memo from HR",
        "content": [
          { "type": "text", "value": "All employees are reminded that the annual health insurance enrollment period ends on November 30." },
          { "type": "text", "value": "Please ensure your forms are submitted to HR by the deadline." }
        ]
      }
    ],
    "p7_double": [
      {
        "id": "A",
        "title": "Email from Ms. Chen",
        "content": [
          { "type": "text", "value": "Dear Mr. Park, I am writing to confirm our meeting scheduled for next Friday at 2 PM. Please let me know if this time still works for you." }
        ]
      },
      {
        "id": "B",
        "title": "Mr. Park's Reply",
        "content": [
          { "type": "text", "value": "Dear Ms. Chen, Thank you for your email. Unfortunately, I have a conflict at that time. Could we reschedule for Monday morning instead?" }
        ]
      }
    ]
  },
  "questions": [
    {
      "part": 5,
      "type": "word-form",
      "difficulty": "EASY",
      "questionText": "The management team ______ a new strategy to improve sales.",
      "options": [
        { "id": "A", "text": "implement", "order": 1, "isCorrect": false, "rationale": "Sai vì 'implement' là động từ nguyên mẫu." },
        { "id": "B", "text": "implements", "order": 2, "isCorrect": true, "rationale": "Đúng vì 'management team' số ít, động từ thêm 's'." },
        { "id": "C", "text": "implemented", "order": 3, "isCorrect": false, "rationale": "Sai vì 'implemented' là quá khứ đơn." },
        { "id": "D", "text": "implementation", "order": 4, "isCorrect": false, "rationale": "Sai vì 'implementation' là danh từ." }
      ],
      "correctOptionId": "B",
      "rationale": "Subject 'management team' is singular, verb must be 'implements'."
    },
    {
      "part": 5,
      "type": "vocabulary",
      "difficulty": "MEDIUM",
      "questionText": "The company decided to ______ a new software system.",
      "options": [
        { "id": "A", "text": "adapt", "order": 1, "isCorrect": false, "rationale": "Sai vì 'adapt' nghĩa là thích nghi." },
        { "id": "B", "text": "adopt", "order": 2, "isCorrect": true, "rationale": "Đúng vì 'adopt' nghĩa là áp dụng/chọn dùng." },
        { "id": "C", "text": "adept", "order": 3, "isCorrect": false, "rationale": "Sai vì 'adept' là tính từ." },
        { "id": "D", "text": "adoptive", "order": 4, "isCorrect": false, "rationale": "Sai vì 'adoptive' là tính từ." }
      ],
      "correctOptionId": "B",
      "rationale": "'Adopt' means to take up or start using something new."
    },
    {
      "part": 6,
      "passageGroupId": "p6_email",
      "passageId": "E1",
      "type": "sentence-insertion",
      "difficulty": "MEDIUM",
      "questionText": "Which sentence best fits the blank?",
      "options": [
        { "id": "A", "text": "Therefore,", "order": 1, "isCorrect": false, "rationale": "'Therefore' chỉ kết quả, không phù hợp." },
        { "id": "B", "text": "In addition,", "order": 2, "isCorrect": true, "rationale": "'In addition' bổ sung thông tin đăng ký." },
        { "id": "C", "text": "However,", "order": 3, "isCorrect": false, "rationale": "'However' chỉ đối lập." },
        { "id": "D", "text": "Otherwise,", "order": 4, "isCorrect": false, "rationale": "'Otherwise' chỉ điều kiện trái ngược." }
      ],
      "correctOptionId": "B",
      "rationale": "'In addition,' correctly introduces registration as additional detail."
    },
    {
      "part": 7,
      "passageGroupId": "p7_memo",
      "passageId": "M1",
      "type": "main-idea",
      "difficulty": "HARD",
      "questionText": "What is the main purpose of this memo?",
      "options": [
        { "id": "A", "text": "To announce a new product launch", "order": 1, "isCorrect": false, "rationale": "Sai vì đoạn nói về chính sách, không phải sản phẩm." },
        { "id": "B", "text": "To inform employees about policy changes", "order": 2, "isCorrect": true, "rationale": "Đúng vì đoạn thảo luận chính sách và hướng dẫn." },
        { "id": "C", "text": "To introduce a new team member", "order": 3, "isCorrect": false, "rationale": "Sai vì không đề cập thành viên mới." },
        { "id": "D", "text": "To schedule a company meeting", "order": 4, "isCorrect": false, "rationale": "Sai vì không lên lịch họp." }
      ],
      "correctOptionId": "B",
      "rationale": "The passage discusses updated workplace policies."
    },
    {
      "part": 7,
      "passageGroupId": "p7_double",
      "passageId": "A",
      "type": "main-idea",
      "difficulty": "MEDIUM",
      "questionText": "What is the purpose of Ms. Chen's email?",
      "options": [
        { "id": "A", "text": "To confirm a meeting", "order": 1, "isCorrect": true, "rationale": "Đúng vì cô Chen viết email để xác nhận cuộc họp." },
        { "id": "B", "text": "To cancel an appointment", "order": 2, "isCorrect": false, "rationale": "Sai vì không hủy mà xác nhận." },
        { "id": "C", "text": "To request time off", "order": 3, "isCorrect": false, "rationale": "Sai vì không xin nghỉ." },
        { "id": "D", "text": "To introduce a colleague", "order": 4, "isCorrect": false, "rationale": "Sai vì không giới thiệu đồng nghiệp." }
      ],
      "correctOptionId": "A",
      "rationale": "The email is written to confirm the meeting scheduled for Friday."
    },
    {
      "part": 7,
      "passageGroupId": "p7_double",
      "passageId": "B",
      "type": "detail",
      "difficulty": "MEDIUM",
      "questionText": "What does Mr. Park propose?",
      "options": [
        { "id": "A", "text": "To meet on Friday as planned", "order": 1, "isCorrect": false, "rationale": "Sai vì anh Park có xung đột lịch." },
        { "id": "B", "text": "To reschedule to Monday morning", "order": 2, "isCorrect": true, "rationale": "Đúng vì anh Park đề xuất dời sang sáng Thứ Hai." },
        { "id": "C", "text": "To cancel the meeting", "order": 3, "isCorrect": false, "rationale": "Sai vì không hủy mà đề xuất lịch khác." },
        { "id": "D", "text": "To have a phone call instead", "order": 4, "isCorrect": false, "rationale": "Sai vì không đề cập gọi điện." }
      ],
      "correctOptionId": "B",
      "rationale": "Mr. Park has a conflict and suggests Monday morning instead."
    },
    {
      "part": 7,
      "passageGroupId": "p7_double",
      "passageId": null,
      "type": "inference",
      "difficulty": "HARD",
      "questionText": "What can be inferred about the meeting?",
      "options": [
        { "id": "A", "text": "It was originally scheduled for Friday", "order": 1, "isCorrect": true, "rationale": "Đúng vì Chen đề cập 'next Friday at 2 PM'." },
        { "id": "B", "text": "It has been cancelled", "order": 2, "isCorrect": false, "rationale": "Sai vì Park chỉ đề xuất dời lịch." },
        { "id": "C", "text": "It is a virtual meeting", "order": 3, "isCorrect": false, "rationale": "Sai vì không có thông tin về hình thức." },
        { "id": "D", "text": "It was rescheduled to Monday", "order": 4, "isCorrect": false, "rationale": "Sai vì Park chỉ đề xuất, chưa xác nhận." }
      ],
      "correctOptionId": "A",
      "rationale": "Ms. Chen's email confirms the meeting is on Friday, so it was originally scheduled then."
    }
  ]
}`
