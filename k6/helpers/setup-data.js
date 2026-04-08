// =============================================================================
// Helpers — Creación de datos de prueba para k6
// Usa employee-service para crear empleados que luego serán usados en los tests
// =============================================================================

import http from 'k6/http';
import { BASE_URL_EMPLOYEE, BASE_URL_PAYROLL, JSON_HEADERS } from '../config/thresholds.js';

/**
 * Crea un empleado de prueba en employee-service.
 * @param {string} name - Nombre del empleado
 * @param {string} contractType - FULL_TIME | PART_TIME | PROFESSIONAL_SERVICES
 * @param {number} grossSalary - Salario bruto
 * @returns {object|null} EmployeeResponse con { id, name, grossSalary, activeContract }
 */
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

/**
 * Calcula la nómina de un empleado y retorna el PayrollResponse.
 * @param {number} employeeId - ID del empleado
 * @returns {object|null} PayrollResponse con { id, employeeId, netSalary, confirmed, ... }
 */
export function calculatePayroll(employeeId) {
  const res = http.post(
    `${BASE_URL_PAYROLL}/calculate/${employeeId}`,
    null,
    JSON_HEADERS
  );

  if (res.status !== 201) {
    console.error(`Failed to calculate payroll: ${res.status} - ${res.body}`);
    return null;
  }

  return JSON.parse(res.body);
}

/**
 * Confirma una nómina (requisito para generar PDF).
 * @param {number} payrollId - ID de la nómina
 * @returns {object|null} PayrollResponse confirmado
 */
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

/**
 * Crea un pool de empleados para distribuir carga en los tests.
 * @param {number} count - Cantidad de empleados a crear
 * @returns {object[]} Array de EmployeeResponse
 */
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
