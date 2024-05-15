import { District, HouseFullInfo, Houses } from '../../types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  createHouse,
  deleteHouse, editHouse,
  fetchData,
  fetchDistricts,
  getFullInfo,
  houseSearchByCategory,
} from './housesThunk.ts';

export interface HouseState {
  houses: Houses[];
  housesByCategory: Houses[];
  houseFullInfo: HouseFullInfo | null;
  districts: District[];
  fetchLoad: boolean;
  fetchLoadFullInfo:boolean,
  createLoad: boolean;
  editLoad: boolean;
  searchLoad: boolean;
  deleteLoad: string;
}

const initialState: HouseState = {
  houses: [],
  housesByCategory:[],
  houseFullInfo: null,
  districts:[],
  fetchLoad: false,
  fetchLoadFullInfo:false,
  searchLoad:false,
  createLoad: false,
  editLoad: false,
  deleteLoad: ''
};

export const houseSlice = createSlice({
  name: 'house',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.pending, (state: HouseState) => {
      state.fetchLoad = true;
    });
    builder.addCase(fetchData.fulfilled, (state: HouseState, { payload }) => {
      state.fetchLoad = false;
      state.houses = payload.houses;
    });
    builder.addCase(fetchData.rejected, (state: HouseState) => {
      state.fetchLoad = false;
    });

    builder.addCase(fetchDistricts.fulfilled, (state: HouseState, action: PayloadAction<District[]>) => {
      state.districts = action.payload;
    });


    builder.addCase(getFullInfo.pending, (state: HouseState) => {
      state.fetchLoadFullInfo = true;
    });
    builder.addCase(getFullInfo.fulfilled, (state: HouseState, action: PayloadAction<HouseFullInfo>) => {
      state.fetchLoadFullInfo = false;
      state.houseFullInfo = action.payload || null;
    });
    builder.addCase(getFullInfo.rejected, (state: HouseState) => {
      state.fetchLoadFullInfo = false;
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

    builder.addCase(editHouse.pending, (state: HouseState) => {
      state.editLoad = true;
    });
    builder.addCase(editHouse.fulfilled, (state: HouseState) => {
      state.editLoad = false;
    });
    builder.addCase(editHouse.rejected, (state: HouseState) => {
      state.editLoad = false;
    });

    builder.addCase(houseSearchByCategory.pending, (state: HouseState) => {
      state.searchLoad = true;
    });
    builder.addCase(houseSearchByCategory.fulfilled, (state: HouseState,{payload}) => {
      state.houses = payload.houses
      state.searchLoad = false;
    });
    builder.addCase(houseSearchByCategory.rejected, (state: HouseState) => {
      state.searchLoad = false;
    });


    builder.addCase(deleteHouse.pending, (state: HouseState, action) => {
      state.deleteLoad = action.meta.arg || '';
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