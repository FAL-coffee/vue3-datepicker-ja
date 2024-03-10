import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isToday,
  isValid,
  parse,
  startOfMonth,
} from 'date-fns'

export function useDateUtilities(displayFormat: string) {
  /**
   * 与えられた年月に基づいてカレンダーの日付リストを生成する
   */
  const generateCalendarDates = (year: number, month: number) => {
    const start = startOfMonth(new Date(year, month))
    const end = endOfMonth(new Date(year, month))
    let days = eachDayOfInterval({ start, end })

    // 先月の日を追加
    const startDayIndex = getDay(start)
    for (let i = 0; i < startDayIndex; i++) {
      days.unshift(addDays(start, -i - 1))
    }

    // 来月の日を追加
    const endDayIndex = getDay(end)
    for (let i = 0; i < 6 - endDayIndex; i++) {
      days.push(addDays(end, i + 1))
    }

    return days
  }

  /**
   * @param {Date | ''} date
   * @returns {string}
   * @description
   * Dateオブジェクトをprops.displayFormatの形式の文字列に変換する
   * 空文字の場合は空文字を返す
   */
  const formatDateToString = (date: Date | '') => {
    return date ? format(date, displayFormat) : ''
  }

  /**
   * @param {string | undefined} dateString
   * @returns {Date | string}
   * @description
   * props.displayFormatの形式の文字列をDateオブジェクトにパースする
   * 入力がない場合、また失敗した場合は空文字を返す
   */
  const parseDateString = (dateString?: string) => {
    if (!dateString) return ''

    const parsedDate = parse(dateString, displayFormat, new Date())
    return isValid(parsedDate) ? parsedDate : ''
  }

  /**
   * @param {string} dateString
   * @returns {{ month: number, year: number }}
   * @description
   * props.desiplayFormatの形式の文字列をパースして年月を取得する
   */
  const getPeriodFromValue = (dateString: string) => {
    const date = parseDateString(dateString) || new Date()

    return { month: date.getMonth(), year: date.getFullYear() }
  }

  /**
   * @param {string} value
   * @returns {string}
   * @description
   * props.displayFormatの形式の文字列をinput要素のvalueにセットする形式に変換する
   */
  const valueToInputFormat = (value: string) => {
    return formatDateToString(parseDateString(value)) || value
  }

  return {
    formatDateToString,
    parseDateString,
    generateCalendarDates,
    isToday,
    isSameDay,
    getPeriodFromValue,
    valueToInputFormat,
  }
}
