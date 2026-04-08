import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { BASE_URL_PAYROLL, slaThresholds, JSON_HEADERS } from '../config/thresholds.js';
import { createEmployeePool } from '../helpers/setup-data.js';

const calculateDuration = new Trend('payroll_calculate_duration', true);
const calculateFailRate = new Rate('payroll_calculate_fail_rate');

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 }, 
    { duration: '30s', target: 50 }, 
    { duration: '1m', target: 50 },  
    { duration: '10s', target: 0 },  
  ],
  thresholds: {
    ...slaThresholds,
    'payroll_calculate_duration': ['p(95) < 2000', 'p(99) < 3000'],
    'payroll_calculate_fail_rate': ['rate < 0.01'],
  },
};

export function setup() {
  const employees = createEmployeePool(9);
  return { employees };
}

export default function (data) {
  const emp = data.employees[Math.floor(Math.random() * data.employees.length)];

  const res = http.post(
    `${BASE_URL_PAYROLL}/calculate/${emp.id}`,
    null,
    JSON_HEADERS
  );

  calculateDuration.add(res.timings.duration);
  calculateFailRate.add(res.status !== 201);

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

  sleep(1);
}
