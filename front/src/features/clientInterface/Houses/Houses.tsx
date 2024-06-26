import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store.ts';
import { useEffect } from 'react';
import { deleteHouse, fetchData, fetchDistricts } from '../../../store/House/housesThunk.ts';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import HouseSearchByCategory from './HouseSearchByCategory.tsx';

const Houses = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {houses, districts, fetchLoad, deleteLoad} = useSelector((state: RootState) => state.houses);
  const {user} = useSelector((state: RootState) => state.user);


  useEffect(() => {
    (async () => {
      await dispatch(fetchDistricts());
      await dispatch(fetchData());
    })();

  }, [dispatch]);

  const deleteHouseId = async (id: string) => {
    await dispatch(deleteHouse(id));
    await dispatch(fetchData());
  };
  return (
    <>
      <HouseSearchByCategory/>
      <Box>
        <Box display={'flex'} flexWrap={'wrap'} sx={{gap: '15px',marginTop:4}}>
          {fetchLoad ? (
            <CircularProgress/>
          ) : (
            houses.length === 0 ? 'По вашему запросу ничего не найдено' :
              houses.map(house => ({
                ...house,
                district: districts.find(item => item._id === house.district)?.name,
              })).map((item) => {
                return item.isPublished || user?._id === item.user ? (
                  user?._id === item.user && !item.isPublished ? (
                    <Box key={item._id} position={'relative'}>
                      <Box sx={{position: 'absolute', top: 0, color: 'red'}}>На рассмотрении модератора</Box>
                      <Card sx={{width: 345}}>
                        {item.image ? (
                          <CardMedia
                            sx={{height: 350}}
                            image={`http://localhost:8000/${item.image}`}
                          />
                        ) : (
                          <CardMedia sx={{height: 350}} image={'img'}/>
                        )}
                        <CardContent>
                          <Typography
                          >
                            Район: {item.district}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button component={Link} to={`/house/${item._id}`} size="small">
                            Подробнее
                          </Button>
                          <Button
                            sx={{
                              color: 'red'
                            }}
                            disabled={deleteLoad === item._id}
                            onClick={() => deleteHouseId(item._id)}
                          >
                            {deleteLoad === item._id ? <CircularProgress/> : 'Удалить'}
                          </Button>
                        </CardActions>
                      </Card>
                    </Box>
                  ) : (
                    <Box key={item._id}>
                      <Card sx={{width: 345}}>
                        {item.image ? (
                          <CardMedia
                            sx={{height: 350}}
                            image={`http://localhost:8000/${item.image}`}
                          />
                        ) : (
                          <CardMedia sx={{height: 350}} image={'img'}/>
                        )}
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div">
                            Район: {item.district}
                          </Typography>
                        </CardContent>
                        <CardActions>
                          <Button component={Link} to={`/house/${item._id}`} size="small">
                            Подробнее
                          </Button>
                        </CardActions>
                      </Card>
                    </Box>
                  )
                ) : null;
              })
          )}
        </Box>
      </Box>
    </>
  );
};

export default Houses;