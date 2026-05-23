import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  properties: [],
  selectedProperty: null,
  loading: false,
  error: null,
  filters: {
    propertyType: [],
    priceRange: [0, 10000],
    location: '',
    guests: 0,
    bedrooms: 0,
    amenities: [],
  },
};

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    setProperties: (state, action) => {
      state.properties = action.payload;
    },
    setSelectedProperty: (state, action) => {
      state.selectedProperty = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setProperties, setSelectedProperty, setFilters, setLoading, setError } =
  propertySlice.actions;
export default propertySlice.reducer;