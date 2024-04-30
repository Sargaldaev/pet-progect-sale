export interface Register {
  username: string;
  password: string;
  displayName: string;
}

export interface User {
  _id: string;
  role: string;
  displayName: string;
  username: string;
  password: string;
  token: string;
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
