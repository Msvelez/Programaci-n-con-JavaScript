/*
    SIMULADOR DE PAGO DE PRESTACIONES LABORALES
    Universidad el Bosque - Programa de Creación Digital
    Autor: María Sofía Vélez Arrubla
    Fecha: 2026
*/


// constantes y valores fijos para 2026 //

const constantes = {
    // valores de referencia para 2026 en colombia
    salario_minimo: 1750905,
    salario_minimo_integral: 22761765,
    subsidio_transporte: 249095,
    uvt: 52.37,
    
    // límites de edad para validación
    edad_minima: 18,
    edad_beneficiario: 25,
    edad_jubilacion: 60,
    
    // porcentajes de cotización
    porcentaje_salud: 0.04,
    porcentaje_pension: 0.04,
    porcentaje_fondo_solidaridad: 0.01,
    porcentaje_ibc: 0.70,
    
    // tarifas arl según nivel de riesgo
    tarifas_arl: {
        1: 0.00522,  // riesgo mínimo
        2: 0.01044,  // riesgo bajo
        3: 0.02436,  // riesgo medio
        4: 0.04350,  // riesgo alto
        5: 0.06960   // riesgo máximo
    },
    
    // tabla de retención en la fuente (uvt)
    retencion_fuente: [
        { desde: 0, hasta: 95, tarifa: 0, base: 0 },
        { desde: 95, hasta: 150, tarifa: 0.19, base: 0 },
        { desde: 150, hasta: 360, tarifa: 0.28, base: 10 },
        { desde: 360, hasta: 640, tarifa: 0.33, base: 69 },
        { desde: 640, hasta: 945, tarifa: 0.35, base: 162 },
        { desde: 945, hasta: 2300, tarifa: 0.37, base: 268 },
        { desde: 2300, hasta: Infinity, tarifa: 0.39, base: 770 }
    ]
};

// objeto para almacenar datos del usuario //

let datos_usuario = {
    // información básica
    nombre_completo: '',
    edad: 0,
    tipo_documento: '',
    numero_documento: '',
    
    // información salarial
    salario: 0,
    comisiones: 0,
    horas_extra: 0,
    mesada_pensional: 0,
    nivel_riesgo: 0,
    
    // perfil determinado
    perfil: '',
    
    // cálculos
    total_devengado: 0,
    auxilio_transporte: 0,
    ibc: 0,
    salud: 0,
    pension: 0,
    fondo_solidaridad: 0,
    arl: 0,
    retencion: 0,
    total_deducciones: 0,
    total_recibir: 0
};

// funciones de validación - paso 1 // 

function validarPaso1() {
    // obtener valores del formulario
    datos_usuario.nombre_completo = document.getElementById('nombreCompleto').value.trim();
    datos_usuario.edad = parseInt(document.getElementById('edad').value);
    datos_usuario.tipo_documento = document.getElementById('tipoDocumento').value;
    datos_usuario.numero_documento = document.getElementById('numeroDocumento').value.trim();
    
    // validaciones básicas
    if (!datos_usuario.nombre_completo) {
        mostrarError('Por favor ingrese su nombre completo.');
        return;
    }
    
    if (isNaN(datos_usuario.edad) || datos_usuario.edad < 0 || datos_usuario.edad > 120) {
        mostrarError('Por favor ingrese una edad válida.');
        return;
    }
    
    if (!datos_usuario.tipo_documento) {
        mostrarError('Por favor seleccione un tipo de documento.');
        return;
    }
    
    // Condición !/^[0-9]+$/.test(...) verifica que el número de documento solo contenga dígitos numéricos, sin espacios ni caracteres especiales. //
    if (!datos_usuario.numero_documento || !/^[0-9]+$/.test(datos_usuario.numero_documento)) {
        mostrarError('Por favor ingrese un número de documento válido (solo números).');
        return;
    }
    
    // si todas las validaciones pasan, ir al paso 2
    irAPaso2();
}

// funciones de validación - paso 2 // 

