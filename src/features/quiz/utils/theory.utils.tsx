import type { ReactNode } from 'react'

interface TheoryContent {
  title: string
  content: ReactNode
}

const THEORY_DATA: Record<string, TheoryContent> = {
  comparison: {
    title: 'Bảng Tra Cứu So Sánh Hơn',
    content: (
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='bg-muted text-muted-foreground uppercase text-xs'>
              <tr>
                <th className='px-4 py-3 text-left'>Loại</th>
                <th className='px-4 py-3 text-left'>Tính từ ngắn</th>
                <th className='px-4 py-3 text-left'>Tính từ dài</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              <tr>
                <td className='px-4 py-4 font-bold'>Cấu trúc</td>
                <td className='px-4 py-4'>Adj + er + than</td>
                <td className='px-4 py-4'>More + Adj + than</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>Ví dụ</td>
                <td className='px-4 py-4'>Lower, Higher</td>
                <td className='px-4 py-4'>More efficient</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='space-y-4'>
          <div className='p-4 bg-safety-orange-10 rounded-xl border border-safety-orange-20'>
            <h4 className='font-bold text-safety-orange mb-1'>Trường hợp đặc biệt</h4>
            <ul className='text-xs space-y-1 text-safety-orange'>
              <li>• Good/Well → Better</li>
              <li>• Bad/Badly → Worse</li>
              <li>• Far → Farther/Further</li>
            </ul>
          </div>
          <div className='p-4 bg-green-teal-10 rounded-xl border border-green-teal-20'>
            <h4 className='font-bold text-green-teal mb-1'>Từ nhấn mạnh (Intensifiers)</h4>
            <p className='text-xs text-green-dark'>
              Dùng: <strong>Much, Far, Significantly, Considerably, Slightly</strong> trước so sánh
              hơn. Không dùng &quot;Very&quot;.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  'word-form': {
    title: 'Bảng Tra Cứu Từ Loại',
    content: (
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='bg-muted text-muted-foreground uppercase text-xs'>
              <tr>
                <th className='px-4 py-3 text-left'>Từ loại</th>
                <th className='px-4 py-3 text-left'>Đuôi thường gặp</th>
                <th className='px-4 py-3 text-left'>Vai trò</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              <tr>
                <td className='px-4 py-4 font-bold'>Danh từ</td>
                <td className='px-4 py-4'>-tion, -ment, -ness, -ity</td>
                <td className='px-4 py-4'>Chủ ngữ / Tân ngữ</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>Động từ</td>
                <td className='px-4 py-4'>-ate, -ify, -ize, -en</td>
                <td className='px-4 py-4'>Hành động / Trạng thái</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>Tính từ</td>
                <td className='px-4 py-4'>-able, -ful, -ous, -ive</td>
                <td className='px-4 py-4'>Bổ nghĩa danh từ</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>Trạng từ</td>
                <td className='px-4 py-4'>-ly</td>
                <td className='px-4 py-4'>Bổ nghĩa động từ / tính từ</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='p-4 bg-steel-blue-10 rounded-xl border border-steel-blue-20'>
          <h4 className='font-bold text-steel-blue mb-1'>Mẹo nhận biết nhanh</h4>
          <ul className='text-xs space-y-2 text-steel-blue'>
            <li>
              • <strong>Động từ nối</strong> (be, seem, become, remain) → Tính từ
            </li>
            <li>
              • <strong>Động từ thường</strong> (act, work, perform) → Trạng từ
            </li>
            <li>
              • <strong>Sau mạo từ</strong> (a/an/the) → Danh từ / Tính từ + Danh từ
            </li>
            <li>
              • <strong>Sau giới từ</strong> (in, on, at, of, for) → Danh từ / V-ing
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  vocabulary: {
    title: 'Từ Vựng & Collocation',
    content: (
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='bg-muted text-muted-foreground uppercase text-xs'>
              <tr>
                <th className='px-4 py-3 text-left'>Loại Collocation</th>
                <th className='px-4 py-3 text-left'>Ví dụ</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              <tr>
                <td className='px-4 py-4 font-bold'>Verb + Noun</td>
                <td className='px-4 py-4'>
                  reach a consensus, meet a deadline, conduct a survey, launch a product
                </td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>Adj + Noun</td>
                <td className='px-4 py-4'>
                  competitive advantage, substantial increase, feasible plan
                </td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>Verb + Prep</td>
                <td className='px-4 py-4'>account for, consist of, result in, comply with</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>Noun + Prep</td>
                <td className='px-4 py-4'>impact on, increase in, access to, solution to</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>Adj + Prep</td>
                <td className='px-4 py-4'>responsible for, capable of, aware of, eligible for</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='p-4 bg-steel-blue-10 rounded-xl border border-steel-blue-20'>
          <h4 className='font-bold text-steel-blue mb-1'>Chiến lược làm bài</h4>
          <ul className='text-xs space-y-2 text-steel-blue'>
            <li>
              • Học từ vựng theo <strong>cụm</strong>, không học từ đơn lẻ.
            </li>
            <li>
              • Đáp án đúng thường là cụm từ <strong>tự nhiên nhất</strong>.
            </li>
            <li>• Loại trừ đáp án có nghĩa không phù hợp ngữ cảnh trước.</li>
            <li>• Nếu các đáp án khác hẳn nhau về nghĩa → đây là câu từ vựng.</li>
          </ul>
        </div>
      </div>
    ),
  },
  'verb-tense': {
    title: 'Bảng Tra Cứu Thì Động Từ',
    content: (
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='bg-muted text-muted-foreground uppercase text-xs'>
              <tr>
                <th className='px-4 py-3 text-left'>Thì</th>
                <th className='px-4 py-3 text-left'>Dấu hiệu</th>
                <th className='px-4 py-3 text-left'>Tần suất</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              <tr>
                <td className='px-4 py-4 font-bold'>Present Perfect</td>
                <td className='px-4 py-4'>since, for, recently, already, yet</td>
                <td className='px-4 py-4 text-green-dark'>Cao nhất</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>Present Simple</td>
                <td className='px-4 py-4'>every, usually, currently, generally</td>
                <td className='px-4 py-4'>Cao</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>Past Simple</td>
                <td className='px-4 py-4'>last year, in 2023, yesterday, initially</td>
                <td className='px-4 py-4'>Cao</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>Future</td>
                <td className='px-4 py-4'>next quarter, will, is scheduled to</td>
                <td className='px-4 py-4'>Cao</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>Future Perfect</td>
                <td className='px-4 py-4'>will have + V3/ed by + thời gian</td>
                <td className='px-4 py-4'>Thấp</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='space-y-4'>
          <div className='p-4 bg-safety-orange-10 rounded-xl border border-safety-orange-20'>
            <h4 className='font-bold text-safety-orange mb-1'>Lưu ý quan trọng</h4>
            <ul className='text-xs space-y-1 text-safety-orange'>
              <li>
                • <strong>Since + mốc thời gian</strong> → Present Perfect
              </li>
              <li>
                • <strong>For + khoảng thời gian</strong> → Present Perfect
              </li>
              <li>
                • <strong>By + thời gian tương lai</strong> → Future Perfect
              </li>
              <li>
                • <strong>At this time next...</strong> → Future Continuous
              </li>
            </ul>
          </div>
          <div className='p-4 bg-steel-blue-10 rounded-xl border border-steel-blue-20'>
            <h4 className='font-bold text-steel-blue mb-1'>Mẹo</h4>
            <p className='text-xs text-steel-blue'>
              Xác định <strong>trạng từ chỉ thời gian</strong> trong câu trước khi chọn thì. Đây là
              manh mối quan trọng nhất.
            </p>
          </div>
        </div>
      </div>
    ),
  },
  preposition: {
    title: 'Bảng Tra Cứu Giới Từ',
    content: (
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='bg-muted text-muted-foreground uppercase text-xs'>
              <tr>
                <th className='px-4 py-3 text-left'>Nhóm</th>
                <th className='px-4 py-3 text-left'>Ví dụ</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              <tr>
                <td className='px-4 py-4 font-bold'>Thời gian</td>
                <td className='px-4 py-4'>on Monday, in March, at 3 PM, by Friday, since 2023</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>Nơi chốn</td>
                <td className='px-4 py-4'>at the office, in the building, on the floor</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>Phương tiện</td>
                <td className='px-4 py-4'>by mail, via courier, on the phone, in writing</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>Verb + Prep</td>
                <td className='px-4 py-4'>depend on, apply for, participate in, deal with</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>Adj + Prep</td>
                <td className='px-4 py-4'>aware of, responsible for, capable of, satisfied with</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='p-4 bg-green-teal-10 rounded-xl border border-green-teal-20'>
          <h4 className='font-bold text-green-dark mb-1'>Quy tắc ghi nhớ</h4>
          <ul className='text-xs space-y-2 text-green-dark'>
            <li>
              • <strong>on + ngày cụ thể</strong> (on May 15th)
            </li>
            <li>
              • <strong>in + tháng/năm/mùa</strong> (in March, in 2024)
            </li>
            <li>
              • <strong>at + giờ/địa điểm cụ thể</strong> (at 3 PM, at the counter)
            </li>
            <li>
              • <strong>by + hạn cuối</strong> (by Friday = trước thứ 6)
            </li>
            <li>
              • Học thuộc <strong>verb + preposition</strong> như từ vựng đơn lẻ.
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  conjunction: {
    title: 'Bảng Tra Cứu Liên Từ & Từ Nối',
    content: (
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='bg-muted text-muted-foreground uppercase text-xs'>
              <tr>
                <th className='px-4 py-3 text-left'>Chức năng</th>
                <th className='px-4 py-3 text-left'>Từ nối</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              <tr>
                <td className='px-4 py-4 font-bold'>Nguyên nhân</td>
                <td className='px-4 py-4'>because, since, as, due to (+ N), owing to (+ N)</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>Kết quả</td>
                <td className='px-4 py-4'>therefore, as a result, consequently, thus, so</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>Đối lập</td>
                <td className='px-4 py-4'>
                  although, even though, while, whereas, however, nevertheless, but
                </td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>Bổ sung</td>
                <td className='px-4 py-4'>
                  moreover, furthermore, in addition, additionally, besides
                </td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>Điều kiện</td>
                <td className='px-4 py-4'>if, unless, provided that, as long as, in case</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='p-4 bg-error-soft rounded-xl border border-error/20'>
          <h4 className='font-bold text-error mb-1'>Lưu ý quan trọng</h4>
          <ul className='text-xs space-y-2 text-error'>
            <li>
              • <strong>Due to / Because of + N</strong> ≠ <strong>Because / Since + S + V</strong>
            </li>
            <li>
              • <strong>Despite / In spite of + N/V-ing</strong> ≠ <strong>Although + S + V</strong>
            </li>
            <li>
              • <strong>However / Therefore</strong> đứng đầu câu mới, sau dấu chấm hoặc dấu chấm
              phẩy.
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  participle: {
    title: 'Bảng Tra Cứu Phân Từ (V-ing / V3/ed)',
    content: (
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='bg-muted text-muted-foreground uppercase text-xs'>
              <tr>
                <th className='px-4 py-3 text-left'>Phân từ</th>
                <th className='px-4 py-3 text-left'>Ý nghĩa</th>
                <th className='px-4 py-3 text-left'>Ví dụ</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              <tr>
                <td className='px-4 py-4 font-bold'>V-ing</td>
                <td className='px-4 py-4'>Chủ động (đang/để làm)</td>
                <td className='px-4 py-4'>a leading provider, the serving desk</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>V3/ed</td>
                <td className='px-4 py-4'>Bị động (được làm)</td>
                <td className='px-4 py-4'>the appointed manager, the proposed plan</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='space-y-4'>
          <div className='p-4 bg-steel-blue-10 rounded-xl border border-steel-blue-20'>
            <h4 className='font-bold text-steel-blue mb-1'>Cách nhận biết</h4>
            <ul className='text-xs space-y-1 text-steel-blue'>
              <li>
                • Nếu danh từ <strong>tự làm hành động</strong> → V-ing
              </li>
              <li>
                • Nếu danh từ <strong>bị tác động</strong> → V3/ed
              </li>
            </ul>
          </div>
          <div className='p-4 bg-muted rounded-xl border border-border'>
            <h4 className='font-bold text-muted-foreground mb-1'>Mở rộng câu</h4>
            <ul className='text-xs space-y-1 text-muted-foreground'>
              <li>
                • <strong>V-ing</strong> = &quot;which/who + V(chủ động)&quot;
              </li>
              <li>
                • <strong>V3/ed</strong> = &quot;which/who + be + V3/ed (bị động)&quot;
              </li>
            </ul>
          </div>
        </div>
      </div>
    ),
  },
  voice: {
    title: 'Thể Bị Động & Causative',
    content: (
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='bg-muted text-muted-foreground uppercase text-xs'>
              <tr>
                <th className='px-4 py-3 text-left'>Cấu trúc</th>
                <th className='px-4 py-3 text-left'>Ví dụ</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              <tr>
                <td className='px-4 py-4 font-bold'>Bị động (be + V3/ed)</td>
                <td className='px-4 py-4'>The report was prepared by the finance team.</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>have + O + V3/ed</td>
                <td className='px-4 py-4'>We had the system upgraded.</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>get + O + V3/ed</td>
                <td className='px-4 py-4'>We got the documents signed.</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>Động từ nối + adj</td>
                <td className='px-4 py-4'>It remains unclear. / The plan proved effective.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='space-y-4'>
          <div className='p-4 bg-error-soft rounded-xl border border-error/20'>
            <h4 className='font-bold text-error mb-1'>Dấu hiệu nhận biết</h4>
            <ul className='text-xs space-y-1 text-error'>
              <li>
                • Chủ ngữ <strong>không tự thực hiện</strong> hành động → bị động
              </li>
              <li>
                • Có <strong>by + agent</strong> → bị động
              </li>
              <li>
                • <strong>Have/Get + O + V3/ed</strong> = thuê/sắp xếp ai làm gì
              </li>
            </ul>
          </div>
          <div className='p-4 bg-muted rounded-xl border border-border'>
            <h4 className='font-bold text-muted-foreground mb-1'>Lưu ý</h4>
            <p className='text-xs text-muted-foreground'>
              <strong>Have something done</strong> (chủ động sắp xếp) ≠{' '}
              <strong>Something is done</strong>
              (hành động xảy ra với chủ ngữ).
            </p>
          </div>
        </div>
      </div>
    ),
  },
  'relative-clause': {
    title: 'Bảng Tra Cứu Mệnh Đề Quan Hệ',
    content: (
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='bg-muted text-muted-foreground uppercase text-xs'>
              <tr>
                <th className='px-4 py-3 text-left'>Đại từ</th>
                <th className='px-4 py-3 text-left'>Chủ thể</th>
                <th className='px-4 py-3 text-left'>Vai trò</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              <tr>
                <td className='px-4 py-4 font-bold'>who</td>
                <td className='px-4 py-4'>Người</td>
                <td className='px-4 py-4'>Chủ ngữ</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>whom</td>
                <td className='px-4 py-4'>Người</td>
                <td className='px-4 py-4'>Tân ngữ</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>which</td>
                <td className='px-4 py-4'>Vật</td>
                <td className='px-4 py-4'>Chủ ngữ / Tân ngữ</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>that</td>
                <td className='px-4 py-4'>Người/Vật</td>
                <td className='px-4 py-4'>Chủ ngữ / Tân ngữ (ko sau dấu phẩy)</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>whose</td>
                <td className='px-4 py-4'>Người/Vật</td>
                <td className='px-4 py-4'>Sở hữu</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>where</td>
                <td className='px-4 py-4'>Nơi chốn</td>
                <td className='px-4 py-4'>Trạng từ</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='p-4 bg-steel-blue-10 rounded-xl border border-steel-blue-20'>
          <h4 className='font-bold text-steel-blue mb-1'>Cách chọn nhanh</h4>
          <ul className='text-xs space-y-2 text-steel-blue'>
            <li>
              • <strong>who</strong> → thay thế chủ ngữ <strong>người</strong>
            </li>
            <li>
              • <strong>whom</strong> → thay thế tân ngữ <strong>người</strong> (sau giới từ)
            </li>
            <li>
              • <strong>which</strong> → thay thế chủ/tân ngữ <strong>vật</strong>
            </li>
            <li>
              • <strong>whose</strong> → chỉ <strong>sở hữu</strong> (của ai/của cái gì)
            </li>
            <li>
              • <strong>where</strong> → thay thế <strong>nơi chốn</strong>
            </li>
          </ul>
        </div>
      </div>
    ),
  },
  agreement: {
    title: 'Sự Hòa Hợp Chủ Ngữ - Động Từ',
    content: (
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead className='bg-muted text-muted-foreground uppercase text-xs'>
              <tr>
                <th className='px-4 py-3 text-left'>Trường hợp</th>
                <th className='px-4 py-3 text-left'>Số</th>
                <th className='px-4 py-3 text-left'>Ví dụ</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              <tr>
                <td className='px-4 py-4 font-bold'>S1 + and + S2</td>
                <td className='px-4 py-4'>Số nhiều</td>
                <td className='px-4 py-4'>The CEO and the CFO are attending...</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>Each / Every / Either / Neither</td>
                <td className='px-4 py-4'>Số ít</td>
                <td className='px-4 py-4'>Each applicant is required...</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>A number of + N</td>
                <td className='px-4 py-4'>Số nhiều</td>
                <td className='px-4 py-4'>A number of issues have been...</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>The number of + N</td>
                <td className='px-4 py-4'>Số ít</td>
                <td className='px-4 py-4'>The number of complaints has risen...</td>
              </tr>
              <tr>
                <td className='px-4 py-4 font-bold'>N + together with / as well as</td>
                <td className='px-4 py-4'>Theo N đầu</td>
                <td className='px-4 py-4'>The manager, along with his team, is...</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='space-y-4'>
          <div className='p-4 bg-green-teal-10 rounded-xl border border-green-teal-20'>
            <h4 className='font-bold text-green-dark mb-1'>Mẹo xử lý nhanh</h4>
            <ul className='text-xs space-y-1 text-green-dark'>
              <li>
                • Xác định <strong>chủ ngữ chính</strong>, bỏ qua cụm giới từ theo sau.
              </li>
              <li>
                • <strong>Neither... nor / Either... or</strong> → chia theo chủ ngữ gần nhất.
              </li>
            </ul>
          </div>
          <div className='p-4 bg-muted rounded-xl border border-border'>
            <h4 className='font-bold text-muted-foreground mb-1'>Bẫy thường gặp</h4>
            <p className='text-xs text-muted-foreground'>
              Các cụm <strong>together with, along with, as well as, including</strong> không làm
              thay đổi số của chủ ngữ chính.
            </p>
          </div>
        </div>
      </div>
    ),
  },
}

const DEFAULT_THEORY: TheoryContent = {
  title: 'Kiến thức nền tảng',
  content: (
    <div className='p-6 bg-muted rounded-xl text-center'>
      <p className='text-sm text-muted-foreground'>
        Nội dung kiến thức cho dạng bài này đang được cập nhật.
      </p>
    </div>
  ),
}

export function getTheoryContent(type: string): TheoryContent {
  return THEORY_DATA[type] ?? DEFAULT_THEORY
}
