# Programaci-n-con-JavaScript
# Simulador de Pago de Prestaciones Laborales

## 📌 Descripción

Simulador web para el cálculo de prestaciones laborales en Colombia 2026, desarrollado como parte del taller de programación JavaScript en la Universidad el Bosque - Programa de Creación Digital.

## 🎯 Características

✅ **3 Pasos Claros:**
- Paso 1: Información básica del usuario
- Paso 2: Validación de perfil según edad
- Paso 3: Cálculo y resultados detallados

✅ **Validación de Perfil Automática:**
- Menores de 18 años: No permitidos
- 18-24 años: Beneficiarios por cotizante (no continúan)
- 25-59 años: Adultos trabajadores (cálculo completo)
- 60+ años: Pensionados (solo cálculo de pensión)

✅ **Cálculos Implementados:**
- Total Devengado = Salario + Comisiones + Horas Extra
- Auxilio de Transporte (si aplica)
- IBC (Ingreso Base de Cotización)
- Salud: 4% del IBC
- Pensión: 4% del IBC
- Fondo de Solidaridad Pensional: 1% (si IBC ≥ 4 SMLV)
- ARL: Según nivel de riesgo (5 niveles)
- Retención en la Fuente: Tabla completa Art. 383
- **Total a Recibir**: Ingresos - Deducciones

✅ **Valores 2026 Correctos:**
- Salario Mínimo: $1.750.905
- Salario Mínimo Integral: $22.761.765
- Subsidio de Transporte: $249.095
- UVT: $52.37

✅ **Diseño Responsivo:**
- Compatible con desktop, tablet y móvil
- Interfaz profesional con gradientes
- Mensajes de error/éxito intuitivos

## 📁 Archivos Incluidos

```
index.html           → Estructura HTML
styles.css           → Estilos CSS
script.js            → Lógica JavaScript
```

## 🚀 Cómo Usar

### Método 1: Archivos Separados
1. Descarga los 3 archivos: `index.html`, `styles.css`, `script.js`
2. **Ponlos en la MISMA carpeta**
3. Abre `index.html` en el navegador

### Método 2: Servidor Local (Recomendado para desarrollo)
```bash
# Si tienes Python instalado:
python -m http.server

# O con Node.js:
npx http-server

# Luego abre: http://localhost:8000
```

## 📋 Ejemplo de Uso

1. **Paso 1:** Ingresa datos personales
   - Nombre: Juan Pérez
   - Edad: 35
   - Documento: Cédula de Ciudadanía
   - Número: 1234567890

2. **Paso 2:** El sistema valida la edad y muestra el formulario apropiado
   - Salario: 2.500.000
   - Comisiones: 100.000
   - Horas Extra: 150.000
   - Nivel de Riesgo: II (Bajo)

3. **Paso 3:** Ver resultados detallados con desglose de cálculos

## 🧮 Fórmulas Implementadas

### Total Devengado
```
Total Devengado = Salario + Comisiones + Horas Extra
```

### IBC (Ingreso Base de Cotización)
```
IBC = Total Devengado × 70%
(mínimo 1 SMLV)
```

### Deducciones
```
Salud = IBC × 4%
Pensión = IBC × 4%
Fondo Solidaridad = IBC × 1% (si IBC ≥ 4 SMLV)
ARL = IBC × Tarifa por Riesgo
Retención = Según tabla Art. 383
```

### Total a Recibir
```
Total = (Salario + Auxilio) - (Salud + Pensión + Fondo + ARL + Retención)
```

## 🎨 Tarifas ARL Implementadas

| Nivel | Tipo | Tarifa |
|-------|------|--------|
| 1 | Riesgo Mínimo | 0.522% |
| 2 | Riesgo Bajo | 1.044% |
| 3 | Riesgo Medio | 2.436% |
| 4 | Riesgo Alto | 4.350% |
| 5 | Riesgo Máximo | 6.960% |

## 📊 Tabla Retención en la Fuente

Basada en Estatuto Tributario Art. 383:

| Rango UVT | Tarifa | Fórmula |
|-----------|--------|---------|
| 0-95 | 0% | 0 |
| >95-150 | 19% | (UVT - 95) × 19% |
| >150-360 | 28% | (UVT - 150) × 28% + 10 UVT |
| >360-640 | 33% | (UVT - 360) × 33% + 69 UVT |
| >640-945 | 35% | (UVT - 640) × 35% + 162 UVT |
| >945-2300 | 37% | (UVT - 945) × 37% + 268 UVT |
| >2300+ | 39% | (UVT - 2300) × 39% + 770 UVT |

## 🔍 Validaciones Implementadas

✅ Nombre no vacío
✅ Edad entre 0-120 años
✅ Tipo de documento seleccionado
✅ Número de documento solo números
✅ Salario mayor a 0
✅ Nivel de riesgo seleccionado
✅ Mesada pensional mayor a 0 (para pensionados)

## 📝 Estructura del Código

```
HTML (Paso 1, 2, 3)
   ↓
CSS (Estilos profesionales + Responsive)
   ↓
JavaScript
   ├─ CONSTANTES (valores 2026)
   ├─ OBJETO datosUsuario (almacenamiento)
   ├─ Validación Paso 1
   ├─ Validación Paso 2
   ├─ Cálculos
   ├─ Resultados
   └─ Funciones Auxiliares
```

## 🐛 Solución de Problemas

### "No se ve el estilo CSS"
**Solución:** 
- Verifica que `styles.css` esté en la misma carpeta que `index.html`

### "Los botones no funcionan"
**Solución:**
- Asegúrate de que `script.js` esté en la misma carpeta
- Abre la consola (F12) para ver si hay errores

### "El navegador bloquea el archivo"
**Solución:**
- Abre desde un servidor local (no desde `file://`)
- Usa el Método 3 de arriba

## 📚 Referencias Utilizadas

- [Cálculo IBC - UGPP](https://www.ugpp.gov.co/calculadora-ibc)
- [Calculadora Salarial - El Empleo](https://www.elempleo.com/co/calculadora-salarial/)
- [Impuesto a la Renta - Tax Calculator](https://co.talent.com/tax-calculator)

## ✅ Requisitos del Taller Cumplidos

✅ Paso 1: Información básica
✅ Paso 2: Validación de perfil
✅ Paso 3: Información salarial (condicional)
✅ Paso 4: Cálculo de obligaciones laborales
✅ Paso 5: Resultados detallados
✅ Paso 6: Valores y tarifas 2026
✅ HTML correcto
✅ CSS sin animaciones complejas
✅ JavaScript funcional
⭐ Punto Extra: Desglose de fórmulas

## 📞 Soporte

Si encuentras problemas:
1. Abre la consola del navegador (F12)
2. Verifica los mensajes de error
3. Asegúrate de que todos los archivos están en la misma carpeta
4. Intenta con `index_completo.html`

## 📄 Licencia

Proyecto educativo - Universidad el Bosque 2026

---

**Última actualización:** Mayo 2026
**Versión:** 1.0