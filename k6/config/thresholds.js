export const BASE_URL_EMPLOYEE = __ENV.BASE_URL_EMPLOYEE || 'http://localhost:8081/api/v1/employees';
export const BASE_URL_PAYROLL  = __ENV.BASE_URL_PAYROLL  || 'http://localhost:8082/api/v1/payroll';

export const slaThresholds = {
  'http_req_duration': [
    'p(50) < 1000', 
    'p(95) < 2000',  
    'p(99) < 3000',  
  ],
  'http_req_failed': ['rate < 0.01'], 
};

export const JSON_HEADERS = {
  headers: { 'Content-Type': 'application/json' },
};
