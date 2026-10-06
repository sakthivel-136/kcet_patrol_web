import apiClient from './axiosClient';

export interface PatrolRound {
  id: string;
  round_number: number;
  start_time: string;
  end_time: string;
}

export const getRounds = async (): Promise<PatrolRound[]> => {
  try {
    const res = await apiClient.get('/rounds');
    return res.data;
  } catch (err) {
    console.error('Error fetching rounds:', err);
    return [];
  }
};

export const createRound = async (round_number: number, start_time: string, end_time: string): Promise<boolean> => {
  try {
    await apiClient.post('/rounds', { round_number, start_time, end_time });
    return true;
  } catch (err) {
    console.error('Error creating round:', err);
    return false;
  }
};

export const updateRound = async (id: string, round_number: number, start_time: string, end_time: string): Promise<boolean> => {
  try {
    await apiClient.put(`/rounds/${id}`, { round_number, start_time, end_time });
    return true;
  } catch (err) {
    console.error('Error updating round:', err);
    return false;
  }
};

export const deleteRound = async (id: string): Promise<boolean> => {
  try {
    await apiClient.delete(`/rounds/${id}`);
    return true;
  } catch (err) {
    console.error('Error deleting round:', err);
    return false;
  }
};
