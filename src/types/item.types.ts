export interface IRequestQueries {
  [key: string]: string | undefined;
  brand?: string;
  condition?: string;
  from?: string;
  sortby?: string;
  to?: string;
  color?: string;
  type?: string;
  category?: string;
  page?: string;
}
export interface IQueriesObject {
  [key: string]: string | number | undefined | {};
  brand?: string;
  condition?: string;
  price?: { $gt?: number; $lt?: number };
  sortby?: string;
  color?: string;
  type?: string;
  category?: string;
  page?: string;
}
