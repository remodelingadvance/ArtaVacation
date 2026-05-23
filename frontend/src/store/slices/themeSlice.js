import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeTheme: 'Miami Summer',
  themes: [],
  loading: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setActiveTheme: (state, action) => {
      state.activeTheme = action.payload;
      localStorage.setItem('activeTheme', action.payload);
    },
    setThemes: (state, action) => {
      state.themes = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setActiveTheme, setThemes, setLoading } = themeSlice.actions;
export default themeSlice.reducer;