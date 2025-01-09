import { createContext } from 'react';

const FittingsContext = createContext({
  fittings: [],
  currentFitting: null,
  loading: false,
  fetchFittings: () => {},
  createFitting: () => {},
  updateFitting: () => {},
  deleteFitting: () => {},
  getFittingById: () => {},
  scheduleFitting: () => {},
  setCurrentFitting: () => {}
});

export default FittingsContext;