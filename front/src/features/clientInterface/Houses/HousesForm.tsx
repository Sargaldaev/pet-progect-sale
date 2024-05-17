import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Container, Grid, MenuItem, TextField, } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useDispatch, useSelector } from 'react-redux';
import { HouseCreate } from '../../../types';
import InputFile from '../../../components/InputFile/InputFile.tsx';
import { createHouse, fetchDistricts } from '../../../store/House/housesThunk.ts';
import { AppDispatch, RootState } from '../../../app/store.ts';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const HousesForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {user} = useSelector((state: RootState) => state.user);
  const {createLoad, districts} = useSelector((state: RootState) => state.houses);


  const navigate = useNavigate();
  const [state, setState] = useState<HouseCreate>({
    district: '',
    price: '',
    numberOfRooms: '',
    description: '',
    image: null,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    dispatch(fetchDistricts());
  }, [navigate]);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value, files} = e.target;
    if (name === 'price' && isNaN(Number(value))) return;
    if (name === 'numberOfRooms' && isNaN(Number(value))) return;

    setState((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await dispatch(createHouse(state)).unwrap();
      navigate('/');
    } catch (e) {
      // nothing
    }
  };


  return (
    <ThemeProvider theme={darkTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline/>
        <Button component={Link} to={`/houses`} size="small">
          Назад
        </Button>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >


          <Box component="form" onSubmit={submitFormHandler} sx={{mt: 3}}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  required
                  name="district"
                  label="Район"
                  value={state.district}
                  onChange={(e) => setState(prevState => ({...prevState, district: e.target.value}))}
                  fullWidth
                >
                  <MenuItem value="" disabled>
                    Выберите район
                  </MenuItem>
                  {districts.map(district => (
                    <MenuItem key={district._id} value={district._id}>{district.name}</MenuItem>
                  ))}
                </TextField>
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
                  fullWidth={true}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <InputFile name={'image'} image={state.image} onChange={onChange}/>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Цена"
                  name="price"
                  type="text"
                  autoComplete="new-price"
                  value={state.price}
                  onChange={onChange}
                  fullWidth={true}
                  required
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              color={'success'}
              variant="contained"
              sx={{mt: 3, mb: 2}}
              disabled={!!createLoad}
            >
              Добавить
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default HousesForm;