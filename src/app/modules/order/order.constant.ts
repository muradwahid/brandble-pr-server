export const orderSearchableFields = ['orderId', 'title', 'sortBy', 'sortOrder', 'da', 'dr', 'location', 'genre', 'doFollow', 'index'];
export const singleUserOrderSearchableFields = [
  'orderId',
  'status',
  'orderType',
  'detailsSubmitted',
]
export const orderFilterableFields = [
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
export const adminOrderFilterableFields = [
  'status',
  'orderType',
  'title',
  'createdAt'
];

export const dayNames = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export const directSortableFields = ['amount']
export const nestedSortableFields = [
  'genre',
  'sponsor',
  'title',
  'da',
  'dr',
  'region',
  'location',
  'price',
  'doFollow'
]