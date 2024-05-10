import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Alert, Avatar, Box, Button, Container, Grid, Link, TextField, Typography, } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import { AppDispatch, RootState } from '../../../../app/store.ts';
import { useDispatch, useSelector } from 'react-redux';
import { googleLogin, login } from '../../../../store/user/userThunk.ts';
import { GoogleLogin } from '@react-oauth/google';
import { Login as log } from '../../../../types';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {loginError: error, loginLoad} = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [users, setUsers] = useState<log>({
    username: '',
    password: '',
  });


  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setUsers((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await dispatch(login(users)).unwrap();
      navigate('/');
    } catch (e) {
      // nothing
    }
  };

  const googleLoginHandler = async (credential: string) => {
    await dispatch(googleLogin(credential)).unwrap();
    navigate('/');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline/>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
            <LockOutlinedIcon/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box sx={{pt: 2}}></Box>
          {error && (
            <Alert severity="error" sx={{mt: 3, width: '100%'}}>
              {error.error}
            </Alert>
          )}
          <Box sx={{pt: 2}}>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                if (credentialResponse.credential) {
                  void googleLoginHandler(credentialResponse.credential);
                }
              }}
              onError={() => {
                console.log('log');
              }}
            />
          </Box>
          <Box component="form" onSubmit={submitFormHandler} sx={{mt: 3}}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="username"
                  name="username"
                  autoComplete="new-username"
                  value={users.username}
                  onChange={onChange}
                  fullWidth={true}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={users.password}
                  onChange={onChange}
                  fullWidth={true}
                  required
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              color={'success'}
              variant="contained"
              sx={{mt: 3, mb: 2}}
              disabled={!!loginLoad}
            >
              {loginLoad ? <CircularProgress/> : 'Sign In'}
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/register" variant="body2">
                  Don&apos;t have an account? Sign up!
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
