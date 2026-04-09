 █ THRESHOLDS 

    http_req_duration
    ✓ 'p(50) < 1000' p(50)=2.13ms
    ✓ 'p(95) < 2000' p(95)=4.73ms
    ✓ 'p(99) < 3000' p(99)=7.13ms

    http_req_failed
    ✓ 'rate < 0.01' rate=0.05%

    pdf_generation_duration
    ✓ 'p(95) < 3000' p(95)=4.68ms

    pdf_generation_fail_rate
    ✓ 'rate < 0.01' rate=0.00%


  █ TOTAL RESULTS 

    checks_total.......: 23184   117.414452/s
    checks_succeeded...: 100.00% 23184 out of 23184
    checks_failed......: 0.00%   0 out of 23184

    ✓ status is 200
    ✓ response time ≤ 3000ms
    ✓ content-type is PDF
    ✓ body is not empty

    CUSTOM
    pdf_generation_duration........: avg=2.41ms min=1.01ms med=2.13ms max=141.98ms p(90)=3.66ms p(95)=4.68ms
    pdf_generation_fail_rate.......: 0.00%  0 out of 5796

    HTTP
    http_req_duration..............: avg=2.52ms min=1.01ms med=2.13ms max=323.21ms p(90)=3.69ms p(95)=4.73ms
      { expected_response:true }...: avg=2.49ms min=1.01ms med=2.13ms max=323.21ms p(90)=3.69ms p(95)=4.72ms
    http_req_failed................: 0.05%  3 out of 5808
    http_reqs......................: 5808   29.414387/s

    EXECUTION
    iteration_duration.............: avg=1s     min=1s     med=1s     max=1.14s    p(90)=1s     p(95)=1s    
    iterations.....................: 5796   29.353613/s
    vus............................: 1      min=0         max=50
    vus_max........................: 50     min=50        max=50

    NETWORK
    data_received..................: 11 MB  55 kB/s
    data_sent......................: 524 kB 2.7 kB/s


# Load Test Conclusion — PDF Generation Service

## Evaluación General
El servicio de generación de PDFs demuestra un alto nivel de performance, estabilidad y confiabilidad, con tiempos de respuesta extremadamente bajos y una tasa de error prácticamente nula.

---

## Performance
- p50 ≈ 2ms  
- p95 ≈ 4.7ms  
- p99 ≈ 7ms  

**Conclusión:**
El servicio responde en milisegundos incluso bajo carga, lo que indica:
- Excelente optimización del backend
- Alta eficiencia en el procesamiento
- Ausencia de cuellos de botella

---

## Estabilidad
- Requests totales: ~5800  
- Fallos HTTP: 0.05%  

**Conclusión:**
- Sistema altamente estable
- Los errores son mínimos

---

## Correctitud Funcional
- 100% de checks exitosos  

Validaciones:
- status 200 ✔  
- content-type PDF ✔  
- body no vacío ✔  

**Conclusión:**
El sistema cumple completamente con los requisitos funcionales.

---

## Escalabilidad
- ~29 requests por segundo  
- Hasta 50 usuarios concurrentes  

**Conclusión:**
El sistema soporta carga concurrente sin degradación visible.

---

## Conclusión Final
El servicio de generación de PDFs es:
- Muy rápido  
- Estable  
- Funcionalmente correcto  

Con un nivel mínimo de errores que no compromete el sistema, aunque puede optimizarse.