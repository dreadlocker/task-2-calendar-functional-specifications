export function fillLocalStorage(monthAndYear, totalDaysInMonth) {
  const monthObj = {};
  for (let i = 1; i <= totalDaysInMonth; i++) {
    monthObj[i] = {
      title: "",
      participants: "",
      description: "",
      dayMonthYear: `${i} ${monthAndYear}`,
    };
  }
  localStorage.setItem(monthAndYear, JSON.stringify(monthObj));
}