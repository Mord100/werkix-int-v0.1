import React from 'react';

const SwingAnalysisContext = React.createContext({
    swingAnalysis: [],
    currentSwingAnalysis: null,
    loading: false,
    error: null,
    setSwingAnalysis: () => {},
    setCurrentSwingAnalysis: () => {},
    setLoading: () => {},
    setError: () => {},
});

export default SwingAnalysisContext;