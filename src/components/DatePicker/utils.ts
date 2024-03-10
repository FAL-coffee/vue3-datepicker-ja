/**
 * @param {T[]} inputArray
 * @param {number} chunkSize
 * @returns {T[][]}
 * @description
 * 配列を指定したサイズで分割する
 */
export const chunkArray = <T>(inputArray: T[], chunkSize: number): T[][] => {
  const results = []

  while (inputArray.length) {
    results.push(inputArray.splice(0, chunkSize))
  }

  return results
}

/**
 * @param {number} start
 * @param {number} end
 * @returns {number[]}
 * @description
 * startからendまでの連番を生成する
 */
export const range = (start: number, end: number) => {
  const results = []

  for (let i = start; i <= end; i++) {
    results.push(i)
  }
  return results
}
