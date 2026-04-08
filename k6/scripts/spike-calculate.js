// =============================================================================
// Spike Test: Cálculo de nómina — pico repentino de tráfico
// Tipo: Spike Testing — verificar recuperación ante picos abruptos
// Patrón: 20 VUs base → 200 VUs en 30s → 20 VUs base
// =============================================================================

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { BASE_URL_PAYROLL, JSON_HEADERS } from '../config/thresholds.js';
import { createEmployeePool } from '../helpers/setup-data.js';

const spikeDuration = new Trend('spike_calculate_duration', true);
const spikeFailRate = new Rate('spike_calculate_fail_rate');

export const options = {
  stages: [
    { duration: '2m',  target: 20 },   // carga base
    { duration: '30s', target: 200 },   // spike abrupto
    { duration: '3m',  target: 200 },   // sostener spike
    { duration: '30s', target: 20 },    // caída abrupta
    { duration: '3m',  target: 20 },    // verificar recuperación
    { duration: '1m',  target: 0 },     // ramp down
  ],
  thresholds: {
    'http_req_duration':           ['p(95) < 3000'],
    'http_req_failed':             ['rate < 0.05'],
    'spike_calculate_duration':    ['p(95) < 3000'],
    'spike_calculate_fail_rate':   ['rate < 0.05'],
  },
};

export function setup() {
  const employees = createEmployeePool(12);
  return { employees };
}

export default function (data) {
  const emp = data.employees[Math.floor(Math.random() * data.employees.length)];

  const res = http.post(
    `${BASE_URL_PAYROLL}/calculate/${emp.id}`,
    null,
    JSON_HEADERS
  );

  spikeDuration.add(res.timings.duration);
  spikeFailRate.add(res.status !== 201);

  check(res, {
    'status is 201':          (r) => r.status === 201,
    'response time ≤ 3000ms': (r) => r.timings.duration <= 3000,
  });

  sleep(0.5);
}
