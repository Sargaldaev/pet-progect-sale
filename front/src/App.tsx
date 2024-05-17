import { Route, Routes } from 'react-router-dom';
import { Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import AppToolbar from './components/AppToolbar/AppToolbar.tsx';
import Register from './features/clientInterface/users/RegisterForm/RegisterForm.tsx';
import Login from './features/clientInterface/users/LoginForm/LoginForm.tsx';
import Main from './features/clientInterface/Main/Main.tsx';
import Houses from './features/clientInterface/Houses/Houses.tsx';
import HousesForm from './features/clientInterface/Houses/HousesForm.tsx';
import HouseFullInfo from './features/clientInterface/Houses/HouseFullInfo.tsx';
import HouseEditModal from './features/clientInterface/Houses/HouseEditModal.tsx';
import HousesForAdmin from './features/adminInterface/Houses/HousesForAdmin.tsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.tsx';
import { useSelector } from 'react-redux';
import { RootState } from './app/store.ts';

function App() {
  const {user} = useSelector((state: RootState) => state.user);

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline/>
        <AppToolbar/>
        <Container>
          <Routes>
            <Route path={'/'} element={<Main/>}>
              <Route
                path="/houses"
                element={
                  user && user.role === 'admin' ? (
                    <ProtectedRoute isAllowed={user && user.role === 'admin'}>
                      <HousesForAdmin />
                    </ProtectedRoute>
                  ) : (
                    <Houses />
                  )
                }
              />
            </Route>
            <Route path={'/house/:id'} element={<HouseFullInfo/>}>
              <Route path={'edit'} element={<HouseEditModal/>}/>
            </Route>
            <Route path={'/addHouse'} element={<HousesForm/>}/>
            <Route path={'/register'} element={<Register/>}/>
            <Route path={'/login'} element={<Login/>}/>
            <Route path="*" element={<h1>Not Found</h1>}/>
          </Routes>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default App;

