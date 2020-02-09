import {DATE_FORMAT, HOURS, MINUTES} from "./constants"
import moment from "moment";

export function addThirtyMin(currDay, currTime, seconds) {
  if (seconds == ":00") {
    const endTime = currDay.concat("T", convertTime(currTime).concat(":30"))
    return endTime
  } else {
    const endTime = currDay.concat("T", convertTime(currTime + 1).concat(":00"))
    return endTime
  }
}

export function maddThirtyMin(currDay, mtime) {
  if (mtime.format('HH:mm') == "23:30"){
    const endTime = currDay.concat("T", "24:00");
    return endTime;
  }
  mtime.add(30, 'm');
  const endTime = currDay.concat("T",mtime.format('HH:mm'));
  return endTime
}

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

export function convertTime(time) {
  if (time < 10) {
    return "0" + time.toString()
  } else {
    return time.toString()
  }
}

//this creates every possible hour/minute combination
export function createTimes() {
  return HOURS.map(function(item) {
    return MINUTES.map(function(item2) {
      return `${item}:${item2}`
    })
  }).flat()
}

export function createDayArr(start, end) {
  let startDate = stringToDate(start)
  let endDate = stringToDate(end)

  let newDate = startDate
  let dateArr = []
  while (newDate.getDate() !== endDate.getDate()) {
    dateArr.push(newDate)
    let tempDate = new Date(newDate)
    tempDate.setDate(newDate.getDate() + 1)
    newDate = tempDate
  }

  dateArr.push(endDate)
  return dateArr
}
