import apiClient from './axiosClient';

export interface ShiftAllocation {
  id: string;
  shift_id: string;
  guard_id: string;
}

export const getAllocations = async (shift_id?: string): Promise<ShiftAllocation[]> => {
  const params = new URLSearchParams();
  if (shift_id) params.append('shift_id', shift_id);
  const response = await apiClient.get(`/allocations?${params.toString()}`);
  return response.data;
};

export const allocateGuards = async (allocations: Omit<ShiftAllocation, 'id'>[]): Promise<{ message: string, allocations_inserted: number }> => {
  const response = await apiClient.post('/allocations/bulk', allocations);
  return response.data;
};
