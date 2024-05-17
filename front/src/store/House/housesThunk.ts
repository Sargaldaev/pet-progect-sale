import { createAsyncThunk } from '@reduxjs/toolkit';
import { District, HouseCreate, HouseFullInfo, HouseResponse, SearchByCategory } from '../../types';
import axiosApi from '../../axiosApi.ts';
import { RootState } from '../../app/store.ts';

export const fetchData = createAsyncThunk<HouseResponse>(
  'house/fetchData',
  async () => {
    try {
      const {data} = await axiosApi.get<HouseResponse>('houses');
      return data;
    } catch (e) {
      console.log('Caught on try - FETCH ALL', e);
      throw e;
    }
  },
);

export const getFullInfo = createAsyncThunk<HouseFullInfo,string>(
  'house/getFullInfo',
  async (id) => {
    try {
      const { data } = await axiosApi.get<HouseFullInfo>(`houses/${id}`);
      return data;
    } catch (e) {
      console.log('Caught on try', e);
      throw e;
    }
  },
);

export const fetchDistricts = createAsyncThunk<District[]>(
  'house/fetchDistricts',
  async () => {
    try {
      const { data } = await axiosApi.get<District[]>('districts');
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
    formData.append('district', house.district);
    formData.append('numberOfRooms', house.numberOfRooms);
    formData.append('price', house.price);
    formData.append('description', house.description);

    if (house.image) {
      formData.append('image', house.image);
    }
    await axiosApi.post('/houses', formData);
  },
);

export const editHouse = createAsyncThunk<void, { id: string, house: HouseCreate }, { state: RootState }>(
  'house/editHouse',
  async ({ id, house }, { getState }) => {
    try {
      const prevState = getState().houses.houseFullInfo;
      if (!prevState) return;
      const formData = new FormData();

      const keys = Object.keys(house) as Array<keyof HouseCreate>;

      if (typeof house.image === 'string') {
        keys.splice(keys.indexOf('image'), 1);
      }
      if (house.image instanceof File) {
        formData.append('image', house.image);
        keys.splice(keys.indexOf('image'), 1);
      }

      keys.forEach((key) => {
        const value = house[key];
        const prevValue = prevState[key];

        if (value === null) return;
        if (prevValue === value) return;
        if (typeof value === 'string' && !value.length) return;

        formData.append(key, value);
      });

      await axiosApi.patch('houses/' + id, formData);
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
);


export const houseSearchByCategory = createAsyncThunk<HouseResponse, SearchByCategory>(
  'house/houseSearchByCategory',
  async (house) => {

    const {data} = await axiosApi.post('/houses/searchByCategory', house);
    return data;
  },
);

export const deleteHouse = createAsyncThunk<void, string>(
  'house/deleteHouse',
  async (_id) => {
    try {
      return await axiosApi.delete(`houses/${_id}`);
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
);

export const publishedHouse = createAsyncThunk<void, string>('house/published', async (_id) => {
  await axiosApi.patch(`/houses/${_id}/togglePublished`);
});