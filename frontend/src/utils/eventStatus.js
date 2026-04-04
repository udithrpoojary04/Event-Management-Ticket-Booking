/**
 * Checks if an event's date and time is in the past.
 * @param {Object} event - The event object containing date, time, and optional endDate.
 * @returns {boolean} - True if the event has passed.
 */
export const isEventPast = (event) => {
    if (!event) return false;
    
    // If endDate is provided, use that as the boundary
    const targetDateStr = event.endDate || event.date;
    const targetTimeStr = event.time || '23:59';
    
    const targetDateTime = new Date(`${targetDateStr}T${targetTimeStr}`);
    const now = new Date();
    
    return targetDateTime < now;
};
