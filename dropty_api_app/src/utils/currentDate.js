function getCurrentDate(type = "date") {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    if (type === "date") {
        // get current India date in format: yyyy-mm-dd
        return `${year}-${month}-${day}`;
    } else {
        // get current India date in format: yyyy-mm-dd hh:mm:ss
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}

module.exports = getCurrentDate;