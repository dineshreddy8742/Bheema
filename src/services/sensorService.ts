import axios from 'axios';

export interface SensorReading {
  name: string;
  value: number;
  unit: string;
  optimal: [number, number];
  status: 'good' | 'warning' | 'critical';
  icon: string;
  description: string;
  timestamp: string;
}

export interface SensorData {
  sensors: SensorReading[];
  recommendations: Array<{
    type: 'irrigation' | 'temperature' | 'weather' | 'pest' | 'nutrition';
    severity: 'low' | 'medium' | 'high';
    title: string;
    description: string;
    action: string;
  }>;
}

// Example API endpoint - replace with your actual sensor API
const SENSOR_API_URL = 'https://api.yoursensorprovider.com/v1';
const API_KEY = process.env.VITE_SENSOR_API_KEY || 'demo';

export const fetchSensorData = async (farmId: string = 'default'): Promise<SensorData> => {
  try {
    if (API_KEY === 'demo') {
      throw new Error('Please configure your sensor API key in environment variables');
    }

    const response = await axios.get(`${SENSOR_API_URL}/farms/${farmId}/sensors`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Sensor API error:', error);
    throw new Error('Failed to fetch real-time sensor data. Please check your API configuration.');
  }
};

export const fetchSensorHistory = async (farmId: string = 'default', days: number = 7): Promise<any> => {
  try {
    if (API_KEY === 'demo') {
      throw new Error('Please configure your sensor API key in environment variables');
    }

    const response = await axios.get(`${SENSOR_API_URL}/farms/${farmId}/history`, {
      params: { days },
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Sensor history API error:', error);
    throw new Error('Failed to fetch sensor history data. Please check your API configuration.');
  }
};