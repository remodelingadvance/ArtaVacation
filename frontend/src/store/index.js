import { configureStore, combineReducers } from '@reduxjs/toolkit';

import {
  persistStore,
  persistReducer,
} from 'redux-persist';

import createWebStorage from 'redux-persist/es/storage/createWebStorage';

import authReducer from './slices/authSlice';
import propertyReducer from './slices/propertySlice';
import bookingReducer from './slices/bookingSlice';
import themeReducer from './slices/themeSlice';

const storage = createWebStorage('local');

const rootReducer = combineReducers({
  auth: authReducer,
  property: propertyReducer,
  booking: bookingReducer,
  theme: themeReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'theme'],
};

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
        ],
      },
    }),
});

export const persistor = persistStore(store);

export default store;