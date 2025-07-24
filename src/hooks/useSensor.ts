import { useState, useEffect } from 'react';
import { fetchSensorData, SensorData } from '@/services/sensorService';

export const useSensor = (farmId?: string) => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSensorData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSensorData(farmId);
      setSensorData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sensor data';
      setError(errorMessage);
      console.error('Sensor fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSensorData();

    // Refresh sensor data every 5 minutes for real-time updates
    const interval = setInterval(loadSensorData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [farmId]);

  const refetch = async () => {
    await loadSensorData();
  };

  return { sensorData, loading, error, refetch };
};