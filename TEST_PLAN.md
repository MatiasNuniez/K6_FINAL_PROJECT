# TEST PLAN — Calculadora de Nómina
## Ciclo completo: HU-01, HU-02, HU-03, HU-04, HU-05
### Microsprint 1: HU-01 · HU-03 · HU-04
### Microsprint 2: HU-02 · HU-05
---

## 1. Identificación del Plan

| Campo | Detalle |
|---|---|
| **Nombre del proyecto** | 🏢 HR: Calculadora de Nómina y Beneficios |
| **Sistema bajo prueba** | Calculadora de salario neto deduciendo impuestos y sumando bonos según tipo de contrato |
| **Versión** | MVP1.0 |
| **Fecha** | 24/03/2026 |
| **Elaborado por** | Matias Nuñez |

---

## 2. Contexto

La Calculadora de Nómina es una solución digital dirigida a analistas de Recursos Humanos que actualmente realizan cálculos de nómina de forma manual en Excel, proceso que es lento y propenso a errores. El sistema automatiza el cálculo del salario neto considerando deducciones de ley y bonificaciones según el tipo de contrato del empleado (tiempo completo, medio tiempo y servicios profesionales), generando un resultado preciso en segundos y eliminando el riesgo de multas legales por errores de cálculo.

Este plan de pruebas está destinado a cubrir la versión 1.0 del MVP, que incluye las funcionalidades de registro de empleados, cálculo de salario neto y confirmación del resultado antes de generar el documento final.

---

## 3. Alcance de las Pruebas

### 3.1 Historias de Usuario que serán validadas

**Microsprint 1 — Flujo principal: registro, cálculo y confirmación**

| ID | Historia de Usuario | Story Points |
|---|---|---|
| HU-01 | Registro de empleado con contratos | 5 |
| HU-03 | Cálculo de salario neto | 8 |a
| HU-04 | Confirmación del resultado | 2 |
| **Subtotal MS1** | | **15** |

**Microsprint 2 — Flujo secundario: corrección y generación de PDF**

| ID | Historia de Usuario | Story Points |
|---|---|---|
| HU-02 | Corrección de datos del empleado | 3 |
| HU-05 | Generación de PDF | 3 |
| **Subtotal MS2** | | **6** |

| **Total** | | **21** |

---

## 4. Estrategia de Pruebas

### 4.1 Niveles de prueba

**Pruebas funcionales (SerenityBDD + Cucumber)**
Se utilizará el stack SerenityBDD con Cucumber para automatizar los escenarios BDD escritos en Gherkin, cubriendo los criterios de aceptación de cada HU. Los escenarios incluirán flujos exitosos, flujos alternativos y casos de borde.

**Pruebas de API / Integración (Karate)**
Se utilizará Karate para validar directamente los contratos de los endpoints REST expuestos por el backend, verificando códigos HTTP, estructura de respuesta, manejo de errores y consistencia de datos persistidos.

Endpoints cubiertos en este ciclo:
- `POST /empleados`
- `GET /empleados/{id}`
- `POST /empleados/{id}/contratos`
- `PUT /empleados/{id}`
- `PUT /empleados/{id}/contratos/{idContrato}`
- `PUT /empleados/{id}/salarios/{idSalario}`
- `POST /empleados/{id}/salarios`
- `POST /empleados/{id}/calcularSalario`
- `GET /empleados/{id}/nominas/{idNomina}`
- `POST /empleados/{id}/nominas/{idNomina}/generar-pdf`

**Pruebas de rendimiento (k6)**
Se utilizará k6 para validar que el cálculo de salario neto responde dentro del umbral definido en el PRD (menos de 3 segundos). Las pruebas se ejecutarán sobre el endpoint.

Endpoints cubiertos en este ciclo:
`POST /empleados/{id}/calcularSalario`.

### 4.2 Tipos de casos de prueba

