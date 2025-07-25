
import { useState, useEffect } from 'react';

// Hook pour gérer le basculement entre données mock et réelles
export const useMockData = () => {
  const [useMockData, setUseMockData] = useState(() => {
    // Par défaut, utiliser les mocks en développement
    return process.env.NODE_ENV === 'development' || 
           localStorage.getItem('use-mock-data') === 'true';
  });

  const toggleMockData = () => {
    const newValue = !useMockData;
    setUseMockData(newValue);
    localStorage.setItem('use-mock-data', newValue.toString());
  };

  return {
    useMockData,
    toggleMockData
  };
};

// Hook pour simuler des requêtes API avec délai
export const useMockApi = <T>(mockData: T, delay: number = 500) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Simuler un délai réseau
        await new Promise(resolve => setTimeout(resolve, delay));
        setData(mockData);
      } catch (err) {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mockData, delay]);

  return { data, loading, error };
};
