export interface IPublicationSearchableFields {
  title: String;
  link: String;
  date: String;
  da: String;
  author: String;
  dr: String;
  category: String;
  tags: String;
  isFeatured: String;
  price: String;
  minPrice: String;
  maxPrice: String;
  genre: String;
  sponsore: String;
  doFollow: String;
  index: String;
  location: String
};
// export interface IPublicationFilterableFields {
//   searchTerm: String;
//   title: String;
//   link: String;
//   date: String;
//   da: String;
//   author: String;
//   dr: String;
//   category: String;
//   tags: String;
//   isFeatured: String;
//   price: String;
//   minPrice: String;
//   maxPrice: String;
//   genre: String;
//   sponsore: String;
//   doFollow: String;
//   index: String;
//   location:String
// };

export interface IPublicationFilterableFields {
  searchTerm?: string;
  genre?: string;
  sponsor?: string;
  doFollow?: string ;
  minPrice?: string;
  maxPrice?: string;
  niche?: string;    
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  [key: string]: any;
}