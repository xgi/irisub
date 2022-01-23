export const isPositiveInt = (str: string) => {
  return /^\+?\d+$/.test(str);
}