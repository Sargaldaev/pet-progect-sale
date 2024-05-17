import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import { User } from '../../types';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store.ts';
import { logout } from '../../store/user/userThunk';
import { Link } from 'react-router-dom';

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({user}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <Button onClick={handleClick} color="inherit">
        Hello, {user?.displayName}
      </Button>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
        <MenuItem>
          <Link to="/addHouse" style={{color: 'white', textDecoration: 'none'}}>
            Добавить объявление
          </Link>
        </MenuItem>
      </Menu>

    </>
  );
};

export default UserMenu;
