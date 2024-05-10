import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store.ts';
import { useEffect } from 'react';
import { deleteHouse, fetchData } from '../../../store/House/housesThunk.ts';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Link, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

const Houses = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {houses, fetchLoad, deleteLoad} = useSelector((state: RootState) => state.houses);
  const {user} = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  const deleteHouseId = async (id: string) => {
    await dispatch(deleteHouse(id));
    await dispatch(fetchData());
  };
  return (
    <>
      <Box>
        <Box display={'flex'} flexWrap={'wrap'} sx={{gap: '10px'}}>
          {fetchLoad ? (
            <CircularProgress/>
          ) : (
            houses.map((item) => {
              return item.isPublished || user?._id === item.user ? (
                user?._id === item.user && !item.isPublished ? (
                  <Box key={item._id} position={'relative'}>
                    <Box sx={{position: 'absolute', top: 0, color: 'red'}}>Not published</Box>
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
                          {item.area}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button component={Link} to={`/house/${item._id}`} size="small">
                          Learn More
                        </Button>
                        <Button
                          className="btn ms-1 btn-primary "
                          disabled={deleteLoad === item._id}
                          onClick={() => deleteHouseId(item._id)}
                        >
                          {deleteLoad === item._id ? <CircularProgress/> : 'Delete'}
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
                          {item.area}
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