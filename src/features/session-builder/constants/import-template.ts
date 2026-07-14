export const IMPORT_TEMPLATE = `{
  "questions": [
    {
      "part": 5,
      "type": "word-form",
      "difficulty": "easy",
      "questionText": "The management team ______ a new strategy to improve sales.",
      "options": [
        { "id": "A", "text": "implement", "order": 1, "isCorrect": false },
        { "id": "B", "text": "implements", "order": 2, "isCorrect": true },
        { "id": "C", "text": "implemented", "order": 3, "isCorrect": false },
        { "id": "D", "text": "implementation", "order": 4, "isCorrect": false }
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
        { "id": "A", "text": "adapt", "order": 1, "isCorrect": false },
        { "id": "B", "text": "adopt", "order": 2, "isCorrect": true },
        { "id": "C", "text": "adept", "order": 3, "isCorrect": false },
        { "id": "D", "text": "adoptive", "order": 4, "isCorrect": false }
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
        { "id": "A", "text": "Therefore,", "order": 1, "isCorrect": false },
        { "id": "B", "text": "In addition,", "order": 2, "isCorrect": true },
        { "id": "C", "text": "However,", "order": 3, "isCorrect": false },
        { "id": "D", "text": "Otherwise,", "order": 4, "isCorrect": false }
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
        { "id": "A", "text": "To announce a new product launch", "order": 1, "isCorrect": false },
        { "id": "B", "text": "To inform employees about policy changes", "order": 2, "isCorrect": true },
        { "id": "C", "text": "To introduce a new team member", "order": 3, "isCorrect": false },
        { "id": "D", "text": "To schedule a company meeting", "order": 4, "isCorrect": false }
      ],
      "correctOptionId": "B",
      "rationale": "The passage discusses updated workplace policies and employee guidelines, not a product launch or team introduction."
    }
  ]
}`
