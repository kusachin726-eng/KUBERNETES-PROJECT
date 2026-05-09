function formatDateTime(isoDateTime, dateType = "datetime") {
    if (!isoDateTime) return null;
    
    // Check if isoDateTime is a time string like "HH:mm:ss"
    if (typeof isoDateTime === 'string' && /^\d{2}:\d{2}(:\d{2})?$/.test(isoDateTime)) {
        isoDateTime = `1970-01-01T${isoDateTime}`;
    }

    let options = {};
    switch (dateType) {
        case "date":
            options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            };
            break;
        case "datetime":
            options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };
            break;
        case "time":
            options = {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            };
            break;
        
    }
    const date = new Date(isoDateTime);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleString(undefined, options).toUpperCase();
}

module.exports = formatDateTime;

// function convertTo12HourFormat(time24) {
//     // Create a Date object with a dummy date and our time
//     const [hours, minutes] = time24.split(':');
//     const date = new Date(2023, 0, 1, hours, minutes);

//     // Use toLocaleTimeString to get the time in 12-hour format
//     return date.toLocaleTimeString('en-US', {
//         hour: 'numeric',
//         minute: '2-digit',
//         hour12: true
//     }).replace(/\s/, ' '); // Replace possible non-breaking space with regular space
// }

// module.exports = convertTo12HourFormat;

// function formatCustomDate(dateString) {
//     const date = new Date(dateString);
//     const day = date.getDate();
//     const month = date.toLocaleString('en-US', { month: 'short' });
//     const year = date.getFullYear();
//     return `${day} ${month} ${year}`;
// }

// module.exports = formatCustomDate;
