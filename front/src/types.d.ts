export interface User {
  _id: string;
  role: string;
  displayName: string;
  username: string;
  password: string;
  token: string;
}

export interface District {
  _id: string;
  name: string;
}

export interface Houses {
  _id: string;
  user: string,
  district: string
  price: string,
  numberOfRooms: string,
  description: string,
  image: string | null,
  isPublished: boolean
}

export interface HouseFullInfo {
  _id: string;
  user: string,
  district: District,
  price: string,
  numberOfRooms: string,
  description: string,
  image: string | null,
  isPublished: boolean
}

export interface SearchByCategory {
  district: string,
  priceFrom:string,
  priceTo:string
  numberOfRooms:string
}

export interface HouseResponse {
  message: string;
  houses: Houses[];
}

export interface HouseCreate {
  district: string,
  price: string,
  numberOfRooms: string,
  description: string,
  image: File | string | null,
}

export interface Register {
  username: string;
  password: string;
  displayName: string;
  phoneNumber: string;
}


export interface Login {
  username: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
  message: string;
  name: string;
  _message: string;
}

export interface GlobalError {
  error: string;
}