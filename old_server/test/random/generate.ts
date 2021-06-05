/**
 * Generates a random integer in the provided range.
 * @param {number} min - Min possible random number
 * @param {number} max - Max possible number random
 * @return {number}
 */
export function genRandomInt(min: number = 0, max: number = 100): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random string with the provided length.
 * @param {number} length - The length of the random string
 * @return {string}
 */
export function genRandomString(length: number = 10): string {
  let result = '';
  const dictionary = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const dictLength = dictionary.length;

  while (result.length < length) {
    result += dictionary.charAt(Math.floor(Math.random() * dictLength));
  }

  return result;
}

/**
 * Generates a random float in the provided range.
 * @param {number} min - Min possible random number
 * @param {number} max - Max possible number random
 * @param {number} precision - How many digits should be after dot
 * @return {number}
 */
export function genRandomFloat(min: number = 0, max: number = 100, precision: number = 3): number {
  return parseFloat((Math.random() * (max - min + 1) + min).toFixed(precision));
}

/**
 * Generates a random boolean.
 * @return {boolean}
 */
 export function genRandomBoolean(): boolean {
  return genRandomInt(0, 1) == 1 ? true : false;
}

/**
 * Generates a value with random type.
 * @return {any}
 */
export function genRandomType(): any {
  const decision = genRandomInt(1, 4); // 1 - integer, 2 - string, 3 - float, 4 - boolean
  return decision == 1 ? genRandomInt()
    : decision == 2 ? genRandomString()
    : decision == 3 ? genRandomFloat()
    : genRandomBoolean();
}

/**
 * Generates a random array with elements of the provided type.
 * @param generator - The function for generating elements in the array
 * @param {number} length - The length of the array
 * @return {Array<T>}
 */
export function genRandomArray<T>(generator: (...args: any[]) => T, length: number = 3): Array<T> {
  return Array.from({ length }, () => generator());
}
