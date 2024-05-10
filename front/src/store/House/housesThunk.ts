import { createAsyncThunk } from '@reduxjs/toolkit';
import { HouseCreate, Houses } from '../../types';
import axiosApi from '../../axiosApi.ts';

export const fetchData = createAsyncThunk<Houses[]>(
  'house/fetchData',
  async () => {
    try {
      const {data} = await axiosApi.get<Houses[]>('houses');
      return data;
    } catch (e) {
      console.log('Caught on try - FETCH ALL', e);
      throw e;
    }
  },
);

export const createHouse = createAsyncThunk<void, HouseCreate>( //Todo формДату через цикл сделать
  'house/createHouse',
  async (house) => {
    const formData = new FormData();
    formData.append('area', house.area);
    formData.append('numberOfRooms', house.numberOfRooms);
    formData.append('price', house.price);
    formData.append('description', house.description);

    if (house.image) {
      formData.append('image', house.image);
    }
    await axiosApi.post('/houses', formData);
  },
);

export const deleteHouse = createAsyncThunk<void, string>(
  'house/deleteHouse',
  async (id) => {
    try {
      return await axiosApi.delete(`houses/${id}`);
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
);