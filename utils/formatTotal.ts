export function FormatTotal(val: number): string {
  // Если число меньше 1000, возвращаем как есть
  if (val < 1000) {
    return val.toString();
  }

  // Тысячи (1,000 - 999,999)
  if (val < 1000000) {
    const thousands = val / 1000;
    // Проверяем, целое ли число тысяч
    if (thousands % 1 === 0) {
      return `${thousands.toFixed(0)}т.р.`;
    } else {
      // Округляем до одного знака после запятой
      const formatted = thousands.toFixed(1);
      // Убираем .0 если есть
      return formatted.endsWith('.0') ?
        `${formatted.slice(0, -2)}т.р.` :
        `${formatted}т.р.`;
    }
  }

  // Миллионы (1,000,000 - 999,999,999)
  if (val < 1000000000) {
    const millions = val / 1000000;
    if (millions % 1 === 0) {
      return `${millions.toFixed(0)}млн.р.`;
    } else {
      const formatted = millions.toFixed(1);
      return formatted.endsWith('.0') ?
        `${formatted.slice(0, -2)}млн.р.` :
        `${formatted}млн.р.`;
    }
  }

  // Миллиарды (1,000,000,000+)
  const billions = val / 1000000000;
  if (billions % 1 === 0) {
    return `${billions.toFixed(0)}млрд.р.`;
  } else {
    const formatted = billions.toFixed(1);
    return formatted.endsWith('.0') ?
      `${formatted.slice(0, -2)}млрд.р.` :
      `${formatted}млрд.р.`;
  }
}
