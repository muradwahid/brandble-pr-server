// export const publicationSearchableFields = ['searchTerm','title', 'price','da','dr','createdAt', 'genre','sponsor','doFollow','index'];

// export const publicationFilterableFields = ['title','price', 'da', 'dr','genre','sponsor','doFollow','index'];
export const publicationSearchableFields = [
  'title',
  'genre',
  'sponsor', 
  'doFollow',
  'index',
  'da',
  'dr',
  'region'
];

export const publicationFilterableFields = [
  'genre',
  'sponsor',
  'doFollow',
  'minPrice',
  'minPrice',
  'maxPrice',
  'region'
];

// Define what fields can be sorted (used with ?sortBy=price&sortOrder=desc)
export const publicationSortableFields = [
  'title',
  'price',
  'da',
  'dr',
  'createdAt',
  'genre',
  'doFollow',
  'index',
  'region'
];

export const publicationFilterableFieldsController = ['searchTerm',
  'genre',
  'sponsor',
  'doFollow',
  'minPrice',
  'maxPrice',
  'sortBy',
  'sortOrder',
  'region',
  'index',
  'niche'
]