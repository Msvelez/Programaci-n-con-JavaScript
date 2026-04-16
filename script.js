
// Ingreso de información básica 
let nombreCompleto = "";
let edad = 0;
let tipoDocumento = "";
let numeroDocumento = "";

// Variables de entrada
let salario = 0;
let mesadaPensional = 0;
let clasificacion = ""; 
let pagoPension = 0;
let prestacionesLey = 0;

// Valores fijos
const edad_minima = 18;
const edad_maxima_beneficio = 25;
const edad_jubilacion = 60;

// Valores y Tarifas en Colombia para 2026
const salario_minimo = 1750905;
const salario_minimo_integral_vigente = 22761765;
const subsidio_transporte = 249.095;
const uvt = 52.37;

// Ingreso de información salarial
const comisiones = 0;
const total_horas_extra = 0;
const clasificacion_nivel_de_riesgo = 0;

// Tarifas de ARL (IBC)
const riesgo_uno_minimo = 0.522;
const riesgo_dos_bajo = 1.044;
const riesgo_tres_medio = 2.436;
const riesgo_cuatro_alto = 4.350;
const riesgo_cinco_maximo = 6.960;

// Lógica de cálculo de nómina
// 1. Calcular El Total Devengado es salario + comisiones = horas extra
// El subsidio de transporte no entra en el cálculo de IBC 
let totalDevengado = salario + comisiones + total_horas_extras;
// Cálculo del IBC
let ibc = totalDevengado * 0.70;

// Salud y pensión, que es el 4% de cada uno sobre el IBC
let salud = ibc * 0.04;
let pension = ibc * 0.04;

// Validación de perfil
// Regla a: Menor de edad
if (edad < 18) {
    console.log("No es posible continuar: El usuario es menor de edad.");

}

// Regla b: Menor de 25
else if (edad < 25) {
    console.log("Usuario beneficiario por cotizante. No se puede continuar al siguiente paso.");

}

//Regla c: 60 años o más
else if (edad>= 60) {
    console.log("Perfil: Pensionado. Solo se calculará el pago de la pensión sobre la mesada pensional.")

}

//Regla d: No cumple ninguna de las anteriores (Adulto entre 25 y 59 años)
else {
console.log("Validación exitosa: Puede continuar con el siguiente paso del proceso.");
// Aquí dentro iría el resto de tus cálculos de obligaciones
    // (ARL, Salud, Pensión, etc.)
}



// Fondo salario pensional, se paga 1% adicional si el IBC >= 4 SMMLV
// Usamos el operador ? para escribir if-else condición ? expresión_si_es_verdadero : expresión_si_es_falso, entonces 
// si el IBC es mayor o igual a cuatro salarios mínimos, entonces se calcula el 1% del IBC, de lo contrario, su valor es 0
let fondoSolidaridad = (ibc <= (4 * salario_minimo)) ? (ibc * 0.01) : 0;

// Funciones
function validarPerfil(edad) {
    if (edad < 18) {
        return { continuar: false, mensaje: "Menor de edad" };

    }