- **Casos positivos:** flujos válidos con datos correctos
- **Casos negativos:** datos inválidos y campos vacíos
- **Casos de borde:** valores límite (salario en cero, decimales, nombres con caracteres especiales)
- **Casos de estado:** acciones bloqueadas por el estado del sistema (ej. generación de PDF bloqueada si el resumen no fue confirmado)

---

## 5. Criterios de Entrada y Salida

### 5.1 Criterios de entrada

Para iniciar la ejecución de pruebas de una Historia de Usuario se requiere:

- El build del entorno de QA está estable y desplegado
- Los endpoints de la HU están implementados y documentados
- Los datos de prueba y la matriz de datos están definidos
- Los casos de prueba han sido revisados y aprobados
- DEV entregó la HU con las subtasks técnicas completadas

### 5.2 Criterios de salida

Una Historia de Usuario se considera probada y cerrada cuando:

- El 100% de los casos de prueba diseñados fueron ejecutados
- El 100% de los casos positivos pasan exitosamente
- No existen defectos abiertos de severidad **Alta** o **Crítica**
- Las pruebas de rendimiento de HU-03 confirman respuesta ≤ 3 segundos
- Los resultados fueron reportados y tienen el visto bueno del responsable de QA

---

## 6. Entorno de Pruebas

| Ítem | Detalle |
|---|---|
| **Ambiente** | Entorno de QA (staging) — aislado de producción |
| **Base de datos** | Instancia de base de datos exclusiva para pruebas, con datos controlados |
| **Microservicio employee-service** | Desplegado en ambiente QA |
| **Microservicio payroll-service** | Desplegado en ambiente QA |
| **Frontend** | Aplicación web desplegada en ambiente QA |
| **Datos de prueba** | Matrices de datos definidas por QA por cada HU |
| **Navegadores (frontend)** | Chrome |

---

## 7. Herramientas

| Herramienta | Propósito |
|---|---|
| **SerenityBDD + Cucumber** | Automatización de pruebas funcionales end-to-end basadas en escenarios Gherkin (criterios de aceptación de las HU) |
| **Karate** | Pruebas de Microservicios: validación de contratos de endpoints, códigos HTTP, estructura de respuesta y datos persistidos |
| **k6** | Pruebas de rendimiento: validación del tiempo de respuesta del cálculo de nómina |
| **Github Projects** | Gestión de casos de prueba, reporte de defectos y trazabilidad HU → casos de prueba |
| **Git** | Control de versiones de los scripts de prueba |

---

## 8. Roles y Responsabilidades

| QA | Responsabilidad compartida | DEV |
|---|---|---|
| Diseño de la matriz de datos de prueba | Acuerdos sobre severidad y prioridad de defectos | Implementación de endpoints y lógica de negocio |
| Diseño y documentación de casos de prueba (positivos, negativos, de borde y de estado) | | Configuración de base de datos y migraciones |
| Escritura de escenarios Gherkin (.feature) | | Resolución de defectos reportados por QA |
| Implementación de automatización con SerenityBDD + Cucumber | | Soporte en la configuración del entorno de QA |
| Implementación de colecciones de prueba en Karate | | Revisión de DTOs y validaciones de entrada |
| Implementación de scripts de rendimiento en k6 | | |
| Ejecución de pruebas y registro de resultados | | |
| Reporte y seguimiento de defectos | | |
| Generación de métricas e informe final | | |

---

## 9. Cronograma y Estimación

### 9.1 Estimación de esfuerzo por Historia de Usuario

La estimación de esfuerzo de QA se calcula tomando como referencia los Story Points del microsprint.

