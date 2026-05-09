function addMinutesToTime(time, minutesToAdd) {
    // Convert time to Date object
    const [hours, minutes, seconds] = time.split(':').map(Number);
    let date = new Date(0); // 0 = 01/01/1970
    date.setUTCHours(hours);
    date.setUTCMinutes(minutes);
    date.setUTCSeconds(seconds);

    // Add minutes
    date.setUTCMinutes(date.getUTCMinutes() + minutesToAdd);

    // Format the result
    const resultHours = date.getUTCHours().toString().padStart(2, '0');
    const resultMinutes = date.getUTCMinutes().toString().padStart(2, '0');
    const resultSeconds = date.getUTCSeconds().toString().padStart(2, '0');

    return `${resultHours}:${resultMinutes}:${resultSeconds}`;
}

module.exports = addMinutesToTime;