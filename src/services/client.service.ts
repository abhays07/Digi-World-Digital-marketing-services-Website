import httpClient from './httpClient';

export const clientService = {
  getAll: async () => {
    const response = await httpClient.get('/finance/clients');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await httpClient.get(`/finance/clients/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await httpClient.post('/finance/clients', data);
    return response.data;
  },
  checkCycles: async (id: string) => {
    const response = await httpClient.get(`/finance/clients/${id}/check-cycles`);
    return response.data;
  },
  addPayment: async (id: string, data: FormData) => {
    const response = await httpClient.put(`/finance/clients/${id}/add-payment`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  archive: async (id: string) => {
      const response = await httpClient.delete(`/finance/clients/${id}`);
      return response.data;
  },
  deletePermanently: async (id: string) => {
       const response = await httpClient.delete(`/finance/clients/${id}/permanent`);
       return response.data;
  }
};
