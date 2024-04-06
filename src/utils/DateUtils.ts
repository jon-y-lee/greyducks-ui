
export function getSundayOfCurrentWeek() {
    let currentDate = new Date(); // Get the current date and time
    let currentDayOfWeek = currentDate.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
    let distanceToSunday = currentDayOfWeek; // Since Sunday is 0, this is the distance to go back

    // Create a new date object for the Sunday of the current week
    let sundayOfCurrentWeek = new Date(currentDate.getTime());
    sundayOfCurrentWeek.setDate(sundayOfCurrentWeek.getDate() - distanceToSunday);

    // Reset hours, minutes, seconds, and milliseconds to get the start of the day
    sundayOfCurrentWeek.setHours(0, 0, 0, 0);

    return sundayOfCurrentWeek;
}

export function getSaturdayOfCurrentWeek() {
    let currentDate = new Date(); // Get the current date and time
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