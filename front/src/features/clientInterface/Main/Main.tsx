import { CardMedia } from '@mui/material';
import main from '../../../assets/main-pic.jpg';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Main = () => {

  const navigate = useNavigate();

  useEffect(() => {
    navigate('/houses');
  }, [navigate]);
  return (
    <>
      {/*<CardMedia*/}
      {/*  sx={{width: '100%', height: '500px'}}*/}
      {/*  image={main}*/}
      {/*/>*/}
      <Outlet/>
    </>
  );
};

export default Main;