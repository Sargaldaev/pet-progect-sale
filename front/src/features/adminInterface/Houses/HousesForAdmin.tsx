import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store.ts';
import { useEffect } from 'react';
import { deleteHouse, fetchData, fetchDistricts, publishedHouse } from '../../../store/House/housesThunk.ts';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import HouseSearchByCategory from '../../clientInterface/Houses/HouseSearchByCategory.tsx';
import CircularProgress from '@mui/material/CircularProgress';

const HousesForAdmin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    houses,
    districts,
    fetchLoad,
    deleteLoad,
    publishedHouseLoad
  } = useSelector((state: RootState) => state.houses);


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
  const togglePublishedArtist = async (id: string) => {
    await dispatch(publishedHouse(id));
    await dispatch(fetchData());
  };
  return (
    <>
      <HouseSearchByCategory/>
      <Box>
        <Box display={'flex'} flexWrap={'wrap'} sx={{gap: '10px'}}>
          {fetchLoad ? (
            <CircularProgress/>
          ) : (
            houses.length === 0 ? 'По вашему запросу ничего не найдено' :
              houses.map(house => ({
                ...house,
                district: districts.find(item => item._id === house.district)?.name,
              })).map((item) => (
                <Box key={item._id} position={'relative'}>
                  {!item.isPublished && (
                    <Box sx={{position: 'absolute', top: 0, color: 'red'}}>На рассмотрении модератора</Box>
                  )}
                  <Card sx={{width: 345, height: 450}}>
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
                        disabled={deleteLoad === item._id}
                        onClick={() => deleteHouseId(item._id)}
                      >
                        {deleteLoad === item._id ? <CircularProgress/> : 'Удалить'}
                      </Button>
                      {item.isPublished ? (
                        <>
                          <Button
                            onClick={() => togglePublishedArtist(item._id)}
                            sx={{
                              color: 'red',
                            }}
                          >
                            {publishedHouseLoad === item._id ? <CircularProgress/> : 'Запретить'}
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => togglePublishedArtist(item._id)}
                            sx={{
                              color: 'green',
                            }}
                          >
                            {publishedHouseLoad === item._id ? <CircularProgress/> : 'Одобрить'}
                          </Button>
                        </>
                      )}
                    </CardActions>
                  </Card>
                </Box>
              ))
          )}
        </Box>
      </Box>
    </>
  );

};

export default HousesForAdmin;