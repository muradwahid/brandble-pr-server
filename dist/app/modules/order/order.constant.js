"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nestedSortableFields = exports.directSortableFields = exports.dayNames = exports.adminOrderFilterableFields = exports.orderFilterableFields = exports.singleUserOrderSearchableFields = exports.orderSearchableFields = void 0;
exports.orderSearchableFields = ['orderId', 'title', 'sortBy', 'sortOrder', 'da', 'dr', 'location', 'genre', 'doFollow', 'index'];
exports.singleUserOrderSearchableFields = [
    'orderId',
    'status',
    'orderType',
    'detailsSubmitted',
];
exports.orderFilterableFields = [
    'searchTerm',
    'title',
    // 'sortBy',
    // 'sortOrder',
    'da',
    'dr',
    'location',
    'doFollow',
    'index',
    'status',
    'publication',
    'sponsor',
    'amount'
];
exports.adminOrderFilterableFields = [
    'status',
    'orderType',
    'title',
    'createdAt'
];
exports.dayNames = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
exports.directSortableFields = ['amount'];
exports.nestedSortableFields = [
    'genre',
    'sponsor',
    'title',
    'da',
    'dr',
    'region',
    'location',
    'price',
    'doFollow'
];
