const calendarEl = document.getElementById(`calendar`);
const monthEl = document.getElementById(`month`);

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const STORYBLOK_URL =
  "https://api.storyblok.com/v2/cdn/stories?starts_with=events&token=LASzr9EjrLf7Go4Mamnvrwtt";
const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let events = {};

const loadEvents = async () => {
  console.log(`start`);
  const res = await fetch(STORYBLOK_URL);
  const { stories } = await res.json();
  events = stories.reduce((a, { content: { time }, content }) => {
    a[new Date(new Date(time).toDateString())] = content;
    return a;
  }, {});
  updateCalender(currentMonth, currentYear, events);
};

const drawBlankCalendar = () => {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < 42; i++) {
    const day = document.createElement(`div`);
    day.className = `day`;

    const dayText = document.createElement(`p`);
    dayText.className = `dayText`;
    dayText.textContent = days[i % 7];

    const dayNumber = document.createElement(`p`);
    dayNumber.className = `dayNumber`;

    const eventName = document.createElement(`small`);
    eventName.className = `eventName`;

    day.appendChild(dayText);
    day.appendChild(dayNumber);
    day.appendChild(eventName);

    fragment.appendChild(day);
  }
  calendarEl.appendChild(fragment);
};

const updateCalender = (month, year, events) => {
  const dayElements = document.querySelectorAll(".day");

  const monthName = months[month];
  const monthWithYear = `${year} - ${monthName}`;
  monthEl.textContent = monthWithYear;

  let lastDayOfPrevMonthNum = new Date(year, month, 0).getDay();
  let lastDayOfPrevMonth = new Date(year, month, 0).getDate();

  let nextMonthCounter = 1;
  let firstDayOfCurrentMonth = new Date(year, month, 1).getDay();
  const lastDayOfCurrentMonth = new Date(year, month + 1, 0).getDate();
  firstDayOfCurrentMonth === 0 && (firstDayOfCurrentMonth = 7);
  for (let i = 0; i < dayElements.length; i++) {
    const day = dayElements[i];
    const dayNumber = day.querySelector(".dayNumber");
    const eventName = day.querySelector(".eventName");
    const currentDay = i - firstDayOfCurrentMonth + 1;
    const thisDate = new Date(year, month, currentDay);
    eventName.textContent = events[thisDate] ? events[thisDate].title : "";

    if (firstDayOfCurrentMonth <= i && currentDay <= lastDayOfCurrentMonth) {
      if (currentDay < 10) dayNumber.textContent = `0${currentDay}`;
      else dayNumber.textContent = currentDay;
      dayNumber.classList.remove("notCurrent");
    } else if (currentDay <= lastDayOfCurrentMonth) {
      dayNumber.textContent = lastDayOfPrevMonth + i - lastDayOfPrevMonthNum;
      dayNumber.classList.add("notCurrent");
    } else {
      if (nextMonthCounter < 10)
        dayNumber.textContent = `0${nextMonthCounter++}`;
      else dayNumber.textContent = nextMonthCounter++;
      dayNumber.classList.add("notCurrent");
    }
  }
};

const previousMonth = () => {
  if (currentMonth === 0) (currentMonth = 12), --currentYear;
  updateCalender(--currentMonth, currentYear, events);
};
const nextMonth = () => {
  if (currentMonth === 11) (currentMonth = -1), ++currentYear;
  updateCalender(++currentMonth, currentYear, events);
};
const load = async () => {
  drawBlankCalendar();
  updateCalender(currentMonth, currentYear, events);
  await loadEvents();
};
load();