function irAPaso2() {
    // ocultar paso 1, mostrar paso 2
    document.getElementById('paso1').style.display = 'none';
    document.getElementById('paso2').style.display = 'block';
    
    // validar perfil según edad
    const resultado_validacion = validarPerfil(datos_usuario.edad);
    datos_usuario.perfil = resultado_validacion.tipo;
    
    // mostrar mensaje de validación
    const mensaje_perfil = document.getElementById('mensajePerfil');
    
    if (resultado_validacion.continuar) {
        if (resultado_validacion.tipo === 'pensionado') {
            mensaje_perfil.className = 'mensaje mensaje-exito';
            mensaje_perfil.innerHTML = `
                <strong>✓ Perfil: Pensionado</strong><br>
                Solo se calculará el pago de la pensión sobre su mesada pensional.
            `;
            // mostrar formulario para pensionados
            document.getElementById('formPaso2Adulto').style.display = 'none';
            document.getElementById('formPaso2Pensionado').style.display = 'block';
        } else {
            mensaje_perfil.className = 'mensaje mensaje-exito';
            mensaje_perfil.innerHTML = '<strong>✓ Validación exitosa:</strong> Puede continuar con el siguiente paso del proceso.';
            // mostrar formulario para adultos
            document.getElementById('formPaso2Adulto').style.display = 'block';
            document.getElementById('formPaso2Pensionado').style.display = 'none';
        }
    } else {
        mensaje_perfil.className = 'mensaje mensaje-advertencia';
        
        if (datos_usuario.edad < 18) {
            mensaje_perfil.innerHTML = `
                <strong>✗ No es posible continuar</strong><br>
                El usuario es menor de edad. No se pueden calcular prestaciones de ley.
            `;
        } else if (datos_usuario.edad < 25) {
            mensaje_perfil.innerHTML = `
                <strong>✗ Usuario Beneficiario por Cotizante</strong><br>
                No se puede continuar al siguiente paso del proceso.
            `;
        }
        
        // deshabilitar formularios
        document.getElementById('formPaso2Adulto').style.display = 'none';
        document.getElementById('formPaso2Pensionado').style.display = 'none';
    }
}

function validarPerfil(edad) {
    if (edad < constantes.edad_minima) {
        return { continuar: false, tipo: 'menor' };
    } else if (edad < constantes.edad_beneficiario) {
        return { continuar: false, tipo: 'beneficiario' };
    } else if (edad >= constantes.edad_jubilacion) {
        return { continuar: true, tipo: 'pensionado' };
    } else {
        return { continuar: true, tipo: 'empleado' };
    }
}

// funciones de cálculo //

function calcularOblaciones() {
    // obtener valores del formulario para adultos
    datos_usuario.salario = parseFloat(document.getElementById('salario').value) || 0;
    datos_usuario.comisiones = parseFloat(document.getElementById('comisiones').value) || 0;
    datos_usuario.horas_extra = parseFloat(document.getElementById('horasExtra').value) || 0;
    datos_usuario.nivel_riesgo = parseInt(document.getElementById('nivelRiesgo').value);
    
    // validaciones
    if (datos_usuario.salario <= 0) {
        mostrarError('Por favor ingrese un salario válido.');
        return;
    }
    
    if (!datos_usuario.nivel_riesgo) {
        mostrarError('Por favor seleccione un nivel de riesgo.');
        return;
    }
    
    // realizar cálculos
    realizarCalculos();
    
    // ir al paso 3 para mostrar resultados
    irAPaso3();
}

function calcularPensionado() {
    datos_usuario.mesada_pensional = parseFloat(document.getElementById('mesadaPensional').value) || 0;
    
    if (datos_usuario.mesada_pensional <= 0) {
        mostrarError('Por favor ingrese una mesada pensional válida.');
        return;
    }
    
    // para pensionados, solo se calcula pensión
    datos_usuario.ibc = datos_usuario.mesada_pensional * constantes.porcentaje_ibc;
    datos_usuario.pension = datos_usuario.ibc * constantes.porcentaje_pension;
    datos_usuario.total_deducciones = datos_usuario.pension;
    datos_usuario.total_recibir = datos_usuario.mesada_pensional - datos_usuario.total_deducciones;
    
    // ir al paso 3 para mostrar resultados
    irAPaso3();
}

