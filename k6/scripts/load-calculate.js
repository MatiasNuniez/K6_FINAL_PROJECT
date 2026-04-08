// =============================================================================
// TC-028 — Load Test: Cálculo de nómina (POST /api/v1/payroll/calculate/{id})
// SLA: response time ≤ 3000ms | error rate < 1%
// Tipo: Load Testing — comportamiento bajo carga esperada
// Patrón: ramp up → sostenido → incremento → sostenido → ramp down
// =============================================================================

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { BASE_URL_PAYROLL, slaThresholds, JSON_HEADERS } from '../config/thresholds.js';
import { createEmployeePool } from '../helpers/setup-data.js';

// ── Métricas custom ─────────────────────────────────────────────────────────
const calculateDuration = new Trend('payroll_calculate_duration', true);
const calculateFailRate = new Rate('payroll_calculate_fail_rate');

// ── Opciones del test ───────────────────────────────────────────────────────
export const options = {
  stages: [
    { duration: '1m', target: 20 },   // ramp up a 20 VUs
    { duration: '5m', target: 20 },   // sostenido 5 min
    { duration: '1m', target: 50 },   // incremento a 50 VUs
    { duration: '5m', target: 50 },   // sostenido 5 min
    { duration: '2m', target: 0 },    // ramp down
  ],
  thresholds: {
    ...slaThresholds,
    'payroll_calculate_duration': ['p(95) < 2000', 'p(99) < 3000'],
    'payroll_calculate_fail_rate': ['rate < 0.01'],
  },
};

// ── Setup: crear empleados de prueba (1 sola vez antes de todo) ─────────────
export function setup() {
  const employees = createEmployeePool(9); // 3 por tipo de contrato
  return { employees };
}

// ── Iteración principal (cada VU ejecuta esto en loop) ──────────────────────
export default function (data) {
  const emp = data.employees[Math.floor(Math.random() * data.employees.length)];

  const res = http.post(
    `${BASE_URL_PAYROLL}/calculate/${emp.id}`,
    null,
    JSON_HEADERS
  );

  // Registrar métricas custom
  calculateDuration.add(res.timings.duration);
  calculateFailRate.add(res.status !== 201);

  // Validaciones alineadas a TC-028
  check(res, {
    'TC-028: status is 201':             (r) => r.status === 201,
    'TC-028: response time ≤ 3000ms':    (r) => r.timings.duration <= 3000,
    'TC-028: body has netSalary':        (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.netSalary !== undefined && body.netSalary !== null;
      } catch { return false; }
    },
    'TC-028: body has deductionAmount':  (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.deductionAmount !== undefined;
      } catch { return false; }
    },
    'TC-028: body has bonusAmount':      (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.bonusAmount !== undefined;
      } catch { return false; }
    },
  });

  sleep(1); // think time — simula pausa real del usuario
}
