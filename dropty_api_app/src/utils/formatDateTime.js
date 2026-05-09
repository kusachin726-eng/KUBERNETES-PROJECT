class FormatDateTime {
    formatTime(timeString) {
        if (!timeString) return null;
        // Check if it's already in 12-hour format (roughly)
        if (timeString.match(/AM|PM/i)) return timeString;

        const [hours, minutes] = timeString.split(':');
        const date = new Date(2023, 0, 1, hours, minutes);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).replace(/\s/, ' ').toUpperCase();
    }

    formatTimeSlot(timeSlot) {
        if (!timeSlot) return null;
        const [start, end] = timeSlot.split('-');
        return `${this.formatTime(start.trim())} - ${this.formatTime(end.trim())}`;
    }

    formatISODateTime(isoDateTime) {
        if (!isoDateTime) return null;
        const date = new Date(isoDateTime);
        if (isNaN(date.getTime())) return "Invalid Date";
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).replace(/\s/, ' ').toUpperCase();
    }

    formatISODate(isoDateTime) {
        if (!isoDateTime) return null;
        const date = new Date(isoDateTime);
        if (isNaN(date.getTime())) return "Invalid Date";
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).replace(/\s/, ' ');
    }

    formatISOTime(isoDateTime) {
        if (!isoDateTime) return null;
        const date = new Date(isoDateTime);
        if (isNaN(date.getTime())) return "Invalid Date";
        return date.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).replace(/\s/, ' ').toUpperCase();
    }


    formatDate(dateOnly){
        if (!dateOnly) return null;
        const date = new Date(dateOnly);
        if (isNaN(date.getTime())) return "Invalid Date";
        return date.toLocaleString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).replace(/\s/, ' ');
    }

}

module.exports = new FormatDateTime();