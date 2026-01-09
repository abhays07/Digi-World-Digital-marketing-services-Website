// Aggregator file for backward compatibility or unified import
// Prever importing directly from specific services in new code.

import httpClient from './httpClient';
export { authService } from './auth.service';
export { analyticsService } from './analytics.service';
export { vendorService } from './vendor.service';
export { clientService } from './client.service';

export default httpClient;
