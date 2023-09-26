export interface User {
  profile: Profile;
  _id: string;
  restaurants: string[];
}

export interface Profile {
  username: string;
  name: string;
  lastname: string;
  age: number;
  description: string;
  role: string;
  imgProfile: string;
  email: string;
}
