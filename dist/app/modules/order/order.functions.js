"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eachHourOfInterval = exports.eachMonthOfInterval = exports.eachDayOfInterval = void 0;
const date_fns_1 = require("date-fns");
const eachDayOfInterval = (start, end) => {
    const days = [];
    let current = (0, date_fns_1.startOfDay)(start);
    while (current <= end) {
        days.push(new Date(current));
        current = (0, date_fns_1.addDays)(current, 1);
    }
    return days;
};
exports.eachDayOfInterval = eachDayOfInterval;
const eachMonthOfInterval = (start, end) => {
    const months = [];
    let current = new Date(start.getFullYear(), start.getMonth(), 1);
    const endDate = new Date(end.getFullYear(), end.getMonth(), 1);
    while (current <= endDate) {
        months.push(new Date(current));
        current = (0, date_fns_1.addMonths)(current, 1);
    }
    return months;
};
exports.eachMonthOfInterval = eachMonthOfInterval;
const eachHourOfInterval = (start, end) => {
    const hours = [];
    let current = new Date(start);
    current.setMinutes(0, 0, 0);
    const endHour = new Date(end);
    endHour.setMinutes(0, 0, 0);
    while (current <= endHour) {
        hours.push(new Date(current));
        current = (0, date_fns_1.addHours)(current, 1);
    }
    return hours;
};
exports.eachHourOfInterval = eachHourOfInterval;
