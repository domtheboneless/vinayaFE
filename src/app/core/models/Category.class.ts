export interface Category {
  username: string;
  active: boolean;
  name: string;
  restaurantId: string[];
  items: Items[];
  _id: string;
}

export interface Items {
  _id: string;
  name: string;
  username: string;
  desc: string;
  picture: string;
  price: number;
  rate: number;
  inStock: boolean;
}
