import { Box, Button, Grid, MenuItem, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store.ts';
import { useEffect, useState } from 'react';
import { fetchDistricts, houseSearchByCategory } from '../../../store/House/housesThunk.ts';
import { SearchByCategory } from '../../../types';

const HouseSearchByCategory = () => {

  const dispatch = useDispatch<AppDispatch>();
  const {districts} = useSelector((state: RootState) => state.houses);
  const [state, setState] = useState<SearchByCategory>({
    district: '',
    priceFrom: '',
    priceTo: '',
    numberOfRooms: '',
  });

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setState((prevState) => {
      return {...prevState, [name]: value};
    });
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await dispatch(houseSearchByCategory(state));

      setState({
        district: '',
        priceFrom: '',
        priceTo: '',
        numberOfRooms: ''
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    dispatch(fetchDistricts());
  }, [dispatch]);
  return (
    <Box
      component={'form'}
      onSubmit={submitFormHandler}
    >
      <Grid container spacing={2} alignItems="start">
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            name="district"
            label="Район"
            type="text"
            value={state.district}
            autoComplete="new-district"
            onChange={inputChangeHandler}
          >
            {districts.map((item) => (
              <MenuItem key={item._id} value={item._id}>
                <b style={{marginRight: '10px'}}>{item.name}</b>
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            name="numberOfRooms"
            label="Количество комнат"
            type="text"
            value={state.numberOfRooms}
            autoComplete="new-numberOfRooms"
            onChange={inputChangeHandler}
          />
        </Grid>

        <Box display={'flex'}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="priceFrom"
              label="Цена от"
              type="text"
              value={state.priceFrom}
              autoComplete="new-priceFrom"
              onChange={inputChangeHandler}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="priceTo"
              label="Цена до"
              type="text"
              value={state.priceTo}
              autoComplete="new-priceTo"
              onChange={inputChangeHandler}
            />
          </Grid>
        </Box>
        <Button
          type={'submit'}
        >
          Поиск
        </Button>
      </Grid>

    </Box>
  );
};

export default HouseSearchByCategory;