export function getDateTime() {
  const now = new Date();

  const days = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  return {
    day: days[now.getDay()],
    time: now.toLocaleTimeString("ar-EG"),
    date: now.toLocaleDateString("ar-EG"),
  };
}
