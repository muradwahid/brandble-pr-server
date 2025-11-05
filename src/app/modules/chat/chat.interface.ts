export interface ITokenUser {
  id: string;
  role: string | 'client' | 'admin' | 'super_admin';
}