/* eslint-disable @typescript-eslint/no-explicit-any */
export const asyncForEach = async (array: any[], calback: any) => {
  if (!Array.isArray(array)) {
    throw new Error("Expected an array");
  }
  for (let index = 0; index < array.length; index++) {
    calback(array[index],index,array)
  }
}