function realizarCalculos() {
    // 1. calcular total devengado
    datos_usuario.total_devengado = datos_usuario.salario + datos_usuario.comisiones + datos_usuario.horas_extra;
    
    // 2. calcular auxilio de transporte
    // se aplica si el salario es <= 2 smlv
    if (datos_usuario.salario <= (2 * constantes.salario_minimo)) {
        datos_usuario.auxilio_transporte = constantes.subsidio_transporte;
    } else {
        datos_usuario.auxilio_transporte = 0;
    }
    
    // 3. calcular ibc (70% del total devengado, sin incluir auxilio de transporte)
    datos_usuario.ibc = datos_usuario.total_devengado * constantes.porcentaje_ibc;
    
    // el ibc no puede ser inferior a 1 smlv
    if (datos_usuario.ibc < constantes.salario_minimo) {
        datos_usuario.ibc = constantes.salario_minimo;
    }
    
    // 4. calcular salud (4% sobre ibc)
    datos_usuario.salud = datos_usuario.ibc * constantes.porcentaje_salud;
    
    // 5. calcular pensión (4% sobre ibc)
    datos_usuario.pension = datos_usuario.ibc * constantes.porcentaje_pension;
    
    // 6. calcular fondo de solidaridad pensional (1% si ibc >= 4 smlv)
    if (datos_usuario.ibc >= (4 * constantes.salario_minimo)) {
        datos_usuario.fondo_solidaridad = datos_usuario.ibc * constantes.porcentaje_fondo_solidaridad;
    } else {
        datos_usuario.fondo_solidaridad = 0;
    }
    
    // 7. calcular arl según nivel de riesgo
    const tarifa_arl = constantes.tarifas_arl[datos_usuario.nivel_riesgo] || 0;
    datos_usuario.arl = datos_usuario.ibc * tarifa_arl;
    
    // 8. calcular retención en la fuente
    datos_usuario.retencion = calcularRetencionEnLaFuente(datos_usuario.ibc);
    
    // 9. calcular total de deducciones
    datos_usuario.total_deducciones = 
        datos_usuario.salud + 
        datos_usuario.pension + 
        datos_usuario.fondo_solidaridad + 
        datos_usuario.arl + 
        datos_usuario.retencion;
    
    // 10. calcular total a recibir
    const total_ingresos = datos_usuario.total_devengado + datos_usuario.auxilio_transporte;
    datos_usuario.total_recibir = total_ingresos - datos_usuario.total_deducciones;
}

function calcularRetencionEnLaFuente(ibc) {
    // convertir ibc a uvt
    const ibc_en_uvt = ibc / constantes.uvt;
    
    // encontrar el rango aplicable
    let retencion = 0;
    
    for (let rango of constantes.retencion_fuente) {
        if (ibc_en_uvt > rango.desde && ibc_en_uvt <= rango.hasta) {
            if (rango.tarifa === 0) {
                retencion = 0;
            } else {
                const base_gravada = ibc_en_uvt - rango.desde;
                retencion = (base_gravada * rango.tarifa + rango.base) * constantes.uvt;
            }
            break;
        }
    }
    
    return retencion;
}

// funciones para mostrar resultados //

function irAPaso3() {
    // ocultar paso 2, mostrar paso 3
    document.getElementById('paso2').style.display = 'none';
    document.getElementById('paso3').style.display = 'block';
    
    // rellenar información personal
    document.getElementById('resNombre').textContent = datos_usuario.nombre_completo;
    document.getElementById('resEdad').textContent = datos_usuario.edad;
    document.getElementById('resDocumento').textContent = datos_usuario.tipo_documento + ' - ' + datos_usuario.numero_documento;
    
    const perfil_texto = datos_usuario.perfil === 'pensionado' ? 'Pensionado' : 'Empleado';
    document.getElementById('resPerfil').textContent = perfil_texto;
    
    // rellenar ingresos
    document.getElementById('resSalario').textContent = formatoMoneda(datos_usuario.salario);
    document.getElementById('resComisiones').textContent = formatoMoneda(datos_usuario.comisiones);
    document.getElementById('resHorasExtra').textContent = formatoMoneda(datos_usuario.horas_extra);
    document.getElementById('resAuxilioTransporte').textContent = formatoMoneda(datos_usuario.auxilio_transporte);
    
    const total_devengado_con_auxilio = datos_usuario.total_devengado + datos_usuario.auxilio_transporte;
    document.getElementById('resTotalDevengado').textContent = formatoMoneda(total_devengado_con_auxilio);
    document.getElementById('resIBC').textContent = formatoMoneda(datos_usuario.ibc);
    
    // rellenar deducciones
    document.getElementById('resSalud').textContent = formatoMoneda(datos_usuario.salud);
    document.getElementById('resPension').textContent = formatoMoneda(datos_usuario.pension);
    document.getElementById('resFondoSolidaridad').textContent = formatoMoneda(datos_usuario.fondo_solidaridad);
    document.getElementById('resARL').textContent = formatoMoneda(datos_usuario.arl);
    document.getElementById('resRetencion').textContent = formatoMoneda(datos_usuario.retencion);
    document.getElementById('resTotalDeducciones').textContent = formatoMoneda(datos_usuario.total_deducciones);
    
    // rellenar total final
    document.getElementById('resTotal').textContent = formatoMoneda(datos_usuario.total_recibir);
    
    // mostrar desglose de fórmula
    mostrarDesgloseFormula();
    
    // scroll al área de resultados
    document.getElementById('paso3').scrollIntoView({ behavior: 'smooth' });
}

