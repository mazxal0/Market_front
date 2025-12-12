export const formatWithDot = (value: number) =>
  new Intl.NumberFormat('ru-RU')
    .format(value)
    .replace(/\s/g, '.');
