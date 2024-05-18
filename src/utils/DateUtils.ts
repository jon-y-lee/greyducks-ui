//
// export function getSundayOfCurrentWeek(date? : Date) {
//     let currentDate = date ? date : new Date(); // Get the current date and time
//     let currentDayOfWeek = currentDate.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
//     let distanceToSunday = currentDayOfWeek; // Since Sunday is 0, this is the distance to go back
//
//     // Create a new date object for the Sunday of the current week
//     let sundayOfCurrentWeek = new Date(currentDate.getTime());
//     sundayOfCurrentWeek.setDate(sundayOfCurrentWeek.getDate() - distanceToSunday);
//
//     // Reset hours, minutes, seconds, and milliseconds to get the start of the day
//     sundayOfCurrentWeek.setHours(0, 0, 0, 0);
//
//     return sundayOfCurrentWeek;
// }

import {startOfWeek} from "date-fns";

export function getSaturdayOfCurrentWeek(date? : Date) {
    let currentDate = date ? date : new Date(); // Get the current date and time
    let currentDayOfWeek = currentDate.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
    let distanceToSunday = currentDayOfWeek; // Since Sunday is 0, calculate the distance back to Sunday

    // Create a new date object for the Sunday of the current week
    let sundayOfCurrentWeek = new Date(currentDate.getTime());
    sundayOfCurrentWeek.setDate(sundayOfCurrentWeek.getDate() - distanceToSunday);

    // Calculate the Saturday of the current week by adding 6 days to the Sunday date
    let saturdayOfCurrentWeek = new Date(sundayOfCurrentWeek.getTime());
    saturdayOfCurrentWeek.setDate(sundayOfCurrentWeek.getDate() + 6);

    // Reset hours, minutes, seconds, and milliseconds to get the end of the day
    // Here, setting to the end of Saturday (23:59:59.999)
    saturdayOfCurrentWeek.setHours(23, 59, 59, 999);

    return saturdayOfCurrentWeek;
}

export function getCurrentWeek(date? : Date) {
    const today = date ? date : new Date();
    const dayOfWeek = today.getDay(); // Sunday - 0, Monday - 1, etc.
    const currentDate = today.getDate();
    const daysSinceSunday = dayOfWeek; // Since Sunday is considered the first day

    // Get the date of the past Sunday
    const sunday = new Date(today);
    sunday.setDate(currentDate - daysSinceSunday);

    // Print the date for each day of the week
    const weekDates: any = {};
    for (let i = 0; i < 7; i++) {
        const day = new Date(sunday);
        day.setDate(sunday.getDate() + i);
        weekDates[i] = {
            id: i,
            month: day.getMonth(),
            date: day.getDate(),
            formattedDate: formatDate(day),
            isoString: day.toISOString(),
            day: day.toLocaleString('en-us',
                {
                    weekday: 'short'
                }),
        };
    }

    console.log(weekDates);
    return weekDates;

}

export function getWeekHeaderInfo() {
    const date = startOfWeek(new Date());
    // Print the date for each day of the week
    const weekDates: any = {};
    for (let i = 0; i < 7; i++) {
        weekDates[i] = {
            day: date.toLocaleString('en-us',
                {
                    weekday: 'short'
                }),
        };
        date.setDate(date.getDate() + 1);
    }
    return weekDates;
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1); // JS months are 0-based
    const day = String(date.getDate());
    return `${month}/${day}`;
}
