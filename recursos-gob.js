/* Recursos de la Gobernación de Caldas para atender a los 26 municipios distintos de Manizales.
   Fuente: Plan de Acción Específico (PAE) departamental, distribución preliminar de la inversión por línea estratégica,
   y fuentes de financiación informadas por la Gobernación (noviembre de 2026). Valores en millones de pesos. Cifras preliminares,
   sujetas a ajustes en la estructuración de proyectos, concurrencia de fuentes y validación técnica. */
window.PAE_REC = {
  total: 222500,
  fuentes: [
    ["Empréstito (Ordenanza 1021 de 2026)", 100000, "#0f4a27", "Aprobado por la Asamblea el 18 de noviembre; falta contratarlo con la banca"],
    ["Desahorro del FONPET", 64000, "#2f6fa8", "Recursos ahorrados del Fondo Nacional de Pensiones de las Entidades Territoriales"],
    ["Recursos propios", 37280, "#3d8b57", "Presupuesto departamental"],
    ["FOMAG", 19220, "#6a4fc4", "Recursos de educación destinados a infraestructura educativa"],
    ["INFICaldas", 2000, "#d9822b", "Instituto de Financiamiento, Promoción y Desarrollo de Caldas"]
  ],
  lineas: [
    ["Educación, salud y equipamientos esenciales", 90000, "#2f5fc4"],
    ["Vivienda y hábitat", 55000, "#e0703a"],
    ["Reactivación económica, agro y turismo", 20000, "#c8930a"],
    ["Infraestructura, vías, servicios y geotecnia", 18000, "#3d7d4e"],
    ["Estudios, estructuración, seguimiento y contingencias", 18000, "#8790b0"],
    ["Patrimonio, gestión social y ambiental", 11500, "#6a4fc4"],
    ["Reducción del riesgo y reconstrucción resiliente", 10000, "#c43b4b"]
  ]
};

/* Balance de la Gobernación a noviembre de 2026 (resumen de afectaciones y acciones, Gobernación de Caldas) y contratos
   con cargo al Fondo Departamental de Gestión del Riesgo de Desastres. Valores en millones de pesos. */
window.PAE_REC.fdgrd = { incorporado: 21350, acto: "Ordenanza 1016 de 2026" };
window.PAE_REC.hecho = [
  ["Banco de materiales", 5245.4, "1.259 familias en 26 municipios: contrato inicial de $3.500 M (ejecutado al 99,99 %) y adición de $1.745 M", "En ejecución"],
  ["29 viviendas rurales nuevas", 1926.7, "San José 11, Belalcázar 7, Viterbo 5, Neira 4 y Manzanares 2 (BPID AMB-E-260098). Aparte, Grupo Argos construye 10 en Neira (Adopta un Hogar) y 90 más en 2027", "En adjudicación"],
  ["Kits alimentarios y de aseo", 1325, "6.400 familias afectadas; en recepción en el Centro Logístico Humanitario para distribuir con las alcaldías", "Contratado"],
  ["Subsidios de arrendamiento", 1108.5, "1.354 subsidios en 17 municipios, para familias con vivienda destruida o no habitable", "Transferido a los municipios"],
  ["Estudios y diseños de infraestructura educativa", 985, "Soluciones definitivas para sedes afectadas, entre ellas San José y Belalcázar", "Contratado"],
  ["Centro de la Música y las Artes", 175.7, "Primeros auxilios y mejoramiento", "Convenio"],
  ["Centro Cultural ANGASKA", 110, "Primeros auxilios y mejoramiento", "Convenio"],
  ["Plaza de mercado de Riosucio", 90.8, "Estudio de vulnerabilidad sísmica", "Convenio"]
];
window.PAE_REC.ungrd = { convenio: 20288.6, corte: "30 de octubre de 2026", programados: [3827, 3647.3], cobrados: [3111, 2946.0], pendientes: [716, 701.3], efectividad: 81,
  tarifas: [["Categorías 1, 2 y distritos especiales", "60 %", "$1.050.543"], ["Categorías 3 y 4", "50 %", "$875.452"], ["Categorías 5 y 6", "45 %", "$787.907"]] };
