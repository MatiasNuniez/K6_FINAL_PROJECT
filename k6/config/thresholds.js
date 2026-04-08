// =============================================================================
// k6 Performance Tests — Configuración central
// Proyecto: Calculadora de Nómina
// SLA: response time ≤ 3000ms (PRD), error rate < 1%
// =============================================================================

// URLs base — en GitHub Actions apuntan a localhost (docker-compose en el runner)
export const BASE_URL_EMPLOYEE = __ENV.BASE_URL_EMPLOYEE || 'http://localhost:8081/api/v1/employees';
export const BASE_URL_PAYROLL  = __ENV.BASE_URL_PAYROLL  || 'http://localhost:8082/api/v1/payroll';

// SLAs alineados al PRD y TEST_PLAN (TC-028)
export const slaThresholds = {
  'http_req_duration': [
    'p(50) < 1000',   // mediana bajo 1s
    'p(95) < 2000',   // P95 bajo 2s
    'p(99) < 3000',   // P99 bajo 3s — SLA del PRD
  ],
  'http_req_failed': ['rate < 0.01'],  // < 1% errores
};

export const JSON_HEADERS = {
  headers: { 'Content-Type': 'application/json' },
};
