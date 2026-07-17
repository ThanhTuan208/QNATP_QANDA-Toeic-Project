export const IMPORT_TEMPLATE = `{
  "questions": [
    {
      "part": 5,
      "type": "word-form",
      "difficulty": "easy",
      "questionText": "The management team ______ a new strategy to improve sales.",
      "options": [
        { "id": "A", "text": "implement", "order": 1, "isCorrect": false, "rationale": "Sai vì 'implement' là động từ nguyên mẫu, không chia theo chủ ngữ 'management team' số ít." },
        { "id": "B", "text": "implements", "order": 2, "isCorrect": true, "rationale": "Đúng vì 'management team' là danh từ số ít, động từ thêm 's' ở thì hiện tại đơn." },
        { "id": "C", "text": "implemented", "order": 3, "isCorrect": false, "rationale": "Sai vì 'implemented' là quá khứ đơn, không phù hợp với thì hiện tại đơn của câu." },
        { "id": "D", "text": "implementation", "order": 4, "isCorrect": false, "rationale": "Sai vì 'implementation' là danh từ, cần động từ sau chủ ngữ." }
      ],
      "correctOptionId": "B",
      "rationale": "The subject 'management team' is singular, so the verb must be 'implements' (third-person singular)."
    },
    {
      "part": 5,
      "type": "vocabulary",
      "difficulty": "medium",
      "questionText": "The company decided to ______ a new software system for inventory management.",
      "options": [
        { "id": "A", "text": "adapt", "order": 1, "isCorrect": false, "rationale": "Sai vì 'adapt' nghĩa là thích nghi, không phù hợp ngữ cảnh chọn hệ thống mới." },
        { "id": "B", "text": "adopt", "order": 2, "isCorrect": true, "rationale": "Đúng vì 'adopt' nghĩa là áp dụng/chọn dùng, phù hợp với tân ngữ 'new software system'." },
        { "id": "C", "text": "adept", "order": 3, "isCorrect": false, "rationale": "Sai vì 'adept' là tính từ (thành thạo), không phải động từ." },
        { "id": "D", "text": "adoptive", "order": 4, "isCorrect": false, "rationale": "Sai vì 'adoptive' là tính từ (thuộc về nhận nuôi), không đúng ngữ nghĩa." }
      ],
      "correctOptionId": "B",
      "rationale": "'Adopt' means to take up or start using something new. 'Adapt' means to adjust, 'adept' is an adjective meaning skilled."
    },
    {
      "part": 6,
      "type": "sentence-insertion",
      "difficulty": "medium",
      "questionText": "The conference will be held in March. ______ Attendees are encouraged to register early. The early bird discount ends on February 15.",
      "options": [
        { "id": "A", "text": "Therefore,", "order": 1, "isCorrect": false, "rationale": "Sai vì 'Therefore' chỉ kết quả/logic nguyên nhân—hậu quả, không phù hợp để thêm thông tin." },
        { "id": "B", "text": "In addition,", "order": 2, "isCorrect": true, "rationale": "Đúng vì 'In addition' dùng để bổ sung thông tin về đăng ký tham dự." },
        { "id": "C", "text": "However,", "order": 3, "isCorrect": false, "rationale": "Sai vì 'However' chỉ sự đối lập, trong khi câu này bổ sung thông tin, không đối lập." },
        { "id": "D", "text": "Otherwise,", "order": 4, "isCorrect": false, "rationale": "Sai vì 'Otherwise' chỉ điều kiện trái ngược, không dùng để thêm thông tin." }
      ],
      "correctOptionId": "B",
      "rationale": "'In addition,' correctly introduces the registration information as additional detail about the conference."
    },
    {
      "part": 7,
      "type": "single-passage",
      "difficulty": "hard",
      "questionText": "What is the main purpose of the announcement?",
      "options": [
        { "id": "A", "text": "To announce a new product launch", "order": 1, "isCorrect": false, "rationale": "Sai vì đoạn văn nói về chính sách nơi làm việc, không phải sản phẩm mới." },
        { "id": "B", "text": "To inform employees about policy changes", "order": 2, "isCorrect": true, "rationale": "Đúng vì đoạn văn thảo luận về các chính sách và hướng dẫn nhân viên được cập nhật." },
        { "id": "C", "text": "To introduce a new team member", "order": 3, "isCorrect": false, "rationale": "Sai vì nội dung không đề cập đến thành viên mới hay sự ra mắt." },
        { "id": "D", "text": "To schedule a company meeting", "order": 4, "isCorrect": false, "rationale": "Sai vì đoạn văn không lên lịch họp mà thông báo thay đổi chính sách." }
      ],
      "correctOptionId": "B",
      "rationale": "The passage discusses updated workplace policies and employee guidelines, not a product launch or team introduction."
    }
  ]
}`
