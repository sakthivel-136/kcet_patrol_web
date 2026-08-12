import apiClient from './axiosClient';

export interface Shift {
  shift_id: string;
  shift_name: string;
  start_time: string;
  end_time: string;
}

export const getShifts = async (): Promise<Shift[]> => {
  const response = await apiClient.get('/shifts');
  return response.data;
};

export const createShift = async (data: Omit<Shift, 'shift_id'>): Promise<Shift> => {
  const response = await apiClient.post('/shifts', data);
  return response.data;
};

export const updateShift = async (id: string, data: Partial<Omit<Shift, 'shift_id'>>): Promise<Shift> => {
  const response = await apiClient.put(`/shifts/${id}`, data);
  return response.data;
};

export const deleteShift = async (id: string): Promise<void> => {
  await apiClient.delete(`/shifts/${id}`);
};
