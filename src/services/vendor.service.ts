import httpClient from './httpClient';

export const vendorService = {
  getAll: async () => {
    const response = await httpClient.get('/finance/vendors');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await httpClient.get(`/finance/vendors/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await httpClient.post('/finance/vendors', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await httpClient.put(`/finance/vendors/${id}`, data);
    return response.data;
  },
  addPayment: async (id: string, data: FormData) => {
    const response = await httpClient.put(`/finance/vendors/${id}/add-payment`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  // Archival/Deletion
  archive: async (id: string) => {
      const response = await httpClient.delete(`/finance/vendors/${id}`);
      return response.data;
  },
  deletePermanently: async (id: string) => {
      const response = await httpClient.delete(`/finance/vendors/${id}/permanent`);
      return response.data;
  }
};
