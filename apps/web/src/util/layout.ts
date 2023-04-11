export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(date: Date) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const ampm = date.getHours() >= 12 ? 'pm' : 'am';
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const dateString = `${
    months[date.getMonth()]
  } ${date.getDate()}, ${date.getFullYear()} ${hours}:${minutes} ${ampm}`;
  return dateString;
}
