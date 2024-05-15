export interface UserFields {
  username: string;
  displayName: string;
  phoneNumber: string;
  googleID?: string;
  password: string;
  token: string;
  role: string;
}

export interface SearchByCategory {
  district: string;
  priceFrom: string;
  priceTo: string;
  numberOfRooms: number;
}

export interface HouseEdit {
  district?: string;
  price?: string;
  numberOfRooms?: string;
  description?: string;
  image?: string;
}
