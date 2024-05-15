import { useEffect } from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store.ts';
import { fetchDistricts, getFullInfo } from '../../../store/House/housesThunk.ts';
import CircularProgress from '@mui/material/CircularProgress';
import { Box, Button, CardMedia, Typography } from '@mui/material';
import { apiUrl } from '../../../constans.ts';

const HouseFullInfo = () => {
  const {id} = useParams() as { id: string };
  const dispatch = useDispatch<AppDispatch>();
  const {houseFullInfo, fetchLoadFullInfo} = useSelector((state: RootState) => state.houses);
  const {user} = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (id) {
      dispatch(getFullInfo(id));
    }

    dispatch(fetchDistricts());
  }, [dispatch, id]);
  return houseFullInfo && (
    <>
      {fetchLoadFullInfo ? (
        <CircularProgress/>
      ) : (
        <>
          <Button component={Link} to={`/houses`} size="small">
            Назад
          </Button>
          <Box display="flex" position="relative">
            <Box>
              <CardMedia
                sx={{height: 570, width: 470}}
                image={apiUrl + '/' + houseFullInfo.image}
              />
            </Box>

            <Box marginLeft={3}>
              <Typography sx={{fontWeight: 700, fontSize: 17}} gutterBottom variant="h5">
                Район: {houseFullInfo.district.name}
              </Typography>

              <Typography sx={{fontWeight: 700, fontSize: 17}} gutterBottom variant="h5">
                Количество комнат: {houseFullInfo.numberOfRooms}
              </Typography>

              <Typography sx={{fontWeight: 700, fontSize: 17}} gutterBottom variant="h5">
                Цена: {houseFullInfo.price}
              </Typography>

              <Typography sx={{fontWeight: 700, fontSize: 17}} gutterBottom variant="h5">
                Описание: {houseFullInfo.description}
              </Typography>
            </Box>

            {
              user?._id === houseFullInfo.user ? (

                <Button component={Link} to="edit" size="small"
                        variant="contained" color="success"
                        sx={{height: 'min-content', position: 'absolute', right: 0}}
                >
                  Изменить
                </Button>
              ) : null
            }
          </Box>

          <Outlet/>
        </>
      )}
    </>
  );
};

export default HouseFullInfo;