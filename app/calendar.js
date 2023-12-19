/*
 * function to return array of week day indexes for weekend days based on given locale (default is auto-detected)
 * @param {string} locale - locale to use for weekend days (default is auto-detected)
 * @returns {Array} weekendDays
 */
function getWeekendDays(locale = undefined) {
  switch(locale) {
    case "en-US":
    case "en-AU":
    case "en-CA":
    case "en-GB":
      return [0, 6]; // sun, sat
    case "en-IN":
      return [0]; // sun
    default:
      return [5, 6]; // fri, sat
  }
}

function showCalendar(year, orientation) {
  // make sure year is a number (or 0 if not given/invalid)
  year = parseInt(year) || 0;

  // if no year is given, use the current year
  if(!year) year = new Date().getFullYear();

  switch(orientation) {
    case "portrait":
      showCalendarPortrait(year);
      break;
    default: /* landscape */
      showCalendarLandscape(year);
  }
}

// each column is a month
function showCalendarPortrait(year) {
  // Array of month names
  const months = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
  ];

  // determine weekend days based on user locale
  const weekendDays = getWeekendDays();

  // Create a new table element
  const table = document.createElement("table");

  // append caption
  appendCaption(table, year, "portrait");

  // Create the header row
  const headerRow = document.createElement("tr");
  months.forEach((month) => {
    const headerCell = document.createElement("th");
    const monthText = document.createTextNode(month);
    headerCell.appendChild(monthText);
    headerRow.appendChild(headerCell);
  });
  table.appendChild(headerRow);

  // Loop through each day
  for (let day = 1; day <= 31; day++) {
    // Create a new row for each day
    const dayRow = document.createElement("tr");

    // Loop through each month
    months.forEach((month) => {
      // Calculate the number of days in the current month
      const monthIndex = months.indexOf(month);
      const numDays = new Date(year, monthIndex + 1, 0).getDate();

      // Create a new cell for each day
      const dayCell = document.createElement("td");

      // Check if the current day is valid for the current month
      if (day <= numDays) {
        // Create a new line element for the day number, with class .day-number
        const dayNumber = document.createElement("div");
        const dayNumberText = document.createTextNode(day);
        dayNumber.appendChild(dayNumberText);
        dayNumber.classList.add("day-number");
        dayCell.appendChild(dayNumber);

        // Create a new line element for the week day, with class .week-day
        const weekDay = document.createElement("div");
        const weekDayText = document.createTextNode(
          new Date(year, monthIndex, day).toLocaleString("en-US", { weekday: "short" }).toUpperCase().slice(0, 2)
        );
        weekDay.appendChild(weekDayText);
        weekDay.classList.add("week-day");
        dayCell.appendChild(weekDay);

        // if the current day is a weekend (based on user locale), add the weekend class
        if(weekendDays.includes(new Date(year, monthIndex, day).getDay())) {
          dayCell.classList.add("weekend");
        }
      }

      // Append the day cell to the day row
      dayRow.appendChild(dayCell);
    });

    // Append the day row to the table
    table.appendChild(dayRow);
  }

  // Append the table to the #calendar element
  document.getElementById("calendar").appendChild(table);

  // Set page title to the year
  document.title = `${year} Year Planner`
}

