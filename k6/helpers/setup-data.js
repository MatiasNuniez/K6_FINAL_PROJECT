import http from 'k6/http';
import { sleep } from 'k6';
import { BASE_URL_EMPLOYEE, BASE_URL_PAYROLL, JSON_HEADERS } from '../config/thresholds.js';

export function createTestEmployee(name, contractType, grossSalary) {
  const payload = JSON.stringify({
    name:         name,
    contractType: contractType,
    grossSalary:  grossSalary,
  });

  const res = http.post(BASE_URL_EMPLOYEE, payload, JSON_HEADERS);

  if (res.status !== 201) {
    console.error(`Failed to create employee: ${res.status} - ${res.body}`);
    return null;
  }

  return JSON.parse(res.body);
}

export function calculatePayroll(employeeId, retries = 5, delaySeconds = 2) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = http.post(
      `${BASE_URL_PAYROLL}/calculate/${employeeId}`,
      null,
      JSON_HEADERS
    );

    if (res.status === 201) {
      return JSON.parse(res.body);
    }

    if (res.status === 404 && attempt < retries) {
      console.warn(`Employee ${employeeId} not synced yet (attempt ${attempt}/${retries}), retrying in ${delaySeconds}s...`);
      sleep(delaySeconds);
      continue;
    }

    console.error(`Failed to calculate payroll: ${res.status} - ${res.body}`);
    return null;
  }

  return null;
}

export function confirmPayroll(payrollId) {
  const res = http.patch(
    `${BASE_URL_PAYROLL}/${payrollId}/confirm`,
    null,
    JSON_HEADERS
  );

  if (res.status !== 200) {
    console.error(`Failed to confirm payroll: ${res.status} - ${res.body}`);
    return null;
  }

  return JSON.parse(res.body);
}

export function createEmployeePool(count) {
  const contracts = ['FULL_TIME', 'PART_TIME', 'PROFESSIONAL_SERVICES'];
  const salaries  = [3000, 1500, 5000];
  const employees = [];

  for (let i = 0; i < count; i++) {
    const idx = i % contracts.length;
    const emp = createTestEmployee(
      `K6 Perf Test ${contracts[idx]} ${Date.now()}_${i}`,
      contracts[idx],
      salaries[idx]
    );
    if (emp) employees.push(emp);
  }

  if (employees.length === 0) {
    throw new Error('No se pudo crear ningún empleado de prueba. Verificar que employee-service está disponible.');
  }

  console.log(`Setup: ${employees.length}/${count} empleados creados`);
  return employees;
}