| Microsprint | HU | Story Points | Tareas QA | Esfuerzo estimado QA |
|---|---|---|---|---|
| MS1 | HU-01 | 5 | 8 subtasks (T01–T08) | Alto |
| MS1 | HU-03 | 8 | 8 subtasks (T01–T08) | Alto |
| MS1 | HU-04 | 2 | 5 subtasks (T01–T05) | Bajo |
| **Subtotal MS1** | | **15** | **21 subtasks** | **Alto** |
| MS2 | HU-02 | 3 | 7 subtasks (T01–T07) | Medio |
| MS2 | HU-05 | 3 | 6 subtasks (T01–T06) | Medio |
| **Subtotal MS2** | | **6** | **13 subtasks** | **Medio** |
| **Total** | | **21** | **34 subtasks** | **Alto** |

### 9.2 Plan de Microsprints QA

---

#### Microsprint 1 — Definición del Plan de Pruebas (HU-01, HU-03, HU-04)
**Duración:** 2 días  
**Objetivo:** Construir la base de trabajo de QA para HU-01, HU-03 y HU-04 — el flujo principal de registro, cálculo y confirmación — entendiendo el alcance, definiendo la estrategia y preparando las matrices de datos necesarias.

| Día | Actividad | Responsable |
|---|---|---|
| Día 1 | Lectura y análisis de HU-01, HU-03 y HU-04 junto con sus criterios de aceptación | QA |
| Día 1 | Revisión del PRD: fórmulas de cálculo de salario neto, reglas de bloqueo de HU-03 (sin empleado registrado) y HU-04 (sin nómina calculada) | QA |
| Día 1 | Revisión de subtasks QA de HU-01, HU-03 y HU-04 y alineación con criterios de aceptación | QA |
| Día 1 | Identificación de los 6 endpoints del grupo: `POST /empleados`, `GET /empleados/{id}`, `POST /empleados/{id}/contratos`, `POST /empleados/{id}/salarios`, `POST /empleados/{id}/calcularSalario`, `GET /empleados/{id}/nominas/{idNomina}` — definición del contrato esperado (método, path, request, response) | QA |
| Día 2 | Diseño de la matriz de datos para HU-01: nombre (caracteres especiales, números), salario bruto (negativo, cero, decimales) y campos vacíos | QA |
| Día 2 | Diseño de la matriz de datos para HU-03: combinaciones de salario bruto por los 3 tipos de contrato (tiempo completo, medio tiempo, servicios profesionales) con resultado esperado calculado manualmente | QA |
| Día 2 | Diseño de casos de prueba de estado para HU-04: resumen con desglose correcto, habilitación de PDF tras confirmación y bloqueo sin confirmación | QA |
| Día 2 | Revisión y aprobación del Test Plan para HU-01/03/04 con el equipo | QA + DEV |

**Criterio de cierre del Microsprint 1:**  
El `TEST_PLAN.md` está completo para HU-01, HU-03 y HU-04 y las matrices de datos están definidas.

---

#### Microsprint 2 — Diseño de Casos de Prueba (HU-02, HU-05)
**Duración:** 2 días  
**Objetivo:** Diseñar y documentar todos los casos de prueba de HU-02 y HU-05 — flujo secundario de corrección de datos y generación de PDF — cubriendo flujos positivos, negativos, de borde y de estado, listos para ser ejecutados o automatizados.

| Día | Actividad | Responsable |
|---|---|---|
| Día 1 | Lectura y análisis de HU-02 y HU-05 junto con sus criterios de aceptación | QA |
| Día 1 | Diseño de la matriz de datos para HU-02: ediciones válidas e inválidas con nómina no calculada y bloqueo con nómina calculada | QA |
| Día 1 | Diseño de casos de prueba para HU-02: edición exitosa de nombre y salario, edición inválida y bloqueo con nómina calculada | QA |
| Día 1 | Diseño de casos de prueba para HU-05: generación exitosa del PDF con campos correctos, notificación de descarga, bloqueo sin confirmar resumen y tiempo de generación ≤ 3 segundos | QA |
| Día 2 | Escritura de escenarios Gherkin (.feature) alineados a los criterios de aceptación de HU-02 y HU-05 | QA |
| Día 2 | Diseño de casos de prueba de API para Karate: verificación de códigos HTTP, estructura de respuesta y datos persistidos para los 4 endpoints del grupo: `PUT /empleados/{id}`, `PUT /empleados/{id}/contratos/{idContrato}`, `PUT /empleados/{id}/salarios/{idSalario}`, `POST /empleados/{id}/nominas/{idNomina}/generar-pdf` | QA |
| Día 2 | Diseño del caso de prueba de rendimiento para k6: tiempo de respuesta ≤ 3 segundos en `POST /empleados/{id}/nominas/{idNomina}/generar-pdf` | QA |
| Día 2 | Revisión cruzada de todos los casos de prueba (HU-01 a HU-05) con el equipo y ajustes finales | QA + DEV |