// each row is a month
function showCalendarLandscape(year) {
  // Array of month names
  const months = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
  ];

  // determine weekend days based on user locale
  const weekendDays = getWeekendDays();

  // Create a new table element
  const table = document.createElement("table");

  // caption
  appendCaption(table, year, "landscape");

  // week day of first day of the year as 2 letters (e.g. "MO")
  const firstWeekDayOfYear = weekDayOfDate(year, 1, 1);
  const cellWeekDay = [];
  for(let i = 0; i < 7; i++)
    cellWeekDay.push(weekDayOfDate(year, 1, i + 1));

  // Loop through each month, creating a new row for each
  months.forEach((month) => {
    // Create a new row for each month
    const monthRow = document.createElement("tr");

    // Create a new header cell for the month name
    appendElement(monthRow, "th", month);

    // Calculate the number of days in the current month
    const monthIndex = months.indexOf(month);
    const numDays = new Date(year, monthIndex + 1, 0).getDate();

    // first week day of the month
    const firstWeekDayOfMonth = weekDayOfDate(year, monthIndex + 1, 1);
    
    // Create empty cells for the days before the first day of the month
    for(let i = 0; i < cellWeekDay.indexOf(firstWeekDayOfMonth); i++) {
      const emptyCell = appendElement(monthRow, "td", "");
      
      // if monthIndex > 0, add .weekend class to empty cell if corresponding cell in row 0 is weekend
      if(monthIndex > 0) {
        const correspondingCell = table.getElementsByTagName("tr")[0].getElementsByTagName("td")[i];
        if(correspondingCell.classList.contains("weekend")) {
          emptyCell.classList.add("weekend");
        }
      }
    }

    // Loop through each day
    for (let day = 1; day <= numDays; day++) {
      // Create a new cell for each day
      const dayCell = document.createElement("td");

      // Create a new line element for the day number, with class .day-number
      appendElement(dayCell, "div", day).classList.add("day-number");

      // Create a new line element for the week day, with class .week-day
      const weekDayText = new Date(year, monthIndex, day).toLocaleString("en-US", { weekday: "short" }).toUpperCase().slice(0, 2);
      appendElement(dayCell, "div", weekDayText).classList.add("week-day");

      // Create a new empty line element for the event list
      appendElement(dayCell, "div", "").classList.add("event-list");

      // if the current day is a weekend (based on user locale), add the weekend class
      if(weekendDays.includes(new Date(year, monthIndex, day).getDay())) {
        dayCell.classList.add("weekend");
      }

      // Append the day cell to the month row
      monthRow.appendChild(dayCell);
    }

    // Append the month row to the table
    table.appendChild(monthRow);
  });

  // find max number of cells in a month row
  let maxCells = 31; let maxCellWeekDay = 0;
  const monthRows = table.getElementsByTagName("tr");
  for(let i = 0; i < monthRows.length; i++) {
    if(maxCells < monthRows[i].getElementsByTagName("td").length) {
      maxCells = monthRows[i].getElementsByTagName("td").length;
      // week day num of last day of month i
      maxCellWeekDay = new Date(year, i + 1, 0).getDay();
    }
  }

  // add empty cells to month rows with less than max number of cells
  for(let i = 0; i < monthRows.length; i++) {
    const cells = monthRows[i].getElementsByTagName("td");
    let lastWeekDay = new Date(year, i + 1, 0).getDay();

    for(let j = cells.length; j < maxCells; j++) {
      lastWeekDay++;
      const emptyCell = appendElement(monthRows[i], "td", "");
      
      // if the current day is a weekend (based on user locale), add the weekend class
      if(weekendDays.includes(lastWeekDay % 7)) {
        emptyCell.classList.add("weekend");
      }
    }
  }

  // Append the table to the #calendar element
  document.getElementById("calendar").appendChild(table);

  // Set page title to the year
  document.title = `${year} Year Planner`
}

// function to create an element of specified tag name with specified text, and append it to the specified parent element
function appendElement(parent, tagName, text) {
  const element = document.createElement(tagName);
  element.appendChild(document.createTextNode(text));
  parent.appendChild(element);

  return element;
}

function appendCaption(table, year, orientation) {
  const caption = document.createElement("caption");
  const prevYearLink = document.createElement("a");
  prevYearLink.href = `?year=${year - 1}&orientation=${orientation}`;
  prevYearLink.appendChild(document.createTextNode("⏪"));
  caption.appendChild(prevYearLink);
  caption.appendChild(document.createTextNode(" "));
  caption.appendChild(document.createTextNode(year));
  caption.appendChild(document.createTextNode(" "));
  const nextYearLink = document.createElement("a");
  nextYearLink.href = `?year=${year + 1}&orientation=${orientation}`;
  nextYearLink.appendChild(document.createTextNode("⏩"));
  caption.appendChild(nextYearLink);
  caption.appendChild(document.createTextNode(" "));
  const orientationLink = document.createElement("a");
  orientationLink.href = `?year=${year}&orientation=${orientation === "portrait" ? "landscape" : "portrait"}`;
  orientationLink.appendChild(document.createTextNode(orientation === "portrait" ? "🔁" : "🔃"));
  orientationLink.title = orientation === "portrait" ? "Switch to landscape orientation" : "Switch to portrait orientation";
  caption.appendChild(orientationLink);
  caption.classList.add("year");
  table.appendChild(caption);
}

function weekDayOfDate(year, month, day) {
  const monthIndex = month - 1;
  return new Date(year, monthIndex, day).toLocaleString("en-US", { weekday: "short" }).toUpperCase().slice(0, 2);
}