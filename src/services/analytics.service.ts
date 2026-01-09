import httpClient from './httpClient';

export const analyticsService = {
  getStats: async (range: string = 'this-month') => {
    const response = await httpClient.get(`/analytics/stats?range=${range}`);
    return response.data;
  },
  // Future analytics methods...
};