**Criterio de cierre del Microsprint 2:**  
El 100% de los casos de prueba de las 5 HUs están documentados, revisados y aprobados. Los escenarios Gherkin están escritos y los casos de API y rendimiento están definidos, todos listos para la fase de implementación y ejecución.

---

## 10. Entregables de Prueba

| Artefacto | Descripción |
|---|---|
| `TEST_PLAN.md` | Este documento — plan de pruebas del microsprint |
| Matrices de datos de prueba | Tablas con combinaciones de datos válidos e inválidos por HU |
| Casos de prueba documentados | Descripción, precondiciones, pasos, resultado esperado y resultado obtenido |
| Escenarios Gherkin | Escenarios BDD alineados a los criterios de aceptación de cada HU |
| Scripts de automatización SerenityBDD | Implementación de los escenarios funcionales automatizados |
| Colecciones Karate | Scripts de prueba de API para cada endpoint cubierto |
| Scripts k6 | Script de prueba de rendimiento para `POST /empleados/{id}/calcularSalario` |
| Reporte de ejecución SerenityBDD | Reporte HTML generado por Serenity con resultados de pruebas funcionales |
| Reporte de ejecución Karate | Reporte de resultados de pruebas de API |
| Reporte k6 | Métricas de rendimiento: tiempo de respuesta, throughput, tasa de error |
| Informe de defectos | Listado de defectos encontrados con severidad, prioridad y estado |
| Métricas de cobertura | % de casos ejecutados, % pasados, % fallidos, defectos por HU |

---

## 11. Riesgos y Contingencias

### Riesgos de producto

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Cambio en porcentajes de deducciones o bonificaciones por ley | Alto — los recibos generados serían incorrectos y podrían generar multas legales | RRHH designa un responsable de monitorear cambios normativos y actualizar el sistema antes de cada nómina |
| Manejo incorrecto de decimales en el cálculo de salario neto | Alto — pagos con montos irreales | QA diseña casos de prueba específicos para redondeo a 2 decimales en los 3 tipos de contrato |
| Inconsistencia entre el resultado mostrado en el resumen y el persistido en base de datos | Alto — el administrador confirmaría datos incorrectos antes de generar el PDF | QA valida en HU-04 que los datos del resumen coinciden exactamente con los persistidos en nóminas |
| Datos de entrada incorrectos que llegan al cálculo | Medio — cálculos inválidos | QA cubre validaciones de entrada en HU-01 antes de que el flujo llegue a HU-03 |

### Riesgos de proyecto

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Entorno de QA inestable o no disponible | Alto — bloquea la ejecución de pruebas | Acordar criterios de entrada claros; QA no inicia ejecución sin build estable |
| HU entregada por DEV sin criterios de aceptación completos | Medio — casos de prueba mal definidos | QA participa del refinamiento previo al desarrollo |
| Tiempo insuficiente para automatización completa en el ciclo | Medio — cobertura automatizada parcial | Priorizar automatización de flujos críticos (cálculo correcto por tipo de contrato) y ejecutar el resto manualmente |

---

<br>
<br>
<br>
<div align="center">
<strong>Equipo: José Jacobo Capa Angamarca - Matias Nuñez<strong>
</div>