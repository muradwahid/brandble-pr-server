"use strict";
// export const publicationSearchableFields = ['searchTerm','title', 'price','da','dr','createdAt', 'genre','sponsor','doFollow','index'];
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicationFilterableFieldsController = exports.publicationSortableFields = exports.publicationFilterableFields = exports.publicationSearchableFields = void 0;
// export const publicationFilterableFields = ['title','price', 'da', 'dr','genre','sponsor','doFollow','index'];
exports.publicationSearchableFields = [
    'title',
    'genre',
    'sponsor',
    'doFollow',
    'index',
    'da',
    'dr',
    'scope'
    // 'region',
    // 'scope',
    // 'state',
    // 'city'
];
exports.publicationFilterableFields = [
    'genre',
    'sponsor',
    'doFollow',
    'minPrice',
    'minPrice',
    'maxPrice',
    // 'region'
];
// Define what fields can be sorted (used with ?sortBy=price&sortOrder=desc)
exports.publicationSortableFields = [
    'title',
    'price',
    'da',
    'dr',
    'createdAt',
    'genre',
    'doFollow',
    'index',
    // 'region'
];
exports.publicationFilterableFieldsController = ['searchTerm',
    'genre',
    'sponsor',
    'doFollow',
    'minPrice',
    'maxPrice',
    'sortBy',
    'sortOrder',
    'scope',
    'countries',
    'states',
    'cities',
    'title',
    'da',
    'dr',
    // 'region',
    'index',
    'niche'
];
