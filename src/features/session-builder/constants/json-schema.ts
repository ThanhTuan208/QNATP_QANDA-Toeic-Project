export interface SchemaField {
  key: string
  type: string
  required: boolean
  values: string
  desc: string
}

export const IMPORT_SCHEMA_FIELDS: SchemaField[] = [
  {
    key: 'part',
    type: 'số',
    required: true,
    values: '5, 6, 7',
    desc: 'Câu hỏi thuộc part nào trong bài thi TOEIC. Part 5 (Hoàn thành câu), Part 6 (Điền vào đoạn văn), Part 7 (Đọc hiểu).',
  },
  {
    key: 'type',
    type: 'chữ',
    required: true,
    values:
      'word-form, vocabulary, verb-tense, preposition, conjunction, participle, voice, relative-clause, agreement, comparison, sentence-insertion, single-passage, double-passage',
    desc: 'Dạng kiến thức của câu hỏi. Ví dụ: word-form (dạng từ), vocabulary (từ vựng), verb-tense (thì động từ). Mỗi part chỉ chấp nhận một số dạng nhất định.',
  },
  {
    key: 'difficulty',
    type: 'chữ',
    required: true,
    values: 'easy, medium, hard',
    desc: 'Độ khó của câu hỏi. Dùng chữ thường: easy (dễ), medium (trung bình), hard (khó). Nếu bạn đã chọn level nào ở bước trước, câu hỏi phải có độ khó tương ứng nếu không sẽ bị loại bỏ.',
  },
  {
    key: 'questionText',
    type: 'chữ',
    required: true,
    values: 'Nội dung bất kỳ, có thể có dấu _____',
    desc: 'Nội dung câu hỏi. Nếu là dạng điền từ, bạn có thể dùng dấu _____ để chỉ chỗ trống.',
  },
  {
    key: 'options',
    type: 'mảng',
    required: true,
    values: 'Mỗi phần tử là một lựa chọn (xem bên dưới), tối thiểu 2 lựa chọn',
    desc: 'Danh sách các lựa chọn trả lời. Mỗi câu phải có ít nhất 2 lựa chọn, thường là 4 (A, B, C, D). Mỗi lựa chọn là một ô chứa các thông tin bên dưới.',
  },
  {
    key: 'options → id',
    type: 'chữ',
    required: true,
    values: 'VD: "A", "B", "C", "D"',
    desc: 'Tên của lựa chọn. Mỗi lựa chọn trong cùng một câu phải có tên riêng, không được trùng nhau.',
  },
  {
    key: 'options → text',
    type: 'chữ',
    required: true,
    values: 'Nội dung bất kỳ',
    desc: 'Nội dung của lựa chọn. Đây là phần thí sinh nhìn thấy và chọn.',
  },
  {
    key: 'options → order',
    type: 'số',
    required: true,
    values: '1, 2, 3, 4…',
    desc: 'Thứ tự hiển thị của lựa chọn trên màn hình. Nên đánh số từ 1, 2, 3, 4… theo đúng thứ tự bạn muốn hiển thị.',
  },
  {
    key: 'options → isCorrect',
    type: 'đúng/sai',
    required: false,
    values: 'true (đúng) hoặc false (sai)',
    desc: 'Đánh dấu lựa chọn này là đáp án đúng. Mỗi câu chỉ có đúng một đáp án đúng. Nếu không đánh dấu, hệ thống sẽ hiểu là sai. Bạn cũng có thể dùng trường correctOptionId thay cho cách này.',
  },
  {
    key: 'correctOptionId',
    type: 'chữ',
    required: false,
    values: 'Phải giống với id của một lựa chọn, VD: "B"',
    desc: 'Cho biết đâu là đáp án đúng bằng cách ghi lại tên của lựa chọn đó. Ví dụ "B" nghĩa là lựa chọn B là đúng. Nếu không có trường này, hệ thống sẽ tự động tìm lựa chọn có isCorrect = true.',
  },
  {
    key: 'rationale',
    type: 'chữ',
    required: false,
    values: 'Nội dung bất kỳ',
    desc: 'Giải thích tại sao đáp án đúng lại đúng. Trường này không bắt buộc, nhưng nên có để người học hiểu được lý do.',
  },
]
