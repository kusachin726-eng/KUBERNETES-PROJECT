function currentDateTime(dateType) {
    const now = new Date();
    if(dateType === 'date') {
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const day = now.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    if(dateType === 'time') {
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
}

module.exports = currentDateTime;