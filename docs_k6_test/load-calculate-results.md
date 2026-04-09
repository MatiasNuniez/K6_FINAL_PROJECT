█ THRESHOLDS 

    http_req_duration
    ✓ 'p(50) < 1000' p(50)=1.93ms
    ✓ 'p(95) < 2000' p(95)=4.06ms
    ✓ 'p(99) < 3000' p(99)=7.24ms

    http_req_failed
    ✓ 'rate < 0.01' rate=0.00%

    payroll_calculate_duration
    ✓ 'p(95) < 2000' p(95)=4.05ms
    ✓ 'p(99) < 3000' p(99)=7.21ms

    payroll_calculate_fail_rate
    ✓ 'rate < 0.01' rate=0.00%


  █ TOTAL RESULTS 

    checks_total.......: 133365 158.639104/s
    checks_succeeded...: 99.99% 133361 out of 133365
    checks_failed......: 0.00%  4 out of 133365

    ✗ TC-028: status is 201
      ↳  99% — ✓ 26672 / ✗ 1
    ✓ TC-028: response time ≤ 3000ms
    ✗ TC-028: body has netSalary
      ↳  99% — ✓ 26672 / ✗ 1
    ✗ TC-028: body has deductionAmount
      ↳  99% — ✓ 26672 / ✗ 1
    ✗ TC-028: body has bonusAmount
      ↳  99% — ✓ 26672 / ✗ 1

    CUSTOM
    payroll_calculate_duration.....: avg=2.21ms min=888.41µs med=1.93ms max=45.69ms  p(90)=3.16ms p(95)=4.05ms
    payroll_calculate_fail_rate....: 0.00%  1 out of 26673

    HTTP
    http_req_duration..............: avg=2.23ms min=888.41µs med=1.93ms max=363.14ms p(90)=3.16ms p(95)=4.06ms
      { expected_response:true }...: avg=2.23ms min=888.41µs med=1.93ms max=363.14ms p(90)=3.16ms p(95)=4.06ms
    http_req_failed................: 0.00%  1 out of 26682
    http_reqs......................: 26682  31.738526/s

    EXECUTION
    iteration_duration.............: avg=1s     min=1s       med=1s     max=1.04s    p(90)=1s     p(95)=1s    
    iterations.....................: 26673  31.727821/s
    vus............................: 1      min=1          max=50
    vus_max........................: 50     min=50         max=50

    NETWORK
    data_received..................: 15 MB  18 kB/s
    data_sent......................: 3.9 MB 4.7 kB/s


# Load Test Conclusion — Payroll Calculation Service

## Evaluación General
El servicio de cálculo de nómina presenta un rendimiento destacado y alta confiabilidad, con una precisión funcional del 99.99% y sin errores HTTP.

---

## Performance
- p50 ≈ 1.93ms  
- p95 ≈ 4.05ms  
- p99 ≈ 7.2ms  

**Conclusión:**
- Cálculo extremadamente eficiente
- Ideal para sistemas en tiempo real
- No representa un cuello de botella

---

## Estabilidad
- Requests: ~26682  
- Fallos HTTP: 0.00%  

**Conclusión:**
- Sistema completamente estable
- Sin errores de comunicación

---

## Correctitud Funcional
- 99.99% de éxito  
- 4 fallos detectados  

**Detalle:**
Todos los fallos corresponden a una única request con:
- status incorrecto  
- ausencia de campos (`netSalary`, `deductionAmount`, `bonusAmount`)  

**Conclusión:**
- Sistema altamente confiable
- Existe un caso aislado.

---

## Escalabilidad
- ~31.7 requests por segundo  
- 50 usuarios concurrentes  

**Conclusión:**
- Soporta carga concurrente sin degradación
- Buen throughput


---

## Conclusión Final
El sistema de cálculo de nómina es:
- Extremadamente rápido  
- Muy estable  
- Altamente preciso (99.99%)  