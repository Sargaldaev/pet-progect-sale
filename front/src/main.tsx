import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {PersistGate} from 'redux-persist/integration/react';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {persister, store} from './app/store.ts';
import {addInterceptors} from './axiosApi.ts';
import {GoogleOAuthProvider} from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './constans.ts';

addInterceptors(store);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <PersistGate persistor={persister}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </GoogleOAuthProvider>
  </Provider>,
)
