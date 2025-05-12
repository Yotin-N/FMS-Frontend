import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FarmContext = createContext();

export const FarmProvider = ({ children }) => {
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [farms, setFarms] = useState([]);
  const navigate = useNavigate();

  // Load saved farm from localStorage on initial load
  useEffect(() => {
    const savedFarmId = localStorage.getItem('selectedFarmId');
    if (savedFarmId && farms.length > 0) {
      const farm = farms.find(f => f.id === savedFarmId);
      if (farm) {
        setSelectedFarm(farm);
      }
    }
  }, [farms]);

  const handleFarmChange = (newFarm) => {
    setSelectedFarm(newFarm);
    if (newFarm) {
      localStorage.setItem('selectedFarmId', newFarm.id);
      // Update URL if we're on the dashboard
      if (window.location.pathname.includes('/dashboard')) {
        navigate(`/dashboard?farmId=${newFarm.id}`, { replace: true });
      }
    } else {
      localStorage.removeItem('selectedFarmId');
      if (window.location.pathname.includes('/dashboard')) {
        navigate('/dashboard', { replace: true });
      }
    }
  };

  return (
    <FarmContext.Provider value={{ 
      selectedFarm, 
      setSelectedFarm, 
      farms, 
      setFarms, 
      handleFarmChange 
    }}>
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
}; 