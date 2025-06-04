import api from '../config/api';
import { mockJobs } from '../utils/mockData';

export const fetchJobs = async () => {
  try {
    console.log('Calling API to fetch all jobs...');
    const response = await api.get('/api/vitrilamviets');
    console.log('API response success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    console.log('Using mock job data as fallback');
    return mockJobs;
  }
};

export const fetchJobDetails = async (id) => {
  try {
    console.log(`Fetching job details for ID: ${id}`);
    const response = await api.get(`/api/vitrilamviets/${id}`);
    console.log('Job details response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching job details:', error);
    
    // Try to find job in mock data
    const job = mockJobs.data.find(job => job.id === parseInt(id));
    if (job) {
      console.log('Using mock job data for details');
      return { data: job };
    }
    
    throw error;
  }
};

export default {
  fetchJobs,
  fetchJobDetails
}; 