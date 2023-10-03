export interface Category {
  username: string;
  active: boolean;
  name: string;
  restaurantId: string[];
  items: Items[];
}

export interface Items {
  id: string;
  name: string;
  desc: string;
  picture: string;
  price: number;
  rate: number;
  inStock: boolean;
}
