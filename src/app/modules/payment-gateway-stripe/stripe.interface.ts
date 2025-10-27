
import { Request } from 'express';

export type CustomRequest<T = any> = Request & {
  user?: T | null;
};

export interface IProcessPaymentData { 
  paymentMethodId: string;
  amount: number;
  currency?: string;
}