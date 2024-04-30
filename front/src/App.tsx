import {Route, Routes} from 'react-router-dom';
import {Container, createTheme, CssBaseline, ThemeProvider} from '@mui/material';
import AppToolbar from './components/AppToolbar/AppToolbar.tsx';
import Register from './features/clientInterface/users/RegisterForm/RegisterForm.tsx';
import Login from './features/clientInterface/users/LoginForm/LoginForm.tsx';

function App() {
  // const {user} = useSelector((state: RootState) => state.user);


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
            <Route path={'/'} element={'Hello !'}/>
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


