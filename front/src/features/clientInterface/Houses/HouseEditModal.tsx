import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, IconButton, MenuItem, Select, TextField } from '@mui/material';
import InputFile from '../../../components/InputFile/InputFile.tsx';
import { HouseCreate } from '../../../types';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store.ts';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from 'react-router-dom';
import { editHouse, getFullInfo } from '../../../store/House/housesThunk.ts';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const initialState: HouseCreate = {
  district: '',
  description: '',
  numberOfRooms: '',
  price: '',
  image: '',
};

const HouseEditModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { houseFullInfo, districts, editLoad } = useSelector((state: RootState) => state.houses);

  const [state, setState] = useState<HouseCreate>(initialState);

  useEffect(() => {
    if (houseFullInfo) {
      const image = houseFullInfo.image ? houseFullInfo.image.slice(houseFullInfo.image.lastIndexOf('/') + 1) : '';

      setState({
        district: houseFullInfo.district._id,
        price: houseFullInfo.price,
        numberOfRooms: houseFullInfo.numberOfRooms,
        description: houseFullInfo.description,
        image,
      });
    }
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    setState((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!houseFullInfo) return;

    try {
      await dispatch(editHouse({ id: houseFullInfo._id, house: state })).unwrap();
      await dispatch(getFullInfo(houseFullInfo._id)).unwrap();
      navigate('/house/' + houseFullInfo._id);
    } catch (e) {
      // nothing
    }
  };
  return houseFullInfo && (
    <ThemeProvider theme={darkTheme}>
      <Box position="fixed"
           top="50%"
           left="50%"
           sx={{
             transform: 'translate(-50%, -50%)',
             background: '#222',
             padding: '50px 30px 30px',
             borderRadius: '10px',
           }}
      >
        <IconButton
          component={Link}
          to={'/house/' + houseFullInfo._id}
          sx={{
            position: 'absolute',
            right: 5,
            top: 5,
          }}
        >
          <CloseIcon/>
        </IconButton>
        <Box component="form" onSubmit={submitFormHandler}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Select
                name="district"
                value={state.district}
                onChange={(e) => setState(prevState => ({ ...prevState, district: e.target.value }))}
                fullWidth
              >
                {districts.map(district => (
                  <MenuItem key={district._id} value={district._id}>{district.name}</MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Описание"
                name="description"
                type="text"
                autoComplete="new-description"
                value={state.description}
                onChange={onChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Количество комнат"
                name="numberOfRooms"
                type="text"
                autoComplete="new-numberOfRooms"
                value={state.numberOfRooms}
                onChange={onChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Цена"
                name="price"
                type="text"
                autoComplete="new-price"
                value={state.price}
                onChange={onChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <InputFile name={'image'} image={state.image} onChange={onChange}/>
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            color={'success'}
            variant="contained"
            sx={{ mt: 2 }}
            disabled={editLoad}
          >
            Сохранить
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default HouseEditModal;