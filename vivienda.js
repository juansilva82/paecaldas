/* Balance de vivienda y demoliciones · Secretaría de Vivienda y Territorio de la Gobernación de Caldas.
   Informe al Fondo Milagro (noviembre de 2026) y oficio S.V 1198 (17-nov-2026). Valores en millones de pesos.
   Cubre los 26 municipios distintos de Manizales (que atiende su emergencia de forma independiente) y el proyecto
   Reserva Santa María de la Gobernación en Manizales. */
window.PAE_VIV = {
  corte: "2026-11-17",
  fuente: "Secretaría de Vivienda y Territorio de la Gobernación de Caldas · balance de vivienda y demoliciones remitido al Fondo Milagro (noviembre de 2026) y oficio S.V 1198",
  necesidadTotal: 407721.8, pendienteTotal: 354926.7,
  comp: [
    { k: "rural", t: "Vivienda nueva rural", d: "Viviendas rurales destruidas", u: 663, at: 529, pe: 134, nec: 66168.5, pen: 13373.4, vu: 99.801585 },
    { k: "urb", t: "Vivienda nueva urbana · 26 municipios", d: "Viviendas urbanas destruidas", u: 821, at: 0, pe: 821, nec: 86249.6, pen: 86249.6, vu: 105.0543 },
    { k: "sm", t: "Reserva Santa María · Manizales", d: "Apartamentos en lote de la Gobernación, en fiducia y con estudios y diseños", u: 680, at: 0, pe: 680, nec: 160733.1, pen: 160733.1, vu: 236.372175 },
    { k: "mej", t: "Mejoramiento de vivienda · 26 municipios", d: "Viviendas averiadas que se pueden recuperar", u: 10495, at: 1262, pe: 9233, nec: 94570.6, pen: 94570.6, alt: 60000 }
  ],
  rural: [["Empréstito departamental (Ordenanza 1021 de 2026)", 400], ["Fundación Grupo Argos", 100], ["Departamento de Caldas (en contratación)", 29], ["Pendientes de financiación", 134]],
  lotes: [
    ["Viterbo", "Patrimonio autónomo", "Lote transferido a fiducia", 110, 11556.0, "inmediato"],
    ["Pácora", "Patrimonio autónomo", "Lote transferido a fiducia", 40, 4202.2, "inmediato"],
    ["Neira", "Lotes disponibles", "Viviendas bifamiliares y en altura", 48, 5042.6, "corto"],
    ["San José", "Lote disponible", "Lote disponible", 34, 3571.8, "corto"],
    ["Aranzazu", "Lote disponible", "Lote disponible", 30, 3151.6, "corto"],
    ["Risaralda", "Lote disponible", "Lote disponible", 20, 2101.1, "corto"]
  ],
  sinLote: 539,
  bancoInicial: { familias: 1262, valor: 5245.4 },
  /* [municipio, total, urbanas, rurales, total demolición, parcial, por definir, prioridad crítica o alta (null = sin dato), ya demolidas] */
  dem: [
    ["San José", 105, 37, 68, 0, 0, 105, 96, 0], ["Palestina", 59, 8, 51, 0, 0, 59, null, 0], ["Viterbo", 49, 48, 1, 29, 6, 14, null, 2],
    ["Villamaría", 45, 27, 18, 45, 0, 0, 45, 2], ["Aguadas", 44, 6, 38, 25, 19, 0, 44, 0], ["Belalcázar", 37, 29, 8, 2, 8, 27, 37, 2],
    ["Anserma", 24, 4, 20, 19, 4, 1, 22, 0], ["Pensilvania", 14, 9, 5, 14, 0, 0, 14, 0], ["Pácora", 8, 2, 6, 7, 1, 0, 7, 1],
    ["Riosucio", 5, 3, 2, 5, 0, 0, 5, 0], ["Marulanda", 2, 2, 0, 2, 0, 0, 1, 1], ["Victoria", 1, 0, 1, 0, 1, 0, 0, 0]
  ],
  usos: [["Viviendas", 374, "En los 12 municipios"], ["Edificios multifamiliares", 6, "Villamaría (4, cerca de 64 apartamentos) y Riosucio (2)"], ["Escuelas", 7, "Anserma (6) y Riosucio (1)"], ["Institucionales", 4, "Viterbo (iglesia, Edificio Sorrento y Hotel María Alejandra) y Belalcázar (estación de bomberos)"], ["Comercio", 2, "Viterbo"]],
  /* Cruce con el empréstito: Ordenanza 1021 de 2026 (Asamblea de Caldas). Valores de los proyectos según la ordenanza y el banco del equipo estructurador. */
  emp: {
    cupo: 100000, fecha: "19 de noviembre de 2026",
    comp: [
      ["Vivienda nueva rural", 13373.4, true, "$40.000 M para 400 de las 663 casas; con Grupo Argos (100) y el Departamento (29) quedan 134 pendientes"],
      ["Vivienda nueva urbana · 26 municipios", 86249.6, false, "Sin línea en el empréstito"],
      ["Reserva Santa María · Manizales", 160733.1, false, "Sin línea en el empréstito"],
      ["Mejoramiento de vivienda", 94570.6, false, "Sin línea en el empréstito"],
      ["Demoliciones (393 edificaciones)", null, false, "Sin línea en el empréstito"]
    ],
    /* [municipio, [[proyecto, valor, marca]]] — solo municipios del inventario de demoliciones con proyectos en el empréstito */
    mun: [
      ["San José", [["CDI «Construyendo Sueños»", 6333], ["Estación de Bomberos", 4599]]],
      ["Palestina", [["Ampliación del CDI «Huellitas» (corregimiento de Arauca)", 3174]]],
      ["Viterbo", [["Urgencias y hospitalización de la ESE Hospital", 8618]]],
      ["Aguadas", [["Estación de Bomberos", 6570]]],
      ["Belalcázar", [["Estación de Bomberos", 5125, "su estación actual está en la lista de demoliciones"]]],
      ["Pácora", [["Reposición del Hospital Santa Teresita", 27845]]],
      ["Victoria", [["Centro de Integración para la Primera Infancia", 5718]]]
    ],
    nota: "Villamaría, Anserma, Pensilvania, Riosucio y Marulanda tienen demoliciones pero no proyectos en el empréstito. Las 7 escuelas por demoler (Anserma y Riosucio) tampoco tienen línea en él. El informe de la Secretaría describe el empréstito como «en trámite»; la Asamblea ya lo aprobó con la Ordenanza 1021."
  },
  valoresDem: [["Villamaría", "1 de 45", "$1.711 millones", "Edificio Caracoles de Colores (22 apartamentos)"], ["Belalcázar", "37 de 37", "$1.110 a $1.850 millones", "Entre $30 y $50 millones por inmueble"], ["Pensilvania", "14 de 14", "$52 millones", "Cerca de $50.000 por m²"], ["Pácora", "1 de 8", "$38 millones", "Vivienda urbana"]]
};
