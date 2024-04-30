import { Link as NavLink } from 'react-router-dom';
import { AppBar, styled, Toolbar, Typography } from '@mui/material';
import AnonymousMenu from './AnonymousMenu.tsx';
import { RootState } from '../../app/store.ts';
import { useSelector } from 'react-redux';
import UserMenu from './UserMenu.tsx';

const Link = styled(NavLink)({
  color: 'inherit',
  textDecoration: 'none',
  '&:hover': {
    color: 'inherit',
  },
});

const AppToolbar = () => {
  const { user } = useSelector((state: RootState) => state.user);
  return (
    <>
      <AppBar position="sticky" sx={{ mb: 2 }}>
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/">Sale</Link>
          </Typography>
          {user ? <UserMenu user={user} /> : <AnonymousMenu />}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default AppToolbar;
