import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { BASE_URL_PAYROLL, slaThresholds, JSON_HEADERS } from '../config/thresholds.js';
import { createTestEmployee, calculatePayroll, confirmPayroll } from '../helpers/setup-data.js';

const pdfDuration = new Trend('pdf_generation_duration', true);
const pdfFailRate = new Rate('pdf_generation_fail_rate');

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
    'pdf_generation_duration': ['p(95) < 3000'],
    'pdf_generation_fail_rate': ['rate < 0.01'],
  },
};

export function setup() {
  const contracts = ['FULL_TIME', 'PART_TIME', 'PROFESSIONAL_SERVICES'];
  const salaries  = [3000, 1500, 5000];
  const payrolls  = [];

  for (let i = 0; i < contracts.length; i++) {
    const emp = createTestEmployee(
      `K6 PDF Test ${contracts[i]} ${Date.now()}`,
      contracts[i],
      salaries[i]
    );
    if (!emp) continue;

    const payroll = calculatePayroll(emp.id);
    if (!payroll) continue;

    const confirmed = confirmPayroll(payroll.id);
    if (confirmed) {
      payrolls.push({ payrollId: confirmed.id });
    }
  }

  if (payrolls.length === 0) {
    throw new Error('No se pudo crear ninguna nómina confirmada para test de PDF.');
  }

  console.log(`Setup: ${payrolls.length} nóminas confirmadas listas para test de PDF`);
  return { payrolls };
}

export default function (data) {
  const p = data.payrolls[Math.floor(Math.random() * data.payrolls.length)];

  const res = http.get(
    `${BASE_URL_PAYROLL}/${p.payrollId}/pdf`,
    { responseType: 'binary' }
  );

  pdfDuration.add(res.timings.duration);
  pdfFailRate.add(res.status !== 200);

  check(res, {
    'status is 200':            (r) => r.status === 200,
    'response time ≤ 3000ms':   (r) => r.timings.duration <= 3000,
    'content-type is PDF':      (r) =>
      r.headers['Content-Type'] !== undefined &&
      r.headers['Content-Type'].includes('application/pdf'),
    'body is not empty':        (r) => r.body && r.body.byteLength > 0,
  });

  sleep(1);
}
