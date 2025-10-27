import { Publication, WonArticle, WriteArticle } from '@prisma/client';
import { IUser } from '../modules/auth/auth.interface';

export interface IOrder {
  id: string;
  orderId?: string;
  service: string;
  detailsSubmitted?: string | null;
  status?: string;
  publicationId?: string | null;
  userId?: string;
  publication?: Publication | null;
  user?: IUser;
  wonArticle?: WonArticle | null;
  writeArticle?: WriteArticle | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderSearchableFields { 
  'searchTerm'?: string;
  'title'?: string;
  'publication'?: string;
  'sortBy'?: string;
  'sortOrder'?: string;
  'da'?: string;
  'dr'?: string;
  'region'?: string;
  'genre'?: string;
  'doFollow'?: string;
  'indexed'?: string;
  'niche'?: string;
}