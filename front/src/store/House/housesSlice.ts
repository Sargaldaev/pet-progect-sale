import { Houses } from '../../types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createHouse, deleteHouse, fetchData } from './housesThunk.ts';

export interface HouseState {
  houses: Houses[];
  fetchLoad: boolean;
  createLoad: boolean;
  deleteLoad:string;
}

const initialState: HouseState = {
  houses: [],
  fetchLoad: false,
  createLoad: false,
  deleteLoad:''
};

export const houseSlice = createSlice({
  name: 'house',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state: HouseState) => {
      state.fetchLoad = true;
    });
    builder.addCase(fetchData.fulfilled, (state: HouseState, action: PayloadAction<Houses[]>) => {
      state.fetchLoad = false;
      state.houses = action.payload;
    });
    builder.addCase(fetchData.rejected, (state: HouseState) => {
      state.fetchLoad = false;
    });


    builder.addCase(createHouse.pending, (state: HouseState) => {
      state.createLoad = true;
    });
    builder.addCase(createHouse.fulfilled, (state: HouseState) => {
      state.createLoad = false;
    });
    builder.addCase(createHouse.rejected, (state: HouseState) => {
      state.createLoad = false;
    });


    builder.addCase(deleteHouse.pending, (state: HouseState,action) => {
      state.deleteLoad = action.meta.arg  || '';
    });
    builder.addCase(deleteHouse.fulfilled, (state: HouseState) => {
      state.deleteLoad = '';
    });
    builder.addCase(deleteHouse.rejected, (state: HouseState) => {
      state.deleteLoad = '';
    });

  },
});

export const houseReducer = houseSlice.reducer;
