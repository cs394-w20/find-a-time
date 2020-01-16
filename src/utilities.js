export function stringToDate(str) {
  let year = parseInt(str.substring(0,4));
  let month = parseInt(str.substring(5,7));
  let day = parseInt(str.substring(8,10));
  return new Date(year, month - 1, day);
}

export function dateToString(date) {
  let temp = new Date(date);
  let year = temp.getFullYear();
  let month = temp.getMonth();
  let day = temp.getDate();

  let dayString = day < 10 ? "0".concat(day.toString()) : day.toString();
  let monthString = month < 9 ? "0".concat((month + 1).toString()) : (month + 1).toString();

  return year.toString().concat("-".concat(monthString.concat("-").concat(dayString)));
}
