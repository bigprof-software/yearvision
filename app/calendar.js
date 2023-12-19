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
      return [0, 6];
    case "en-GB":
      return [5, 6];
    case "en-IN":
      return [0];
    default: /* fri, sat */
      return [5, 6];
  }
}


function showCalendar(year) {
  // Array of month names
  const months = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
  ];

  // determine weekend days based on user locale
  const weekendDays = getWeekendDays();

  // Create a new table element
  const table = document.createElement("table");

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

  // Append the year to the #calendar element in a div element with class .year
  const yearDiv = document.createElement("div");
  const yearText = document.createTextNode(year);
  yearDiv.appendChild(yearText);
  yearDiv.classList.add("year");
  document.getElementById("calendar").appendChild(yearDiv);

  // Set page title to the year
  document.title = `${year} Year Planner`
}