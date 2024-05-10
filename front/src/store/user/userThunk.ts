import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { isAxiosError } from 'axios';
import { GlobalError, Login, Register, RegisterResponse, User, ValidationError } from '../../types';
import { clearUser } from './userSlice.ts';

export const register = createAsyncThunk<User, Register, { rejectValue: ValidationError }>(
  'user/register',
  async (user, { rejectWithValue }) => {
    try {

      const { data } = await axiosApi.post<User>('/users', user);
      return data;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 422) {
        return rejectWithValue(e.response.data);
      }
      throw e;
    }
  },
);

export const login = createAsyncThunk<User, Login, { rejectValue: GlobalError }>(
  'user/postDataLogin',
  async (userLogin, { rejectWithValue }) => {
    try {
      const { data } = await axiosApi.post<User>('/users/sessions', userLogin);

      return data;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  },
);

export const googleLogin = createAsyncThunk<User, string, { rejectValue: GlobalError }>(
  'users/googleLogin',
  async (credential, { rejectWithValue }) => {
    try {
      const { data } = await axiosApi.post<RegisterResponse>('/users/google', { credential });
      return data.user;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  },
);


export const logout = createAsyncThunk('user/logout', async (_, { dispatch }) => {
  await axiosApi.delete('/users/sessions');
  dispatch(clearUser());
});