function mostrarDesgloseFormula() {
    let desglose = 'DESGLOSE DE CÁLCULOS:\n\n';
    
    desglose += '1. TOTAL DEVENGADO:\n';
    desglose += `   Salario + Comisiones + Horas Extra\n`;
    desglose += `   ${formatoMoneda(datos_usuario.salario)} + ${formatoMoneda(datos_usuario.comisiones)} + ${formatoMoneda(datos_usuario.horas_extra)} = ${formatoMoneda(datos_usuario.total_devengado)}\n\n`;
    
    desglose += '2. INGRESO BASE DE COTIZACIÓN (IBC):\n';
    desglose += `   70% del Total Devengado\n`;
    desglose += `   ${formatoMoneda(datos_usuario.total_devengado)} × 0.70 = ${formatoMoneda(datos_usuario.ibc)}\n\n`;
    
    desglose += '3. DEDUCCIONES:\n';
    desglose += `   Salud (4% IBC):            ${formatoMoneda(datos_usuario.salud)}\n`;
    desglose += `   Pensión (4% IBC):          ${formatoMoneda(datos_usuario.pension)}\n`;
    desglose += `   Fondo Solidaridad (1%):    ${formatoMoneda(datos_usuario.fondo_solidaridad)}\n`;
    desglose += `   ARL (${datos_usuario.nivel_riesgo}% IBC):            ${formatoMoneda(datos_usuario.arl)}\n`;
    desglose += `   Retención en la Fuente:    ${formatoMoneda(datos_usuario.retencion)}\n`;
    desglose += `   ────────────────────────────────────\n`;
    desglose += `   TOTAL DEDUCCIONES:         ${formatoMoneda(datos_usuario.total_deducciones)}\n\n`;
    
    const total_ingresos = datos_usuario.total_devengado + datos_usuario.auxilio_transporte;
    desglose += '4. RESUMEN FINAL:\n';
    desglose += `   Ingresos (con auxilio):    ${formatoMoneda(total_ingresos)}\n`;
    desglose += `   - Deducciones:             ${formatoMoneda(datos_usuario.total_deducciones)}\n`;
    desglose += `   ════════════════════════════════════════\n`;
    desglose += `   TOTAL A RECIBIR:           ${formatoMoneda(datos_usuario.total_recibir)}`;
    
    document.getElementById('desgloseFormula').textContent = desglose;
}


// funciones auxiliares y de navegación //

function formatoMoneda(numero) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(numero);
}

function mostrarError(mensaje) {
    const contenedor = document.getElementById('seccionMensajes');
    contenedor.innerHTML = `
        <div class="mensaje mensaje-error">
            <strong>⚠ Error:</strong> ${mensaje}
        </div>
    `;
    contenedor.scrollIntoView({ behavior: 'smooth' });
}

function volverPaso1() {
    // limpiar formulario
    document.getElementById('formPaso1').reset();
    document.getElementById('seccionMensajes').innerHTML = '';
    
    // mostrar paso 1, ocultar los demás
    document.getElementById('paso1').style.display = 'block';
    document.getElementById('paso2').style.display = 'none';
    document.getElementById('paso3').style.display = 'none';
    
    // scroll al inicio
    document.getElementById('paso1').scrollIntoView({ behavior: 'smooth' });
}

function nuevoCalculo() {
    // resetear objeto datos usuario
    datos_usuario = {
        nombre_completo: '',
        edad: 0,
        tipo_documento: '',
        numero_documento: '',
        salario: 0,
        comisiones: 0,
        horas_extra: 0,
        mesada_pensional: 0,
        nivel_riesgo: 0,
        perfil: '',
        total_devengado: 0,
        auxilio_transporte: 0,
        ibc: 0,
        salud: 0,
        pension: 0,
        fondo_solidaridad: 0,
        arl: 0,
        retencion: 0,
        total_deducciones: 0,
        total_recibir: 0
    };
    
    // volver al paso 1
    volverPaso1();
}

// inicialización //

document.addEventListener('DOMContentLoaded', function() {
    console.log('Simulador de Nómina cargado correctamente');
});
