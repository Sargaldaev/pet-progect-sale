import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
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
  // const { user } = useSelector((state: RootState) => state.user);

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
            Back
          </Button>
          <Box display="flex">
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
          </Box>
        </>
      )}
    </>
  );
};

export default HouseFullInfo;