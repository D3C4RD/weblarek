export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
} 

type TPayment = "сard" | "cash" | "";

export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
} 

// Для API
export interface IOrder extends IBuyer {
  total: number,
  items: string[]
}

export interface IGet  {
  total: number,
  items: IProduct[]
}

export interface IPost {
  id: string,
  total: number
}

