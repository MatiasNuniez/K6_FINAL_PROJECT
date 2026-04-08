// =============================================================================
// Stress Test: Cálculo de nómina — encontrar punto de quiebre
// Tipo: Stress Testing — incremento progresivo hasta degradación
// Patrón: 50 → 100 → 200 → 300 VUs con mesetas de 5 min
// =============================================================================

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { BASE_URL_PAYROLL, JSON_HEADERS } from '../config/thresholds.js';
import { createEmployeePool } from '../helpers/setup-data.js';

const stressDuration = new Trend('stress_calculate_duration', true);
const stressFailRate = new Rate('stress_calculate_fail_rate');

export const options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '5m', target: 50 },
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 },
    { duration: '5m', target: 300 },
    { duration: '5m', target: 0 },    // ramp down — observar recuperación
  ],
  thresholds: {
    'http_req_duration':            ['p(95) < 3000'],
    'http_req_failed':              ['rate < 0.05'],  // 5% tolerancia en stress
    'stress_calculate_duration':    ['p(95) < 3000'],
    'stress_calculate_fail_rate':   ['rate < 0.05'],
  },
};

export function setup() {
  const employees = createEmployeePool(15); // pool más grande para stress
  return { employees };
}

export default function (data) {
  const emp = data.employees[Math.floor(Math.random() * data.employees.length)];

  const res = http.post(
    `${BASE_URL_PAYROLL}/calculate/${emp.id}`,
    null,
    JSON_HEADERS
  );

  stressDuration.add(res.timings.duration);
  stressFailRate.add(res.status !== 201);

  check(res, {
    'status is 201':          (r) => r.status === 201,
    'response time ≤ 3000ms': (r) => r.timings.duration <= 3000,
  });

  sleep(0.5); // think time reducido para generar más presión
}
