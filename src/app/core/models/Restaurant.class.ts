export interface Restaurant {
  profile: Profile;
  menu: string[];
  _id: string;
}

export interface Profile {
  username: string;
  name: string;
  address: string;
  addressNum: number;
  city: string;
  description: string;
  logoUrl: string;
  coverImg: string;
  email: string;
  cell: string;
  pIva: string;
  rating: number;
  status: boolean;
}
