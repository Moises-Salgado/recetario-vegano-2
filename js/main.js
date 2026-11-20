/* Recetario Vegano · sitio estático para GitHub Pages
   Sin dependencias: todo el paisaje y los platos se dibujan con SVG desde este archivo.
   Los textos editables están en CONTENT. */
(function () {
  'use strict';

  /* ================= Íconos ================= */
  const PLUS = 'M12 5v14M5 12h14', CHECK = 'M5 12.5l4.5 4.5L19 7.5';
  const HEART = 'M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z';
  const XMARK = 'M6 6l12 12M18 6L6 18';
  const STAR = 'M8 1.4L9.65 5.73L14.28 5.96L10.66 8.87L11.88 13.34L8 10.8L4.12 13.34L5.34 8.87L1.72 5.96L6.35 5.73Z';
  const ICON = {
    sunrise: 'M3 17h18M6.5 17a5.5 5.5 0 0 1 11 0M12 5.5v3M5 9.8l2 1.5M19 9.8l-2 1.5M8.5 20.5h7',
    sun: 'M12 8a4 4 0 1 0 0 8a4 4 0 0 0 0-8zM12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8',
    cup: 'M4.5 10h11v3.5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM15.5 11h1.2a2.4 2.4 0 0 1 0 4.8h-1.5M8 3.5c-.8 1 .8 2 0 3M12 3.5c-.8 1 .8 2 0 3',
    moon: 'M21 12.8A9 9 0 1 1 11.2 3A7 7 0 0 0 21 12.8z'
  };
  const TAGS = {
    gluten: { label: 'Con gluten', icon: 'M8 14.6V3.2M8 6.6C6.4 6.4 5.3 5.3 5.1 3.7 6.7 3.9 7.8 5 8 6.6zM8 6.6c1.6-.2 2.7-1.3 2.9-2.9C9.3 3.9 8.2 5 8 6.6zM8 9.6C6.4 9.4 5.3 8.3 5.1 6.7 6.7 6.9 7.8 8 8 9.6zM8 9.6c1.6-.2 2.7-1.3 2.9-2.9C9.3 6.9 8.2 8 8 9.6zM8 12.6C6.4 12.4 5.3 11.3 5.1 9.7 6.7 9.9 7.8 11 8 12.6zM8 12.6c1.6-.2 2.7-1.3 2.9-2.9-1.6.2-2.7 1.3-2.9 2.9z' },
    picante: { label: 'Picante', icon: 'M3.4 13.2c4.6.6 8.4-2.6 9-7.4.1-1.1-.7-1.9-1.7-1.9-1 0-1.6.7-1.8 1.6-.6 3-2.9 5.6-5.5 7.7zM10.7 3.9c0-1.2.7-2 1.9-2.3' },
    proteina: { label: 'Alta en proteína', icon: 'M5.4 3.2c2.1-1 4.8-.4 6.2 1.3 1.6 2 1.8 4.9.4 7-1.5 2.2-4.5 2.8-6.7 1.4-1.2-.8-1.4-2.1-.6-3.2.6-.9.6-1.9-.1-2.8-1.1-1.4-.6-3 .8-3.7zM9.4 6.3c.6.6.9 1.5.7 2.4' },
    azucar: { label: 'Alta en azúcar', icon: 'M8 2.2l5.2 2.6v6.4L8 13.8l-5.2-2.6V4.8zM2.8 4.8L8 7.4l5.2-2.6M8 7.4v6.4' },
    soya: { label: 'Con soya', icon: 'M2.4 12.6c3 1.4 7.4.7 9.8-2.4 1.6-2 2-4.6 1.6-7-2.2.4-4 1.6-5.4 3.2-2 2.3-3.6 4.6-6 6.2zM11.1 5.6a1.1 1.1 0 1 0 .01 0M8.8 8.2a1.1 1.1 0 1 0 .01 0M6.3 10.4a1.1 1.1 0 1 0 .01 0' }
  };

  /* ================= Textos editables ================= */
  const CONTENT = {
    marca: 'Recetario Vegano',
    titulo: 'Recetario Vegano',
    momentos: [
      { id: 'desayuno', nombre: 'Desayuno', hora: '07:00', icono: ICON.sunrise, cielo: 'linear-gradient(180deg, #f2a77c 0%, #f9cf9c 55%, #fde9c8 100%)', acento: '#E8915A', noche: false },
      { id: 'almuerzo', nombre: 'Almuerzo', hora: '13:00', icono: ICON.sun, cielo: 'linear-gradient(180deg, #3f7fae 0%, #74aad3 55%, #a9d2ea 100%)', acento: '#3f7fae', noche: false },
      { id: 'once', nombre: 'Once', hora: '17:30', icono: ICON.cup, cielo: 'linear-gradient(180deg, #d9773f 0%, #eea463 50%, #f7cf95 100%)', acento: '#D9783F', noche: false },
      { id: 'cena', nombre: 'Cena', hora: '20:30', icono: ICON.moon, cielo: 'linear-gradient(180deg, #121a3d 0%, #24336b 60%, #3a4b8c 100%)', acento: '#2B3A78', noche: true }
    ],
    recetas: [
      { id: 'd1', momento: 'desayuno', nombre: 'Avena con frutillas', tipo: 'rapida', tiempo: '10 min', porciones: '1 porción', tags: ['gluten'], rec: true,
        desc: 'Avena cocida en leche vegetal con frutillas de temporada, plátano y canela. Cremosa y sin azúcar añadida.',
        ingredientes: ['½ taza de avena', '1 taza de leche vegetal', '1 plátano', '5 frutillas', '1 cucharadita de semillas de chía', 'Canela a gusto'],
        pasos: ['Calienta la leche vegetal con la avena a fuego medio, revolviendo, por 5 minutos.', 'Agrega la mitad del plátano molido y la canela, y cocina 2 minutos más hasta que espese.', 'Sirve con el resto del plátano en rodajas y las frutillas en mitades.', 'Termina con las semillas de chía.'] },
      { id: 'd2', momento: 'desayuno', nombre: 'Tofu revuelto con espinaca', corto: 'Tofu revuelto', tipo: 'rapida', tiempo: '15 min', porciones: '2 porciones', tags: ['soya', 'proteina'],
        desc: 'Tofu firme desmenuzado en sartén con cebolla, cúrcuma y espinaca. Sale como un revuelto y acompaña bien una tostada.',
        ingredientes: ['250 g de tofu firme', '1 taza de espinaca', '½ cebolla picada', '6 tomates cherry', '½ cucharadita de cúrcuma', '1 cucharada de aceite', 'Sal y pimienta'],
        pasos: ['Sofríe la cebolla en el aceite por 3 minutos.', 'Desmenuza el tofu con las manos sobre el sartén y agrega la cúrcuma, sal y pimienta.', 'Cocina 5 minutos revolviendo, hasta que se dore un poco.', 'Suma la espinaca y los tomates en mitades, y apaga cuando la espinaca se marchite.'] },
      { id: 'd3', momento: 'desayuno', nombre: 'Panqueques de plátano', tipo: 'elaborada', tiempo: '30 min', porciones: '2 porciones', tags: ['gluten', 'azucar'],
        desc: 'Masa de harina, plátano maduro y leche vegetal, cocida en sartén y servida con salsa de frutillas. Para un desayuno sin apuro.',
        ingredientes: ['1 taza de harina', '1 plátano maduro', '1 taza de leche vegetal', '1 cucharadita de polvos de hornear', '1 cucharada de azúcar', '1 taza de frutillas', 'Aceite para el sartén'],
        pasos: ['Muele el plátano y mézclalo con la leche, el azúcar, la harina y los polvos de hornear hasta tener una masa lisa.', 'Calienta un sartén con unas gotas de aceite y vierte un cuarto de taza de masa por panqueque.', 'Cocina 2 minutos por lado, hasta que se doren.', 'Para la salsa, cocina las frutillas picadas 5 minutos con una cucharada de agua y sirve encima.'] },
      { id: 'a1', momento: 'almuerzo', nombre: 'Porotos con riendas', tipo: 'elaborada', tiempo: '60 min', porciones: '4 porciones', tags: ['gluten', 'proteina'], rec: true,
        desc: 'El clásico chileno: porotos con zapallo, tallarines y sofrito con ají de color, sin nada de origen animal.',
        ingredientes: ['2 tazas de porotos remojados la noche anterior', '300 g de zapallo en cubos', '100 g de tallarines', '1 cebolla', '1 diente de ajo', '1 cucharadita de ají de color', '1 cucharadita de orégano', 'Sal y aceite'],
        pasos: ['Cuece los porotos en agua sin sal por unos 40 minutos, hasta que estén blandos.', 'Prepara un sofrito con la cebolla, el ajo, el ají de color y el orégano.', 'Agrega el sofrito y el zapallo a los porotos y cocina 15 minutos, hasta que el zapallo se deshaga un poco.', 'Suma los tallarines quebrados, sala y cocina hasta que estén listos, revolviendo para que no se peguen.'] },
      { id: 'a2', momento: 'almuerzo', nombre: 'Charquicán de soya', tipo: 'elaborada', tiempo: '40 min', porciones: '4 porciones', tags: ['soya', 'proteina'],
        desc: 'Papa, zapallo, choclo y arvejas con soya texturizada, y una ensalada chilena al lado. El guiso de siempre, en versión vegana.',
        ingredientes: ['1 taza de soya texturizada', '4 papas', '300 g de zapallo', '1 taza de choclo', '½ taza de arvejas', '1 cebolla', '1 cucharadita de comino y ají de color', 'Sal y aceite'],
        pasos: ['Hidrata la soya en agua caliente con sal por 10 minutos y estrújala.', 'Sofríe la cebolla con el comino y el ají de color; agrega la soya y dórala 5 minutos.', 'Cuece las papas y el zapallo en cubos hasta que estén blandos y muélelos un poco, dejando trozos.', 'Mezcla todo con el choclo y las arvejas, cocina 5 minutos más y sirve con ensalada chilena.'] },
      { id: 'a3', momento: 'almuerzo', nombre: 'Ensalada de quinoa y garbanzos', corto: 'Ensalada de quinoa', tipo: 'rapida', tiempo: '25 min', porciones: '3 porciones', tags: ['proteina'],
        desc: 'Quinoa, garbanzos, pepino, tomate y cilantro con limón. Fresca, sin gluten y fácil de llevar al trabajo.',
        ingredientes: ['1 taza de quinoa', '1 ½ taza de garbanzos cocidos', '1 pepino', '2 tomates', '½ taza de cilantro picado', 'Jugo de 1 limón', '2 cucharadas de aceite de oliva', 'Sal'],
        pasos: ['Lava bien la quinoa y cuécela en 2 tazas de agua por 15 minutos; deja que se enfríe.', 'Pica el pepino en medias lunas y el tomate en cubos.', 'Mezcla la quinoa con los garbanzos, las verduras y el cilantro.', 'Aliña con limón, aceite y sal justo antes de servir.'] },
      { id: 'o1', momento: 'once', nombre: 'Sopaipillas con pebre', tipo: 'elaborada', tiempo: '45 min', porciones: '12 unidades', tags: ['gluten', 'picante'], rec: true,
        desc: 'Masa de zapallo y harina, fritas o al horno, con pebre de tomate, cebolla, cilantro y ají verde. La once de un día de lluvia.',
        ingredientes: ['400 g de zapallo cocido y molido', '3 tazas de harina', '1 cucharadita de polvos de hornear', '4 cucharadas de aceite, y más para freír', 'Sal', 'Para el pebre: 2 tomates, ½ cebolla, cilantro, 1 ají verde y limón'],
        pasos: ['Mezcla el zapallo con la harina, los polvos de hornear, el aceite y la sal hasta formar una masa suave.', 'Uslerea a medio centímetro, corta círculos y pínchalos con un tenedor.', 'Fríelas en aceite caliente hasta que se doren por ambos lados, o hornéalas 15 minutos a 200 °C.', 'Para el pebre, pica fino el tomate, la cebolla, el cilantro y el ají, y aliña con limón y sal.'] },
      { id: 'o2', momento: 'once', nombre: 'Pan con palta y tomate', corto: 'Pan con palta', tipo: 'rapida', tiempo: '10 min', porciones: '2 porciones', tags: ['gluten'],
        desc: 'Marraqueta tibia con palta molida, sal de mar y rodajas de tomate. Lo más simple de la once, y lo que nunca falta en la mesa.',
        ingredientes: ['2 marraquetas', '1 palta grande', '1 tomate', 'Jugo de ½ limón', 'Sal de mar'],
        pasos: ['Abre las marraquetas y tuéstalas un poco.', 'Muele la palta con el limón y una pizca de sal.', 'Unta el pan y agrega el tomate en rodajas.', 'Termina con un poco más de sal.'] },
      { id: 'o3', momento: 'once', nombre: 'Queque de plátano y nueces', corto: 'Queque de plátano', tipo: 'elaborada', tiempo: '60 min', porciones: '10 porciones', tags: ['gluten', 'azucar'],
        desc: 'Queque húmedo con plátano bien maduro, nueces y canela, sin huevo ni mantequilla. Dura varios días guardado en un tarro.',
        ingredientes: ['3 plátanos bien maduros', '2 tazas de harina', '½ taza de azúcar rubia', '⅓ taza de aceite', '½ taza de leche vegetal', '2 cucharaditas de polvos de hornear', '½ taza de nueces picadas', '1 cucharadita de canela'],
        pasos: ['Precalienta el horno a 180 °C y aceita un molde de queque.', 'Muele los plátanos y mézclalos con el azúcar, el aceite y la leche.', 'Agrega la harina, los polvos de hornear y la canela sin batir de más, y luego las nueces.', 'Hornea unos 45 minutos, hasta que al pinchar con un palito salga limpio.'] },
      { id: 'c1', momento: 'cena', nombre: 'Crema de zapallo con merkén', corto: 'Crema de zapallo', tipo: 'elaborada', tiempo: '35 min', porciones: '4 porciones', tags: ['picante'], rec: true,
        desc: 'Zapallo camote, cebolla y jengibre licuados con leche de coco; se termina con merkén y semillas de zapallo tostadas.',
        ingredientes: ['1 kg de zapallo camote', '1 cebolla', '1 trozo de jengibre', '1 taza de leche de coco', '3 tazas de caldo de verduras', 'Merkén a gusto', '2 cucharadas de semillas de zapallo', 'Sal'],
        pasos: ['Sofríe la cebolla y el jengibre picados por 5 minutos.', 'Agrega el zapallo en cubos y el caldo, y cocina 20 minutos hasta que esté blando.', 'Licúa con la leche de coco y ajusta la sal.', 'Sirve con merkén y semillas de zapallo tostadas en un sartén.'] },
      { id: 'c2', momento: 'cena', nombre: 'Tallarines con champiñones', corto: 'Tallarines', tipo: 'rapida', tiempo: '20 min', porciones: '2 porciones', tags: ['gluten', 'soya'],
        desc: 'Salsa cremosa de champiñones, ajo y perejil con crema de soya. Una cena lista en lo que se cuecen los tallarines.',
        ingredientes: ['200 g de tallarines', '250 g de champiñones', '2 dientes de ajo', '200 ml de crema de soya', 'Perejil picado', '1 cucharada de aceite', 'Sal y pimienta'],
        pasos: ['Cuece los tallarines en agua con sal según el envase.', 'Mientras, saltea los champiñones laminados con el ajo en el aceite por 6 minutos.', 'Agrega la crema de soya, sal y pimienta, y cocina 3 minutos.', 'Mezcla con los tallarines y termina con perejil.'] },
      { id: 'c3', momento: 'cena', nombre: 'Tortilla de acelga', tipo: 'elaborada', tiempo: '30 min', porciones: '4 porciones', tags: ['proteina'],
        desc: 'En vez de huevo lleva harina de garbanzo, que la deja dorada y firme. Con acelga, cebolla y una ensalada de tomate al lado.',
        ingredientes: ['1 atado de acelga', '1 taza de harina de garbanzo', '1 taza de agua', '1 cebolla', '½ cucharadita de polvos de hornear', 'Sal, pimienta y aceite', 'Tomates para la ensalada'],
        pasos: ['Mezcla la harina de garbanzo con el agua, la sal y los polvos de hornear, y deja reposar 10 minutos.', 'Sofríe la cebolla y la acelga picada hasta que se marchite.', 'Mezcla las verduras con la masa y viértela en un sartén aceitado.', 'Cocina 6 minutos por lado a fuego medio, dándola vuelta con un plato, y sirve con ensalada de tomate.'] }
    ],
    nutricion: [
      { sym: 'B12', color: '#f8cfb2', titulo: 'Vitamina B12', sub: 'La única que sí o sí se suplementa', texto: 'No hay fuentes vegetales confiables de B12, así que en una dieta vegana se toma como suplemento o en alimentos fortificados. Es clave para la sangre y el sistema nervioso.', fuentes: ['Suplemento de B12', 'Leches vegetales fortificadas', 'Levadura nutricional fortificada'], tip: 'Pregunta la dosis a tu médico y, en los fortificados, busca "B12" o "cianocobalamina" en la etiqueta.' },
      { sym: 'Fe', color: '#c5def0', titulo: 'Hierro', sub: 'Está en las legumbres, pero se absorbe menos', texto: 'El hierro vegetal se absorbe mejor si lo comes junto con vitamina C, y peor si tomas té o café con la comida.', fuentes: ['Lentejas', 'Porotos y garbanzos', 'Tofu', 'Semillas de zapallo', 'Quinoa', 'Espinaca y acelga'], tip: 'Ponle limón, pimentón o tomate a las legumbres, y deja el té para la once.' },
      { sym: 'Pr', color: '#f6d98a', titulo: 'Proteína', sub: 'Fácil de cubrir si vas variando', texto: 'Legumbres, soya y cereales aportan proteína de buena calidad, sobre todo si los combinas a lo largo del día.', fuentes: ['Porotos, lentejas y garbanzos', 'Tofu y soya texturizada', 'Quinoa', 'Maní y frutos secos', 'Avena'], tip: 'Legumbres con tallarines o arroz, como los porotos con riendas, ya son una gran combinación.' },
      { sym: 'Ca', color: '#d9e7c4', titulo: 'Calcio', sub: 'Para huesos y músculos', texto: 'Sin lácteos, el calcio viene de leches vegetales fortificadas, tofu cuajado con calcio, semillas y algunas verduras.', fuentes: ['Leches vegetales fortificadas', 'Tofu con sulfato de calcio', 'Sésamo y tahini', 'Almendras', 'Brócoli y repollo'], tip: 'Al comprar tofu o leche vegetal, elige los que dicen "con calcio" en la etiqueta.' },
      { sym: 'ω-3', color: '#cfe0a8', titulo: 'Omega-3', sub: 'Grasas buenas de origen vegetal', texto: 'La linaza, la chía y las nueces aportan ALA, un omega-3 que el cuerpo transforma en parte en EPA y DHA. También hay suplementos de DHA hechos de algas.', fuentes: ['Linaza molida', 'Chía', 'Nueces', 'Aceite de canola'], tip: 'Muele la linaza justo antes de usarla y súmala a la avena del desayuno.' },
      { sym: 'D+I', color: '#e3d9f2', titulo: 'Vitamina D y yodo', sub: 'Dos que se olvidan', texto: 'La vitamina D se forma con el sol y está en algunos productos fortificados; el yodo viene sobre todo de la sal yodada.', fuentes: ['Exposición al sol', 'Leches vegetales fortificadas', 'Sal yodada'], tip: 'Usa sal yodada en la cocina y, en invierno, consulta si necesitas suplementar vitamina D.' }
    ]
  };
  const ORDER = ['desayuno', 'almuerzo', 'once', 'cena'];
  const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const DAYS_S = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const DUR_IN = 2.4, DUR_OUT = 1.4;
  const DINK = '#1C1A17';
  const BERRY = [[-0.86, -0.5], [-0.45, -0.8], [0, -0.7], [0.45, -0.8], [0.86, -0.5], [0.92, 0.05], [0.62, 0.55], [0.22, 0.92], [0, 1], [-0.22, 0.92], [-0.62, 0.55], [-0.92, 0.05]];
  const MAR = [[-100, 0], [-92, -42], [-58, -62], [-20, -52], [0, -36], [20, -52], [58, -62], [92, -42], [100, 0], [92, 42], [58, 62], [20, 52], [0, 36], [-20, 52], [-58, 62], [-92, 42]];
  const MUSH = [[-22, 4], [-21, -6], [-15, -14], [-6, -18], [6, -18], [15, -14], [21, -6], [22, 4], [9, 4], [9, 16], [4, 20], [-4, 20], [-9, 16], [-9, 4]];

  /* ================= Utilidades ================= */
  function N(v) { return Math.round(v * 10) / 10; }
  function clamp(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }
  function eio(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function eout(t) { return 1 - Math.pow(1 - t, 3); }
  function ein(t) { return t * t * t; }
  function backOut(t) { const c1 = 1.6, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
  function tauP(u) { return u <= 0.45 ? u / 0.45 * 0.35 : (u <= 0.75 ? 0.35 + (u - 0.45) / 0.3 * 0.35 : 0.7 + (u - 0.75) / 0.25 * 0.3); }
  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function wrap(v, span) { return ((v % span) + span) % span; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function rng(seed) { let s = (seed * 2654435761) >>> 0; if (!s) s = 1; return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
  function circ(cx, cy, r) { const a = N(r); return 'M' + N(cx - r) + ' ' + N(cy) + 'a' + a + ' ' + a + ' 0 1 0 ' + N(2 * r) + ' 0a' + a + ' ' + a + ' 0 1 0 ' + N(-2 * r) + ' 0Z'; }
  function ell(cx, cy, rx, ry, deg) { const t = deg * Math.PI / 180, c = Math.cos(t), s = Math.sin(t); const x1 = cx - rx * c, y1 = cy - rx * s, x2 = cx + rx * c, y2 = cy + rx * s; const A = 'A' + N(rx) + ' ' + N(ry) + ' ' + N(deg) + ' 1 0 '; return 'M' + N(x1) + ' ' + N(y1) + A + N(x2) + ' ' + N(y2) + A + N(x1) + ' ' + N(y1) + 'Z'; }
  function smooth(p) { const n = p.length, a = p[n - 1], b = p[0]; let d = 'M' + N((a[0] + b[0]) / 2) + ' ' + N((a[1] + b[1]) / 2); for (let i = 0; i < n; i++) { const c = p[i], e = p[(i + 1) % n]; d += 'Q' + N(c[0]) + ' ' + N(c[1]) + ' ' + N((c[0] + e[0]) / 2) + ' ' + N((c[1] + e[1]) / 2); } return d + 'Z'; }
  function rot(pts, cx, cy, deg) { const t = deg * Math.PI / 180, c = Math.cos(t), s = Math.sin(t); return pts.map(function (q) { return [cx + q[0] * c - q[1] * s, cy + q[0] * s + q[1] * c]; }); }
  function blob(cx, cy, r, n, j, rnd, ph) { const p = []; for (let i = 0; i < n; i++) { const t = (ph || 0) + i / n * Math.PI * 2, rr = r * (1 + (rnd() * 2 - 1) * j); p.push([cx + Math.cos(t) * rr, cy + Math.sin(t) * rr]); } return smooth(p); }
  function roundPoly(p, r) { const n = p.length; let d = ''; for (let i = 0; i < n; i++) { const c = p[i], pr = p[(i - 1 + n) % n], nx = p[(i + 1) % n]; const l1 = Math.hypot(pr[0] - c[0], pr[1] - c[1]) || 1, l2 = Math.hypot(nx[0] - c[0], nx[1] - c[1]) || 1; const t1 = Math.min(r / l1, 0.5), t2 = Math.min(r / l2, 0.5); d += (i ? 'L' : 'M') + N(c[0] + (pr[0] - c[0]) * t1) + ' ' + N(c[1] + (pr[1] - c[1]) * t1) + 'Q' + N(c[0]) + ' ' + N(c[1]) + ' ' + N(c[0] + (nx[0] - c[0]) * t2) + ' ' + N(c[1] + (nx[1] - c[1]) * t2); } return d + 'Z'; }
  function rrect(cx, cy, w, h, r, deg) { return roundPoly(rot([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]], cx, cy, deg), r); }
  function leaf(x, y, len, wid, deg) { const t = deg * Math.PI / 180, c = Math.cos(t), s = Math.sin(t); const P = function (u, v) { return [x + u * c - v * s, y + u * s + v * c]; }; const tp = P(len, 0), c1 = P(len * 0.45, wid), c2 = P(len * 0.45, -wid); return 'M' + N(x) + ' ' + N(y) + 'Q' + N(c1[0]) + ' ' + N(c1[1]) + ' ' + N(tp[0]) + ' ' + N(tp[1]) + 'Q' + N(c2[0]) + ' ' + N(c2[1]) + ' ' + N(x) + ' ' + N(y) + 'Z'; }
  function lobed(x, y, R, n, deg) { const p = []; for (let i = 0; i < n * 2; i++) { const t = deg * Math.PI / 180 + i / (n * 2) * Math.PI * 2, rr = i % 2 ? R * 0.5 : R; p.push([x + Math.cos(t) * rr, y + Math.sin(t) * rr]); } return smooth(p); }
  function line(pts) { return 'M' + pts.map(function (p) { return N(p[0]) + ' ' + N(p[1]); }).join('L'); }
  function scatter(rnd, n, R, minD, cx, cy) { cx = cx || 0; cy = cy || 0; const out = []; let tries = 0; while (out.length < n && tries < n * 80) { tries++; const t = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()) * R, x = cx + Math.cos(t) * rr, y = cy + Math.sin(t) * rr; let ok = true; for (let i = 0; i < out.length; i++) { const q = out[i]; if ((q[0] - x) * (q[0] - x) + (q[1] - y) * (q[1] - y) < minD * minD) { ok = false; break; } } if (ok) out.push([x, y, rnd()]); } return out; }
  function L(d, f, k, w, o, c) { return { d: d, f: f || 'none', k: k || 'none', w: w || 0, o: (o == null ? 1 : o), c: c || '' }; }
  function addAll(f, list) { list.forEach(function (l) { f.push(l); }); }
  function flat(parts, w) { const out = []; parts.forEach(function (p) { p.fill.forEach(function (l) { out.push(l); }); p.ink.forEach(function (d) { out.push(L(d, 'none', DINK, w)); }); }); return out; }
  function artSVG(art) { return art.map(function (s) { return '<path d="' + s.d + '" fill="' + s.f + '" stroke="' + s.k + '" stroke-width="' + s.w + '" stroke-linecap="round" stroke-linejoin="round" opacity="' + s.o + '"' + (s.c ? ' class="' + s.c + '"' : '') + '></path>'; }).join(''); }
  function icon(d, size, sw) { return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 1.8) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"></path></svg>'; }

  /* ================= Platos (vista desde arriba) ================= */
  function speckRing(seed, r0, r1, n) { const r = rng(seed); let d = ''; for (let i = 0; i < n; i++) { const a = r() * Math.PI * 2, rr = r0 + r() * (r1 - r0); d += circ(Math.cos(a) * rr, Math.sin(a) * rr, 1 + r() * 1.3); } return d; }
  function vBowl(o) { const R = o.R; const f = [L(circ(0, 0, R), o.out)]; if (o.speck) f.push(L(speckRing(o.speck, R * 0.9, R * 0.99, 110), '#7C7062', 0, 0, 0.45)); if (o.rim) f.push(L(circ(0, 0, R * 0.965), 'none', o.rim, 7)); f.push(L(circ(0, 0, R * 0.88), o.inn)); return { fill: f, ink: [circ(0, 0, R), circ(0, 0, R * 0.88)], hit: circ(0, 0, R) }; }
  function vPlate(o) { const R = 250, w = o.well || 0.66; const f = [L(circ(0, 0, R), o.out || '#FBF7EF')]; if (o.speck) f.push(L(speckRing(o.speck, R * (w + 0.02), R * 0.99, 160), '#7C7062', 0, 0, 0.4)); if (o.rim) { f.push(L(circ(0, 0, R * 0.935), 'none', o.rim, 3.2)); if (o.rim2) f.push(L(circ(0, 0, R * 0.905), 'none', o.rim, 1.4)); } f.push(L(circ(0, 0, R * w), o.inn || '#F2ECE1')); return { fill: f, ink: [circ(0, 0, R), circ(0, 0, R * w)], hit: circ(0, 0, R) }; }
  function steam() { return ['M-46 30C-70 -6 -22 -30 -44 -70S-30 -128 -52 -160', 'M8 40C-16 4 32 -22 10 -62S24 -122 2 -158', 'M60 24C36 -12 84 -36 62 -76S76 -132 54 -164'].map(function (d, i) { return L(d, 'none', '#FFFFFF', 8, 1, 'steam st' + (i + 1)); }); }
  function banana(f, x, y, R) {
    f.push(L(circ(x, y, R), '#F4E4A4', '#D5BA68', 1.6));
    f.push(L(circ(x, y, R * 0.72), 'none', '#E6CD80', 2));
    f.push(L(circ(x, y, R * 0.3), '#EEDA96'));
    let s = ''; for (let k = 0; k < 3; k++) { const a = k * 2.094 + 0.5; s += circ(x + Math.cos(a) * R * 0.2, y + Math.sin(a) * R * 0.2, 2.1); }
    f.push(L(s, '#8C6A3C', 0, 0, 0.85));
  }
  function berry(f, x, y, s, deg) {
    const P = function (k) { return smooth(rot(BERRY.map(function (p) { return [p[0] * s * k, p[1] * s * k + (1 - k) * s * 0.08]; }), x, y, deg)); };
    f.push(L(P(1), '#D2353B', '#A6232B', 1.4));
    f.push(L(P(0.74), '#EE7C6D'));
    f.push(L(P(0.36), '#F7BBA8'));
    let sd = ''; for (let k = 0; k < 9; k++) { const a = k / 9 * Math.PI * 2; const q = rot([[Math.cos(a) * s * 0.6, Math.sin(a) * s * 0.62 + s * 0.06]], x, y, deg)[0]; sd += circ(q[0], q[1], 1.6); }
    f.push(L(sd, '#F8DE9C', 0, 0, 0.9));
    const b = rot([[0, -0.64 * s]], x, y, deg)[0]; let lv = '';
    [-130, -90, -50].forEach(function (a) { lv += leaf(b[0], b[1], 0.5 * s, 0.46 * s, a + deg); });
    f.push(L(lv, '#4E8A3A', '#3A6C2B', 1.2));
  }
  function tomSlice(f, x, y, R, r) {
    f.push(L(circ(x, y, R), '#D63C31', '#AE2D24', 1.4));
    f.push(L(circ(x, y, R * 0.86), '#EA5B48'));
    const a0 = r() * Math.PI * 2; let pk = '', sd = '';
    for (let k = 0; k < 5; k++) { const a = a0 + k * 1.2566, px = x + Math.cos(a) * R * 0.5, py = y + Math.sin(a) * R * 0.5; pk += ell(px, py, R * 0.22, R * 0.13, a * 57.2958); sd += circ(px, py, Math.max(1.4, R * 0.045)); }
    f.push(L(pk, '#F7A58D')); f.push(L(sd, '#F9E0B0'));
    f.push(L(circ(x, y, R * 0.15), '#F07F69'));
  }
  function tomHalf(f, x, y, R, r) {
    f.push(L(circ(x, y, R), '#E04A38', '#B53125', 1.2));
    f.push(L(circ(x, y, R * 0.74), '#F28D70'));
    let s = ''; const a0 = r() * 6.283; for (let k = 0; k < 4; k++) { const a = a0 + k * 1.5708; s += ell(x + Math.cos(a) * R * 0.38, y + Math.sin(a) * R * 0.38, R * 0.2, R * 0.12, a * 57.3); }
    f.push(L(s, '#F7DCA1'));
  }
  function marraqueta(f, x, y, deg, tom, r) {
    const S = function (k, j) { return smooth(rot(MAR.map(function (p) { return [p[0] * k + (r() - 0.5) * j, p[1] * k + (r() - 0.5) * j]; }), x, y, deg)); };
    f.push(L(S(1, 0), '#D59B55', '#AD7436', 2));
    f.push(L(S(0.86, 0), '#F0DCB4'));
    f.push(L(S(0.8, 7), '#9EC24F'));
    let sw = ''; for (let k = 0; k < 5; k++) { const q = rot([[-60 + k * 30, (r() - 0.5) * 30]], x, y, deg)[0]; sw += 'M' + N(q[0] - 10) + ' ' + N(q[1] - 4) + 'Q' + N(q[0]) + ' ' + N(q[1] + 8) + ' ' + N(q[0] + 10) + ' ' + N(q[1] - 4); }
    f.push(L(sw, 'none', '#7FA43A', 3, 0.7));
    if (tom) { const a = rot([[-44, 0]], x, y, deg)[0], b = rot([[44, 4]], x, y, deg)[0]; tomSlice(f, a[0], a[1], 30, r); tomSlice(f, b[0], b[1], 30, r); }
    let salt = '', pep = '';
    scatter(r, 16, 70, 9, x, y).forEach(function (p) { salt += rrect(p[0], p[1], 3.2, 3.2, 0.8, p[2] * 90); });
    scatter(r, 10, 70, 9, x, y).forEach(function (p) { pep += circ(p[0], p[1], 1.4); });
    f.push(L(salt, '#FFFFFF', 0, 0, 0.9)); f.push(L(pep, '#2A2622', 0, 0, 0.8));
  }
  function dAvena() {
    const r = rng(11);
    const v = vBowl({ R: 230, out: '#F3EDE1', inn: '#E8DECB', rim: '#2C4A86' }); const f = v.fill;
    f.push(L(blob(0, 0, 186, 16, 0.025, r, 0), '#E6D2AC'));
    let dk = '', lt = '', cn = '', ch = '';
    scatter(r, 70, 172, 16).forEach(function (p) { dk += ell(p[0], p[1], 7 + p[2] * 4, 4 + p[2] * 2, r() * 180); });
    scatter(r, 50, 172, 18).forEach(function (p) { lt += ell(p[0], p[1], 6 + p[2] * 4, 3.5 + p[2] * 2, r() * 180); });
    f.push(L(dk, '#CDB27E', 0, 0, 0.7)); f.push(L(lt, '#F4EAD3', 0, 0, 0.9));
    scatter(r, 40, 110, 8, -30, 10).forEach(function (p) { cn += circ(p[0], p[1], 1.6); });
    f.push(L(cn, '#9A5A2C', 0, 0, 0.8));
    [150, 178, 206, 234, 262].forEach(function (a) { const t = a * Math.PI / 180; banana(f, Math.cos(t) * 100, Math.sin(t) * 100, 33); });
    [[96, -70, 30], [136, 22, -18], [70, 104, 205], [20, -128, 160]].forEach(function (q) { berry(f, q[0], q[1], 36, q[2]); });
    scatter(r, 46, 176, 9).forEach(function (p) { ch += circ(p[0], p[1], 1.9); });
    f.push(L(ch, '#34302C', 0, 0, 0.8));
    addAll(f, steam());
    return [v];
  }
  function dTofu() {
    const r = rng(23), R = 212;
    const hd = rrect(199, 199, 184, 40, 20, 45), hole = 241;
    const f = [L(hd, '#2B2825'), L(circ(hole, hole, 10), '#6B645A'), L(circ(0, 0, R), '#34312D'), L(circ(0, 0, R * 0.95), 'none', '#5C564E', 3, 0.8), L(circ(0, 0, R * 0.9), '#433E38')];
    f.push(L(blob(0, 0, 150, 12, 0.08, r, 0), '#4D4740'));
    let ld = '', vd = '';
    for (let i = 0; i < 9; i++) { const a = r() * Math.PI * 2, d = 30 + r() * 90, x = Math.cos(a) * d, y = Math.sin(a) * d, len = 52 + r() * 20, dg = r() * 360, t = dg * Math.PI / 180; ld += leaf(x, y, len, 44, dg); vd += 'M' + N(x) + ' ' + N(y) + 'L' + N(x + Math.cos(t) * len * 0.82) + ' ' + N(y + Math.sin(t) * len * 0.82); }
    f.push(L(ld, '#3F7B3A', '#2C5A29', 1.4)); f.push(L(vd, 'none', '#2C5A29', 1.8, 0.8));
    let tb = '', tc = '', pp = '';
    scatter(r, 24, 140, 30).forEach(function (p) { tb += blob(p[0], p[1], 13 + p[2] * 9, 8, 0.3, r, 0); });
    scatter(r, 34, 145, 12).forEach(function (p) { tc += blob(p[0], p[1], 5 + p[2] * 3, 6, 0.3, r, 0); });
    f.push(L(tb, '#F1CB57', '#D2A438', 1.4)); f.push(L(tc, '#F6D978'));
    scatter(r, 6, 120, 60).forEach(function (p) { tomHalf(f, p[0], p[1], 17, r); });
    scatter(r, 50, 160, 8).forEach(function (p) { pp += circ(p[0], p[1], 1.7); });
    f.push(L(pp, '#1E1B18', 0, 0, 0.85));
    addAll(f, steam());
    return [{ fill: f, ink: [circ(0, 0, R), circ(0, 0, R * 0.9), hd, circ(hole, hole, 10)], hit: circ(0, 0, R) + hd }];
  }
  function dPanq() {
    const r = rng(37);
    const v = vPlate({ rim: '#E3A72F' }); const f = v.fill;
    f.push(L(blob(8, -4, 156, 18, 0.03, r, 0), '#C78434'));
    f.push(L(blob(-4, 8, 154, 18, 0.03, r, 0.3), '#D99A45'));
    f.push(L(blob(0, 0, 150, 18, 0.025, r, 0.6), '#E8B262', '#C88838', 2));
    f.push(L(blob(-8, -6, 116, 14, 0.05, r, 0), '#EFC678', 0, 0, 0.85));
    let sp = ''; scatter(r, 22, 135, 20).forEach(function (p) { sp += blob(p[0], p[1], 5 + p[2] * 7, 7, 0.3, r, 0); });
    f.push(L(sp, '#D4943F', 0, 0, 0.45));
    let sc = blob(0, 0, 70, 12, 0.18, r, 0);
    for (let k = 0; k < 5; k++) { const a = k * 1.2566 + r() * 0.4; sc += leaf(Math.cos(a) * 48, Math.sin(a) * 48, 44 + r() * 34, 34, a * 57.2958); }
    f.push(L(sc, '#B3203A', 0, 0, 0.94));
    f.push(L(ell(-22, -26, 16, 7, -30), '#FFFFFF', 0, 0, 0.3));
    [[-62, -38], [52, -50], [44, 58], [-50, 56]].forEach(function (q) { banana(f, q[0], q[1], 23); });
    [[178, 96, -60], [-170, 120, 40], [150, -160, 140]].forEach(function (q) { berry(f, q[0], q[1], 28, q[2]); });
    return [v];
  }
  function dPorotos() {
    const r = rng(41);
    const v = vPlate({ well: 0.72, rim: '#2E6B40', rim2: true, inn: '#EEE6D6' }); const f = v.fill;
    f.push(L(blob(0, 0, 172, 18, 0.02, r, 0), '#CF9853'));
    let lt = ''; for (let k = 0; k < 4; k++) { const a = r() * 6.283, d = r() * 80; lt += blob(Math.cos(a) * d, Math.sin(a) * d, 46 + r() * 30, 10, 0.15, r, 0); }
    f.push(L(lt, '#DDAE68', 0, 0, 0.75));
    let sh = ''; scatter(r, 14, 150, 22).forEach(function (p) { sh += circ(p[0], p[1], 3 + p[2] * 4); });
    f.push(L(sh, '#EFC575', 0, 0, 0.6));
    const beans = scatter(r, 34, 150, 21);
    const bean = function (list) { let d = ''; list.forEach(function (p) { d += ell(p[0], p[1], 13, 8.5, p[2] * 180); }); return d; };
    f.push(L(bean(beans.slice(0, 17)), '#EFE2C4', '#B39561', 1.6));
    let nd = '';
    for (let k = 0; k < 11; k++) {
      const a = r() * 6.283, d0 = r() * 110; let x = Math.cos(a) * d0, y = Math.sin(a) * d0, ang = r() * 6.283, path = 'M' + N(x) + ' ' + N(y);
      for (let s = 0; s < 3; s++) { const len = 34 + r() * 26, a1 = ang + (r() - 0.5) * 1.6, cx = x + Math.cos(a1) * len * 0.6, cy = y + Math.sin(a1) * len * 0.6; ang += (r() - 0.5) * 2.2; let nx = x + Math.cos(ang) * len, ny = y + Math.sin(ang) * len; const dd = Math.hypot(nx, ny); if (dd > 150) { nx *= 150 / dd; ny *= 150 / dd; } path += 'Q' + N(cx) + ' ' + N(cy) + ' ' + N(nx) + ' ' + N(ny); x = nx; y = ny; }
      nd += path;
    }
    f.push(L(nd, 'none', '#C29A3B', 9.5)); f.push(L(nd, 'none', '#F1CF6C', 6.4));
    f.push(L(bean(beans.slice(17)), '#EFE2C4', '#B39561', 1.6));
    let zc = '', zh = ''; scatter(r, 12, 140, 34).forEach(function (p) { const dg = r() * 90; zc += rrect(p[0], p[1], 21, 21, 4, dg); zh += rrect(p[0] - 3, p[1] - 3, 9, 9, 2.5, dg); });
    f.push(L(zc, '#E8862E', '#C0641B', 1.4)); f.push(L(zh, '#F3A452', 0, 0, 0.8));
    let aj = ''; scatter(r, 60, 160, 7).forEach(function (p) { aj += circ(p[0], p[1], 1.7); });
    f.push(L(aj, '#B5402B', 0, 0, 0.7));
    let cl = ''; scatter(r, 7, 130, 40).forEach(function (p) { cl += lobed(p[0], p[1], 13, 3, r() * 120); });
    f.push(L(cl, '#3F8A3E', '#2E6C2E', 1));
    addAll(f, steam());
    return [v];
  }
  function dCharqui() {
    const r = rng(53), mx = -48, my = 4;
    const v = vPlate({ rim: '#2E6B40' }); const f = v.fill;
    f.push(L(blob(mx, my, 132, 16, 0.09, r, 0), '#E7A43D'));
    let lm = '', dm = '', ck = '', sy = '', av = '', ah = '';
    scatter(r, 26, 118, 24, mx, my).forEach(function (p) { lm += blob(p[0], p[1], 9 + p[2] * 9, 8, 0.3, r, 0); });
    scatter(r, 18, 118, 26, mx, my).forEach(function (p) { dm += blob(p[0], p[1], 6 + p[2] * 6, 7, 0.3, r, 0); });
    f.push(L(lm, '#F2BE58', 0, 0, 0.85)); f.push(L(dm, '#D58C2B', 0, 0, 0.55));
    scatter(r, 30, 115, 14, mx, my).forEach(function (p) { ck += rrect(p[0], p[1], 10, 9, 3, p[2] * 180); });
    f.push(L(ck, '#F6D35F', '#D7AB34', 1));
    scatter(r, 26, 112, 14, mx, my).forEach(function (p) { sy += blob(p[0], p[1], 5 + p[2] * 4, 6, 0.35, r, 0); });
    f.push(L(sy, '#97663B'));
    scatter(r, 20, 112, 16, mx, my).forEach(function (p) { av += circ(p[0], p[1], 7); ah += circ(p[0] - 2.2, p[1] - 2.2, 2.2); });
    f.push(L(av, '#78AB45', '#5A8B32', 1.2)); f.push(L(ah, '#A9D06F'));
    [[150, -72], [172, 8], [138, 84], [104, -8]].forEach(function (q) { tomSlice(f, q[0], q[1], 38, r); });
    let ce = ''; for (let k = 0; k < 9; k++) { const x = 104 + r() * 84, y = -96 + r() * 190, a = r() * 6.283, rr = 14 + r() * 12; ce += 'M' + N(x + Math.cos(a) * rr) + ' ' + N(y + Math.sin(a) * rr) + 'A' + N(rr) + ' ' + N(rr) + ' 0 0 1 ' + N(x + Math.cos(a + 1.6) * rr) + ' ' + N(y + Math.sin(a + 1.6) * rr); }
    f.push(L(ce, 'none', '#D9CCE2', 6.4)); f.push(L(ce, 'none', '#FFFFFF', 3.6));
    let cl = ''; scatter(r, 6, 72, 26, 140, 0).forEach(function (p) { cl += lobed(p[0], p[1], 11, 3, r() * 120); });
    f.push(L(cl, '#3F8A3E', '#2E6C2E', 1));
    addAll(f, steam());
    return [v];
  }
  function dQuinoa() {
    const r = rng(67);
    const v = vBowl({ R: 230, out: '#E6DDCE', inn: '#F1EBE0', speck: 61 }); const f = v.fill;
    f.push(L(circ(0, 0, 190), '#E8DCBE'));
    let q1 = '', q2 = '', q3 = '';
    for (let i = 0; i < 420; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * 184, t = r(), c = circ(Math.cos(a) * d, Math.sin(a) * d, 2.5); if (t < 0.72) q1 += c; else if (t < 0.9) q2 += c; else q3 += c; }
    f.push(L(q1, '#D3C399')); f.push(L(q2, '#9C503C')); f.push(L(q3, '#3A332E', 0, 0, 0.85));
    let gb = '', gc = '', pe = '', ps = '', tc = '', ti = '';
    scatter(r, 38, 162, 31).forEach(function (p, i) {
      const x = p[0], y = p[1], t = p[2] * 6.283;
      if (i < 16) { gb += circ(x, y, 15); gc += 'M' + N(x + Math.cos(t + 2.3) * 9) + ' ' + N(y + Math.sin(t + 2.3) * 9) + 'Q' + N(x + Math.cos(t) * 3) + ' ' + N(y + Math.sin(t) * 3) + ' ' + N(x + Math.cos(t - 2.3) * 9) + ' ' + N(y + Math.sin(t - 2.3) * 9); }
      else if (i < 24) { const ax = Math.cos(t) * 22, ay = Math.sin(t) * 22, nx = Math.sin(t), ny = -Math.cos(t); pe += 'M' + N(x - ax) + ' ' + N(y - ay) + 'A22 22 0 0 1 ' + N(x + ax) + ' ' + N(y + ay) + 'Z'; for (let k = -1; k <= 1; k++) ps += ell(x + Math.cos(t) * k * 9 + nx * 6, y + Math.sin(t) * k * 9 + ny * 6, 3, 1.6, t * 57.3); }
      else { const dg = p[2] * 90; tc += rrect(x, y, 19, 19, 3.5, dg); ti += rrect(x, y, 9, 9, 2, dg); }
    });
    f.push(L(gb, '#E5C07D', '#C29652', 1.4)); f.push(L(gc, 'none', '#C29652', 1.6));
    f.push(L(pe, '#D7EAB2', '#3E6E2E', 3)); f.push(L(ps, '#B4D085'));
    f.push(L(tc, '#E04B3B', '#B8352A', 1)); f.push(L(ti, '#F2806A'));
    let cl = ''; scatter(r, 8, 160, 40).forEach(function (p) { cl += lobed(p[0], p[1], 12, 3, r() * 120); });
    f.push(L(cl, '#3F8A3E', '#2E6C2E', 1));
    const lx = 150, ly = -88, la = -30, e1 = rot([[-42, 0]], lx, ly, la)[0], e2 = rot([[42, 0]], lx, ly, la)[0];
    f.push(L('M' + N(e1[0]) + ' ' + N(e1[1]) + 'A42 24 ' + la + ' 0 1 ' + N(e2[0]) + ' ' + N(e2[1]) + 'Z', '#F3DA4E', '#D7B02A', 4));
    let sg = ''; [-24, 0, 24].forEach(function (u) { const a = rot([[u * 0.6, 0]], lx, ly, la)[0], b = rot([[u, -18 + Math.abs(u) * 0.2]], lx, ly, la)[0]; sg += 'M' + N(a[0]) + ' ' + N(a[1]) + 'L' + N(b[0]) + ' ' + N(b[1]); });
    f.push(L(sg, 'none', '#E2C23C', 1.6));
    return [v];
  }
  function dSopai() {
    const r = rng(71);
    const v = vPlate({ rim: '#A94A2A' }); const f = v.fill;
    [[-62, -48], [58, -62], [72, 58], [-58, 66], [2, 2]].forEach(function (q) {
      const x = q[0], y = q[1];
      f.push(L(blob(x, y, 74, 14, 0.035, r, 0), '#DE9A3E', '#B7762A', 2.2));
      f.push(L(blob(x - 4, y - 4, 54, 10, 0.08, r, 0), '#EAB257', 0, 0, 0.85));
      let br = ''; scatter(r, 6, 50, 14, x, y).forEach(function (p) { br += blob(p[0], p[1], 4 + p[2] * 5, 6, 0.3, r, 0); });
      f.push(L(br, '#C8842D', 0, 0, 0.5));
      let h = ''; for (let k = 0; k < 4; k++) { h += circ(x - 15 + k * 10, y - 8, 2.4) + circ(x - 15 + k * 10, y + 8, 2.4); }
      f.push(L(h, '#A4621B', 0, 0, 0.85));
    });
    addAll(f, steam());
    const bx = 178, by = -178, g = [L(circ(bx, by, 70), '#FBF7EF'), L(circ(bx, by, 60), '#F0E9DC'), L(blob(bx, by, 54, 12, 0.06, r, 0), '#D3443A')];
    let pt = '', on = '', ci = '', aj = '';
    scatter(r, 14, 46, 12, bx, by).forEach(function (p) { pt += rrect(p[0], p[1], 9, 9, 2.5, p[2] * 90); });
    scatter(r, 10, 46, 12, bx, by).forEach(function (p) { on += rrect(p[0], p[1], 8, 5, 2, p[2] * 180); });
    scatter(r, 12, 46, 10, bx, by).forEach(function (p) { ci += leaf(p[0], p[1], 10, 8, p[2] * 360); });
    scatter(r, 8, 46, 10, bx, by).forEach(function (p) { aj += circ(p[0], p[1], 3); });
    g.push(L(pt, '#EC6650')); g.push(L(on, '#F6F0E6')); g.push(L(ci, '#3C8A3A')); g.push(L(aj, '#6CA843'));
    return [v, { fill: g, ink: [circ(bx, by, 70), circ(bx, by, 60)], hit: circ(bx, by, 70) }];
  }
  function dPan() {
    const r = rng(83), B = rrect(0, 0, 520, 330, 28, -8);
    const f = [L(B, '#C8925A', '#A87440', 2)];
    let gr = '';
    for (let k = 0; k < 9; k++) { const yy = -130 + k * 32 + r() * 10, pts = []; for (let s = 0; s <= 6; s++) pts.push([-240 + s * 80, yy + Math.sin(s * 1.3 + k) * 6]); gr += line(rot(pts, 0, 0, -8)); }
    f.push(L(gr, 'none', '#AE7843', 2, 0.55));
    const h = rot([[222, 0]], 0, 0, -8)[0];
    f.push(L(circ(h[0], h[1], 14), '#8C5D31'));
    marraqueta(f, -100, -40, -12, false, r);
    marraqueta(f, 104, 48, 10, true, r);
    return [{ fill: f, ink: [B, circ(h[0], h[1], 14)], hit: B }];
  }
  function dQueque() {
    const r = rng(97);
    const v = vPlate({ rim: '#A94A2A' }); const f = v.fill;
    [[-34, -70, -18], [6, 8, 4], [40, 86, 22]].forEach(function (q) {
      const x = q[0], y = q[1], d = q[2];
      f.push(L(rrect(x, y, 176, 78, 10, d), '#7C4D26'));
      f.push(L(rrect(x, y - 4, 166, 64, 8, d), '#D6A466'));
      let nb = '', bb = '', cr = '';
      for (let k = 0; k < 6; k++) { const p = rot([[(r() - 0.5) * 140, (r() - 0.5) * 44]], x, y - 4, d)[0]; nb += blob(p[0], p[1], 5 + r() * 4, 6, 0.4, r, 0); }
      for (let k = 0; k < 5; k++) { const p = rot([[(r() - 0.5) * 140, (r() - 0.5) * 40]], x, y - 4, d)[0]; bb += blob(p[0], p[1], 6 + r() * 6, 7, 0.3, r, 0); }
      for (let k = 0; k < 26; k++) { const p = rot([[(r() - 0.5) * 156, (r() - 0.5) * 56]], x, y - 4, d)[0]; cr += circ(p[0], p[1], 1.4); }
      f.push(L(bb, '#E9C78A', 0, 0, 0.75)); f.push(L(nb, '#6E4423')); f.push(L(cr, '#B5824A', 0, 0, 0.7));
    });
    [[-150, 90], [160, -40], [-120, -150]].forEach(function (q) {
      const x = q[0], y = q[1];
      f.push(L(blob(x, y, 17, 9, 0.25, r, 0), '#8C5A2E', '#5F3B1C', 1.4));
      f.push(L('M' + (x - 9) + ' ' + y + 'Q' + x + ' ' + (y - 9) + ' ' + (x + 9) + ' ' + y + 'M' + x + ' ' + (y - 12) + 'V' + (y + 12), 'none', '#5F3B1C', 1.6));
    });
    return [v];
  }
  function dCrema() {
    const r = rng(103);
    const v = vPlate({ well: 0.7, out: '#D9D0C0', inn: '#CEC4B2', speck: 101 }); const f = v.fill;
    f.push(L(circ(0, 0, 166), '#EC9234'));
    f.push(L(circ(0, 0, 160), 'none', '#D3781F', 9, 0.5));
    f.push(L(blob(-10, -8, 112, 12, 0.08, r, 0), '#F3A84B', 0, 0, 0.75));
    const pts = []; for (let i = 0; i <= 64; i++) { const t = i / 64, a = t * Math.PI * 2 * 2.1, rr = 6 + t * 92; pts.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
    f.push(L(line(pts), 'none', '#FBF1DF', 7, 0.95, 'swirl'));
    let mk = '', pp = '', cl = '';
    scatter(r, 80, 122, 8).forEach(function (p) { mk += circ(p[0], p[1], 1.5 + p[2] * 0.8); });
    scatter(r, 14, 125, 26).forEach(function (p) { pp += leaf(p[0], p[1], 24, 15, p[2] * 360); });
    scatter(r, 3, 70, 34).forEach(function (p) { cl += lobed(p[0], p[1], 12, 3, p[2] * 120); });
    f.push(L(mk, '#8A291C', 0, 0, 0.85)); f.push(L(pp, '#8DB767', '#6A9446', 1.2)); f.push(L(cl, '#3F8A3E', '#2E6C2E', 1));
    addAll(f, steam());
    return [v];
  }
  function dTalla() {
    const r = rng(109);
    const v = vPlate({ rim: '#232F69' }); const f = v.fill;
    f.push(L(blob(0, 0, 142, 16, 0.06, r, 0), '#E5CE9A'));
    let sp = ''; scatter(r, 8, 110, 40).forEach(function (p) { sp += blob(p[0], p[1], 14 + p[2] * 12, 8, 0.3, r, 0); });
    f.push(L(sp, '#DCC08A', 0, 0, 0.7));
    let nd = '';
    for (let k = 0; k < 30; k++) { const rr = 16 + r() * 118, a0 = r() * 6.283, sw = 0.9 + r() * 1.5, pts = []; for (let s = 0; s <= 8; s++) { const a = a0 + sw * s / 8, rad = rr + Math.sin(s * 0.9 + k) * 5; pts.push([Math.cos(a) * rad, Math.sin(a) * rad]); } nd += line(pts); }
    f.push(L(nd, 'none', '#C7AB74', 8)); f.push(L(nd, 'none', '#F2E2B6', 5.2));
    let mu = '', gi = '';
    scatter(r, 12, 118, 40).forEach(function (p) { const dg = p[2] * 360; mu += roundPoly(rot(MUSH, p[0], p[1], dg), 3); [[[-14, 1], [-7, -10]], [[0, 1], [0, -13]], [[14, 1], [7, -10]]].forEach(function (seg) { gi += line(rot(seg, p[0], p[1], dg)); }); });
    f.push(L(mu, '#CBA780', '#8C6943', 1.6)); f.push(L(gi, 'none', '#A27F59', 1.3));
    let pe = '', pp = '';
    scatter(r, 22, 135, 14).forEach(function (p) { pe += lobed(p[0], p[1], 5.5, 3, p[2] * 120); });
    scatter(r, 40, 140, 8).forEach(function (p) { pp += circ(p[0], p[1], 1.5); });
    f.push(L(pe, '#4C8C3C')); f.push(L(pp, '#2A2622', 0, 0, 0.8));
    addAll(f, steam());
    return [v];
  }
  function dTortilla() {
    const r = rng(113), tx = -18, ty = -14;
    const v = vPlate({ rim: '#232F69' }); const f = v.fill;
    f.push(L(blob(tx, ty, 152, 20, 0.02, r, 0), '#D8AC4A', '#B4832A', 2));
    f.push(L(circ(tx, ty, 138), 'none', '#C49237', 8, 0.45));
    let bs = '', ac = '', st = '', cut = '', og = '';
    scatter(r, 26, 128, 22, tx, ty).forEach(function (p) { bs += blob(p[0], p[1], 5 + p[2] * 8, 7, 0.35, r, 0); });
    f.push(L(bs, '#BE8A2E', 0, 0, 0.55));
    scatter(r, 34, 128, 16, tx, ty).forEach(function (p) { ac += leaf(p[0], p[1], 14 + p[2] * 14, 12, r() * 360); });
    f.push(L(ac, '#4D7E39', 0, 0, 0.92));
    scatter(r, 10, 118, 24, tx, ty).forEach(function (p) { const a = p[2] * 6.283; st += 'M' + N(p[0]) + ' ' + N(p[1]) + 'l' + N(Math.cos(a) * 12) + ' ' + N(Math.sin(a) * 12); });
    f.push(L(st, 'none', '#E6E0B4', 3, 0.85));
    for (let k = 0; k < 6; k++) { const a = k * 1.0472 + 0.26; cut += 'M' + tx + ' ' + ty + 'l' + N(Math.cos(a) * 150) + ' ' + N(Math.sin(a) * 150); }
    f.push(L(cut, 'none', '#9C6E1E', 2.4, 0.7));
    [[150, 138], [190, 64], [96, 192]].forEach(function (q) { tomSlice(f, q[0], q[1], 30, r); });
    scatter(r, 24, 70, 6, 150, 130).forEach(function (p) { og += circ(p[0], p[1], 1.4); });
    f.push(L(og, '#5C6E2E', 0, 0, 0.8));
    return [v];
  }

  /* ================= Paisaje (más ancho que la pantalla para cualquier formato) ================= */
  const MX0 = -1000, MXW = 3440;
  function hill(base, a1, f1, p1, a2, f2, p2) { return function (x) { return base + a1 * Math.sin(x / f1 + p1) + a2 * Math.sin(x / f2 + p2); }; }
  const HB = hill(84, 24, 230, 0.4, 12, 97, 1.1), HM = hill(172, 26, 180, 2, 10, 70, 0.3), HF = hill(268, 18, 260, 0.5, 7, 53, 2.2);
  function hillPath(h) { let d = 'M' + (MX0 - 20) + ' 1320L' + (MX0 - 20) + ' ' + N(h(MX0 - 20)); for (let x = MX0; x <= MX0 + MXW + 20; x += 20) d += 'L' + x + ' ' + N(h(x)); return d + 'L' + (MX0 + MXW + 20) + ' 1320Z'; }
  function meadowData() {
    const r = rng(501), k = MXW / 1440; let fb = '', fm = '', ff = '', fc = '', gb = '', gm = '';
    for (let i = 0; i < Math.round(420 * k); i++) { const x = MX0 + r() * MXW, y0 = HB(x) + 5, y1 = HM(x) + 10, y = y0 + r() * (y1 - y0); fb += circ(x, y, 1 + r() * 0.9); }
    for (let i = 0; i < Math.round(300 * k); i++) { const x = MX0 + r() * MXW, y0 = HM(x) + 6, y1 = HF(x) + 10, y = y0 + r() * (y1 - y0); fm += circ(x, y, 1.8 + r() * 1.6); }
    for (let i = 0; i < Math.round(250 * k); i++) { const x = MX0 + r() * MXW, y0 = HF(x) + 8, y = y0 + Math.pow(r(), 1.3) * (980 - y0), kk = (y - 260) / 640, rad = 3 + 10 * kk; ff += ell(x, y, rad, rad * 0.78, (r() - 0.5) * 30); if (rad > 6) fc += circ(x, y - rad * 0.05, rad * 0.3); }
    for (let x = MX0; x < MX0 + MXW; x += 5) { const y = HF(x) + 3; gb += 'M' + N(x) + ' ' + N(y) + 'l' + N((r() - 0.5) * 6) + ' ' + N(-6 - r() * 11); }
    for (let x = MX0; x < MX0 + MXW; x += 7) { const y = HM(x) + 2; gm += 'M' + N(x) + ' ' + N(y) + 'l' + N((r() - 0.5) * 4) + ' ' + N(-4 - r() * 6); }
    return { back: hillPath(HB), mid: hillPath(HM), front: hillPath(HF), fb: fb, fm: fm, ff: ff, fc: fc, gb: gb, gm: gm };
  }
  function mountData() {
    const lerp = function (a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; };
    function range(base, amp, step, seed) { const q = rng(seed), pts = [[-1620, 520]], pk = []; let k = 0; for (let x = -1600; x <= 3060; x += step) { const hi = k % 2 === 0; pts.push([x + (q() - 0.5) * step * 0.5, hi ? base - amp * (0.55 + 0.45 * q()) : base - amp * (0.12 + 0.28 * q())]); if (hi) pk.push(pts.length - 1); k++; } pts.push([3080, 520]); return { pts: pts, pk: pk }; }
    const a = range(210, 160, 64, 611), b = range(236, 104, 50, 622);
    let snow = '';
    a.pk.forEach(function (i) { if (i < 2 || i > a.pts.length - 3) return; const p = a.pts[i], l = a.pts[i - 1], n = a.pts[i + 1]; if (p[1] > 120) return; const L1 = lerp(p, l, 0.34), R1 = lerp(p, n, 0.34), m1 = lerp(L1, R1, 0.33), m2 = lerp(L1, R1, 0.66); snow += line([p, L1, [m1[0], m1[1] + 9], [m2[0], m2[1] - 1], R1]) + 'Z'; });
    return { far: line(a.pts) + 'Z', near: line(b.pts) + 'Z', snow: snow };
  }
  const ROCK = {
    l: smooth([[20, 250], [60, 120], [170, 40], [320, 30], [440, 90], [525, 210], [548, 360], [520, 520], [470, 650], [440, 860], [0, 860], [0, 420]]),
    l2: smooth([[380, 640], [430, 585], [510, 590], [560, 650], [560, 860], [370, 860], [350, 740]]),
    lc: 'M300 120Q336 200 302 268T322 380M150 200Q180 260 160 330',
    r: smooth([[560, 260], [520, 120], [400, 40], [250, 36], [120, 100], [40, 230], [20, 390], [50, 560], [110, 700], [140, 880], [580, 880], [580, 420]]),
    r2: smooth([[200, 660], [140, 610], [60, 620], [0, 690], [0, 880], [210, 880], [230, 760]]),
    rc: 'M260 110Q228 196 262 262T246 372M420 210Q392 270 410 340'
  };
  function starsPath(c) { const r = rng(91); let d = ''; for (let i = 0; i < c.n; i++) d += circ(c.x0 + r() * c.w, c.h * Math.pow(r(), 1.6), 0.6 + r() * 1.1); return d; }
  function clouds(list) { return list.map(function (c) { return { y: c[0], w: c[1], h: Math.round(c[1] * 0.55), href: '#cloud' + c[2], v: c[3], x0: c[4], o: c[5] == null ? 1 : c[5] }; }); }

  /* Dos composiciones: escritorio (1440×900) y celular (390×844). Se escalan a la pantalla. */
  const SC = {
    d: {
      W: 1440, H: 900, minW: 1320, trig: 24, k: 1,
      avoH: 450, y0: 470, y1: 545, worldC: 220, avoSC: 1, skyA: 420, skyC: 120, farA: 260, nearA: 900,
      mountA: 420, mountC: 110, meadowA: 620, rockX: 560, rockY: 440, rockOffL: 150, rockOffR: 410, titleUp: 300, shift: 24,
      lpos: [[180, 395], [970, 395], [180, 615], [970, 615]],
      lines: [[640, 460, 'M640 460L560 426H470'], [800, 460, 'M800 460L880 426H970'], [588, 640, 'M588 640L530 646H470'], [852, 640, 'M852 640L910 646H970']],
      far: clouds([[120, 420, 1, 15, 720, 0.9], [262, 300, 2, 21, 1300, 0.75], [40, 360, 3, 11, 1500, 0.8], [338, 260, 4, 18, 600, 0.62]]),
      near: clouds([[560, 780, 3, 24, 690], [612, 720, 1, 30, 1660], [738, 900, 2, 19, 1280]]),
      birds: [{ y: 300, x0: 220, v: 34, s: 1, p: 0 }, { y: 318, x0: 252, v: 34, s: 0.78, p: 1.4 }, { y: 290, x0: 276, v: 34, s: 0.66, p: 2.6 }, { y: 420, x0: 1200, v: 26, s: 0.9, p: 0.7 }],
      stars: { x0: -1000, w: 3440, h: 720, n: 290, left: -1030 }
    },
    m: {
      W: 390, H: 844, minW: 380, trig: 20, k: 0.42,
      avoH: 292, y0: 400, y1: 470, worldC: 170, avoSC: 0.82, skyA: 380, skyC: 100, farA: 200, nearA: 700,
      mountA: 450, mountC: 90, meadowA: 520, rockX: 320, rockY: 400, rockOffL: 300, rockOffR: 138, titleUp: 240, shift: 0,
      lpos: [[20, 640], [199, 640], [20, 704], [199, 704]],
      lines: [],
      far: clouds([[96, 240, 1, 8, 360, 0.9], [214, 180, 2, 11, 480, 0.75], [30, 200, 3, 6, 420, 0.8]]),
      near: clouds([[520, 420, 3, 12, 350], [600, 380, 1, 15, 620], [716, 480, 2, 10, 510]]),
      birds: [{ y: 270, x0: 60, v: 14, s: 0.8, p: 0 }, { y: 284, x0: 82, v: 14, s: 0.62, p: 1.4 }, { y: 380, x0: 300, v: 11, s: 0.7, p: 0.7 }],
      stars: { x0: -1000, w: 2390, h: 640, n: 370, left: -1000 }
    }
  };
  const CTA_SETS = {
    d: clouds([[-20, 360, 1, 14, 700, 0.9], [372, 460, 3, 10, 1700], [96, 220, 4, 18, 1000, 0.7]]),
    m: clouds([[-16, 220, 1, 7, 300, 0.9], [318, 280, 3, 5, 520], [70, 150, 4, 9, 420, 0.7]])
  };

  /* ================= Recetas ================= */
  const MEALMAP = {}; CONTENT.momentos.forEach(function (m) { MEALMAP[m.id] = m; });
  const DISH = { d1: dAvena, d2: dTofu, d3: dPanq, a1: dPorotos, a2: dCharqui, a3: dQuinoa, o1: dSopai, o2: dPan, o3: dQueque, c1: dCrema, c2: dTalla, c3: dTortilla };
  const REC_OF = {};
  const RECIPES = CONTENT.recetas.map(function (r, i) {
    const m = MEALMAP[r.momento], rr = rng(700 + i); let st = '', sb = '';
    if (m.noche) {
      for (let k = 0; k < 40; k++) st += circ(rr() * 320, rr() * 170, 0.5 + rr() * 1.1);
      for (let k = 0; k < 120; k++) sb += circ(rr() * 400, rr() * 800, 0.6 + rr() * 1.0);
    }
    if (r.rec) REC_OF[r.momento] = r.id;
    const kind = r.tipo === 'rapida' ? 'Rápida' : 'Elaborada';
    return {
      id: r.id, momento: r.momento, tipo: r.tipo, receta: r.nombre, corto: r.corto || r.nombre, desc: r.desc, rec: !!r.rec,
      upper: m.nombre.toUpperCase(), hora: m.hora, cielo: m.cielo, acento: m.acento, noche: m.noche, stars: st, starsBig: sb, cloudO: m.noche ? 0.22 : 0.9,
      alt: r.nombre + ', vista desde arriba', art: artSVG(flat(DISH[r.id](), 2.4)), tags: r.tags.map(function (t) { return TAGS[t]; }),
      meta: r.tiempo + ' · ' + kind, time: r.tiempo, portions: r.porciones, kindLow: kind.toLowerCase(),
      ingredientes: r.ingredientes, pasos: r.pasos,
      search: norm(r.nombre + ' ' + r.desc + ' ' + r.ingredientes.join(' ') + ' ' + m.nombre)
    };
  });
  const RMAP = {}; RECIPES.forEach(function (r) { RMAP[r.id] = r; });
  const F_MEALS = [{ id: 'todas', label: 'Todas' }].concat(CONTENT.momentos.map(function (m) { return { id: m.id, label: m.nombre, color: m.acento }; }), [{ id: 'favoritas', label: 'Favoritas' }]);
  const F_KINDS = [{ id: 'todas', label: 'Todas' }, { id: 'rapida', label: 'Rápidas' }, { id: 'elaborada', label: 'Elaboradas' }];

  /* ================= Estado (favoritas y semana se guardan en el navegador) ================= */
  const STORE = 'recetario-vegano-2:v1';
  const S = { light: 'almuerzo', fMeal: 'todas', fKind: 'todas', q: '', favs: {}, week: {}, checked: {}, sel: null, drawer: false, menu: false, flash: null };
  function load() {
    try {
      const o = JSON.parse(localStorage.getItem(STORE) || 'null'); if (!o || typeof o !== 'object') return;
      Object.keys(o.favs || {}).forEach(function (id) { if (RMAP[id] && o.favs[id]) S.favs[id] = true; });
      Object.keys(o.week || {}).forEach(function (id) { const d = o.week[id]; if (RMAP[id] && d >= 0 && d < 7) S.week[id] = d | 0; });
      Object.keys(o.checked || {}).forEach(function (k) { if (o.checked[k]) S.checked[k] = true; });
    } catch (e) { /* sin almacenamiento: se usa solo en memoria */ }
  }
  function save() { try { localStorage.setItem(STORE, JSON.stringify({ favs: S.favs, week: S.week, checked: S.checked })); } catch (e) { /* ignorar */ } }
  function weekList() { return RECIPES.filter(function (r) { return S.week[r.id] != null; }).sort(function (a, b) { return (S.week[a.id] - S.week[b.id]) || (ORDER.indexOf(a.momento) - ORDER.indexOf(b.momento)); }); }

  /* ================= Referencias ================= */
  const $ = function (id) { return document.getElementById(id); };
  const R = {};
  let MODE = null, G = SC.d, CTA_MODE = null, CTA_SET = CTA_SETS.d, LETTERS = [];
  let VW = 1440, LEFT = 0, CTA_W = 1440;
  let FAR_EL = [], NEAR_EL = [], BIRD_EL = [], CTA_EL = [], CH_EL = [], LABEL_EL = [], LINE_EL = [];
  let RM = false, FINE = true, T0 = 0, LAST = 0, TAU = null, MX = 0, MY = 0, MXT = 0, MYT = 0, LAST_SEL = null, RET = null, FLASH_T = 0;
  const FL = {}, CARD = {};

  /* ================= Construcción ================= */
  function setD(id, d) { const el = $(id); if (el) el.setAttribute('d', d); }
  function buildLandscape() {
    const MD = meadowData(), MT = mountData();
    setD('hBack', MD.back); setD('hBack2', MD.back); setD('fBack', MD.fb); setD('hMid', MD.mid);
    setD('gMid', MD.gm); setD('fMid', MD.fm); setD('hFront', MD.front);
    setD('gFront', MD.gb); setD('fFront', MD.ff); setD('cFront', MD.fc);
    setD('mFar', MT.far); setD('mSnow', MT.snow); setD('mNear', MT.near);
    ['rl', 'rl2'].forEach(function (k) { document.querySelectorAll('.p-' + k).forEach(function (el) { el.setAttribute('d', ROCK[k === 'rl' ? 'l' : 'l2']); }); });
    ['rr', 'rr2'].forEach(function (k) { document.querySelectorAll('.p-' + k).forEach(function (el) { el.setAttribute('d', ROCK[k === 'rr' ? 'r' : 'r2']); }); });
    setD('rlc', ROCK.lc); setD('rrc', ROCK.rc);
  }
  function cloudHTML(c) { return '<div class="cloud" style="top:' + c.y + 'px;width:' + c.w + 'px;height:' + c.h + 'px;opacity:' + c.o + '"><svg viewBox="0 0 400 220" width="' + c.w + '" height="' + c.h + '" aria-hidden="true"><use href="' + c.href + '"></use></svg></div>'; }
  function setMode(mode) {
    MODE = mode; G = SC[mode];
    R.stage.classList.toggle('scene-m', mode === 'm'); R.stage.classList.toggle('scene-d', mode === 'd');
    const sc = G.stars;
    R.stars.setAttribute('viewBox', sc.x0 + ' 0 ' + sc.w + ' ' + sc.h);
    R.stars.style.left = sc.left + 'px'; R.stars.style.width = sc.w + 'px'; R.stars.style.height = sc.h + 'px';
    setD('starsPath', starsPath(sc));
    R.far.innerHTML = G.far.map(cloudHTML).join(''); FAR_EL = Array.prototype.slice.call(R.far.children);
    R.near.innerHTML = G.near.map(cloudHTML).join(''); NEAR_EL = Array.prototype.slice.call(R.near.children);
    R.birds.innerHTML = G.birds.map(function () { return '<div class="bird"><svg width="26" height="10" viewBox="-13 -8 26 10" aria-hidden="true"><path d="M-12 0Q-6 -7 0 0Q6 -7 12 0" fill="none" stroke="#28425e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div>'; }).join('');
    BIRD_EL = Array.prototype.slice.call(R.birds.children);
    R.linesG.innerHTML = G.lines.map(function (l) { return '<path class="ln" d="' + circ(l[0], l[1], 3.5) + l[2] + '" pathLength="1"></path>'; }).join('');
    LINE_EL = Array.prototype.slice.call(R.linesG.children);
    buildLabels(); buildLetters();
  }
  function buildLabels() {
    const desk = MODE === 'd';
    R.labels.innerHTML = CONTENT.momentos.map(function (m, i) {
      const pos = G.lpos[i], rec = RMAP[REC_OF[m.id]];
      const lh = desk ? m.hora + ' · ' + m.nombre.toUpperCase() : m.hora, lr = desk ? rec.corto : m.nombre;
      return '<div class="label glass" data-m="' + m.id + '" style="left:' + pos[0] + 'px;top:' + pos[1] + 'px"><span class="lt"><span class="lh">' + esc(lh) + '</span><span class="lr">' + esc(lr) + '</span></span>' +
        '<button class="sq" type="button" data-act="pick" data-id="' + m.id + '" tabindex="-1" aria-label="Ver recetas de ' + esc(m.nombre.toLowerCase()) + '">' + icon(m.icono, 20) + '</button></div>';
    }).join('');
    LABEL_EL = Array.prototype.slice.call(R.labels.children);
    LABEL_EL.forEach(function (el) {
      const id = el.getAttribute('data-m');
      el.addEventListener('mouseenter', function () { setLight(id); });
      el.querySelector('button').addEventListener('focus', function () { setLight(id); });
      el._vis = false;
    });
    updateLight();
  }
  function buildLetters() {
    LETTERS = []; const words = [];
    CONTENT.titulo.split(' ').forEach(function (word) {
      const idx = [];
      word.split('').forEach(function (ch) { const i = LETTERS.length, r = rng(300 + i), side = i % 2 ? 1 : -1, k = G.k; LETTERS.push({ ch: ch, sx: side * (320 + r() * 480) * k, sy: -(220 + r() * 260) * k, cx: side * (-120 - r() * 220) * k, cy: (160 + r() * 220) * k, r0: side * (50 + r() * 110) }); idx.push(i); });
      words.push(idx);
    });
    R.titleArt.innerHTML = words.map(function (w) { return '<span class="w">' + w.map(function (i) { return '<span class="ch">' + esc(LETTERS[i].ch) + '</span>'; }).join('') + '</span>'; }).join('');
    CH_EL = Array.prototype.slice.call(R.titleArt.querySelectorAll('.ch'));
  }
  function buildCta(mode) {
    CTA_MODE = mode; CTA_SET = CTA_SETS[mode];
    R.ctaClouds.innerHTML = CTA_SET.map(cloudHTML).join(''); CTA_EL = Array.prototype.slice.call(R.ctaClouds.children);
  }
  function tagsHTML(r, withTitle) { return r.tags.map(function (t) { return '<span class="tag"' + (withTitle ? ' title="' + esc(t.label) + '"' : '') + '><svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + t.icon + '"></path></svg>' + esc(t.label) + '</span>'; }).join(''); }
  function miniArt(r, big) {
    const stars = !r.noche ? '' : (big
      ? '<svg class="mstars" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path d="' + r.starsBig + '" fill="#ffffff" opacity="0.85"></path></svg>'
      : '<svg class="mstars" viewBox="0 0 320 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path d="' + r.stars + '" fill="#ffffff" opacity="0.85"></path></svg>');
    return stars +
      '<svg class="mcloud a" viewBox="0 0 400 220" aria-hidden="true" style="opacity:' + r.cloudO + '"><use href="#cloud2"></use></svg>' +
      '<svg class="mcloud b" viewBox="0 0 400 220" aria-hidden="true" style="opacity:' + r.cloudO + '"><use href="#cloud4"></use></svg>' +
      '<span class="mshadow"></span><svg class="dish" viewBox="-320 -320 640 640" aria-hidden="true">' + r.art + '</svg>';
  }
  function buildCards() {
    R.grid.innerHTML = RECIPES.map(function (r) {
      return '<article class="card rv" data-card="' + r.id + '"><div class="tilt">' +
        '<button class="mini" type="button" data-act="open" data-id="' + r.id + '" tabindex="-1" aria-hidden="true" style="background-image:' + r.cielo + '">' + miniArt(r) +
        (r.rec ? '<span class="rec"><svg width="11" height="11" viewBox="0 0 16 16" aria-hidden="true"><path d="' + STAR + '" fill="#d99a1e"></path></svg>Recomendada</span>' : '') + '</button>' +
        '<div class="cbody"><p class="chip"><span class="dot" style="background-color:' + r.acento + '"></span>' + esc(r.upper) + ' · ' + esc(r.hora) + '</p>' +
        '<h3 class="cname"><button type="button" data-act="open" data-id="' + r.id + '">' + esc(r.receta) + '</button></h3>' +
        '<p class="desc">' + esc(r.desc) + '</p><div class="tags">' + tagsHTML(r, true) + '</div>' +
        '<div class="crow"><span class="meta">' + esc(r.meta) + '</span>' +
        '<button class="fav" type="button" data-act="fav" data-id="' + r.id + '"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="' + HEART + '"></path></svg></button>' +
        '<button class="sq add" type="button" data-act="add" data-id="' + r.id + '">' + icon(PLUS, 18, 2) + '</button></div></div></div></article>';
    }).join('');
    RECIPES.forEach(function (r) {
      const el = R.grid.querySelector('[data-card="' + r.id + '"]'), tilt = el.querySelector('.tilt');
      CARD[r.id] = { el: el, fav: el.querySelector('.fav'), heart: el.querySelector('.fav path'), add: el.querySelector('.add'), addPath: el.querySelector('.add path') };
      tilt.addEventListener('mousemove', onTilt); tilt.addEventListener('mouseleave', offTilt);
    });
  }
  function buildFilters() {
    R.fMeals.innerHTML = F_MEALS.map(function (f) { return '<button class="fchip" type="button" data-act="fmeal" data-v="' + f.id + '" aria-pressed="false">' + (f.color ? '<span class="dot" style="background-color:' + f.color + '"></span>' : '') + esc(f.label) + '</button>'; }).join('');
    R.fKinds.innerHTML = F_KINDS.map(function (f) { return '<button class="segb" type="button" data-act="fkind" data-v="' + f.id + '" aria-pressed="false">' + esc(f.label) + '</button>'; }).join('');
  }
  function buildNutri() {
    R.ngrid.innerHTML = CONTENT.nutricion.map(function (n, i) {
      return '<article class="ncard rv c' + (i % 3 + 1) + '"><div class="nhead"><span class="nsym anton" style="background-color:' + n.color + '" aria-hidden="true">' + esc(n.sym) + '</span><div><h3>' + esc(n.titulo) + '</h3><p class="nsub">' + esc(n.sub) + '</p></div></div>' +
        '<p class="ntext">' + esc(n.texto) + '</p><p class="nlabel">DÓNDE ESTÁ</p><div class="nfoods">' + n.fuentes.map(function (f) { return '<span class="food">' + esc(f) + '</span>'; }).join('') + '</div>' +
        '<p class="ntip"><strong>Consejo:</strong> ' + esc(n.tip) + '</p></article>';
    }).join('');
  }

  /* ================= Actualizaciones ================= */
  function visible() {
    const q = norm(S.q.trim());
    return RECIPES.filter(function (r) {
      if (S.fMeal === 'favoritas') { if (!S.favs[r.id]) return false; } else if (S.fMeal !== 'todas' && r.momento !== S.fMeal) return false;
      if (S.fKind !== 'todas' && r.tipo !== S.fKind) return false;
      return !q || r.search.indexOf(q) >= 0;
    });
  }
  function updateFilters() {
    document.querySelectorAll('[data-act="fmeal"]').forEach(function (b) { const on = b.getAttribute('data-v') === S.fMeal; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
    document.querySelectorAll('[data-act="fkind"]').forEach(function (b) { const on = b.getAttribute('data-v') === S.fKind; b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on)); });
    if (R.q.value !== S.q) R.q.value = S.q;
  }
  function updateCards() {
    const list = visible(), pos = {};
    list.forEach(function (r, i) { pos[r.id] = i; });
    RECIPES.forEach(function (r) {
      const c = CARD[r.id], i = pos[r.id], inW = S.week[r.id] != null, isF = !!S.favs[r.id];
      c.el.hidden = i == null;
      if (i != null) c.el.className = 'card rv c' + (i % 4 + 1) + (S.flash === r.id ? ' flash' : '');
      c.fav.classList.toggle('on', isF); c.fav.setAttribute('aria-pressed', String(isF)); c.fav.setAttribute('aria-label', (isF ? 'Quitar de favoritas: ' : 'Guardar en favoritas: ') + r.receta); c.heart.setAttribute('fill', isF ? 'currentColor' : 'none');
      c.add.classList.toggle('added', inW); c.add.setAttribute('aria-pressed', String(inW)); c.add.setAttribute('aria-label', (inW ? 'Quitar de Mi semana: ' : 'Agregar a Mi semana: ') + r.receta); c.addPath.setAttribute('d', inW ? CHECK : PLUS);
    });
    const n = list.length, q = S.q.trim();
    let label = n + (n === 1 ? ' receta' : ' recetas');
    if (S.fMeal === 'favoritas') label += ' en favoritas'; else if (S.fMeal !== 'todas') label += ' de ' + MEALMAP[S.fMeal].nombre.toLowerCase();
    if (S.fKind !== 'todas') label += S.fKind === 'rapida' ? ' · rápidas' : ' · elaboradas';
    if (q) label += ' con “' + q + '”';
    R.count.textContent = label;
    const anyFav = RECIPES.some(function (r) { return S.favs[r.id]; });
    R.empty.hidden = n > 0;
    R.emptyMsg.textContent = S.fMeal === 'favoritas' && !anyFav ? 'Todavía no guardas favoritas: toca el corazón de una receta para tenerla a mano.' : 'No encontramos recetas con esos filtros.';
  }
  function updateBadge() {
    const n = weekList().length;
    R.badge.textContent = String(n); R.badge.hidden = n === 0;
    R.cartBtn.setAttribute('aria-label', 'Abrir Mi semana' + (n ? ': ' + n + (n === 1 ? ' receta' : ' recetas') : ''));
  }
  function setLight(id) { if (S.light === id) return; S.light = id; updateLight(); }
  function updateLight() {
    ORDER.forEach(function (m) { R.stage.classList.toggle('light-' + m, m === S.light); });
    LABEL_EL.forEach(function (el) { el.classList.toggle('on', el.getAttribute('data-m') === S.light); });
  }
  function refresh() { updateFilters(); updateCards(); updateBadge(); }

  /* ================= Acciones ================= */
  function toggleFav(id) { if (S.favs[id]) delete S.favs[id]; else S.favs[id] = true; save(); updateCards(); }
  function toggleWeek(id) {
    if (S.week[id] != null) {
      delete S.week[id];
      Object.keys(S.checked).forEach(function (k) { if (k.indexOf(id + ':') === 0) delete S.checked[k]; });
    } else {
      const mo = RMAP[id].momento; let d = 0;
      for (let i = 0; i < 7; i++) { if (!RECIPES.some(function (r) { return S.week[r.id] === i && r.momento === mo; })) { d = i; break; } }
      S.week[id] = d;
    }
    save(); updateCards(); updateBadge();
  }
  function scrollToY(y) { const top = Math.max(0, Math.round(y)); try { window.scrollTo({ top: top, behavior: RM ? 'auto' : 'smooth' }); } catch (e) { window.scrollTo(0, top); } }
  function goTo(v) {
    if (v === 'top') scrollToY(0);
    else if (v === 'momentos') scrollToY(G.trig * 3);
    else if (v === 'recetas') scrollToY(R.recetas.offsetTop + 30);
    else if (v === 'nutricion') scrollToY(R.nutricion.offsetTop - 20);
    else if (v === 'como') scrollToY(R.como.offsetTop - 20);
  }
  function showMeal(id, flash) {
    S.fMeal = id; S.fKind = 'todas'; S.q = ''; S.flash = flash ? REC_OF[id] : null;
    updateFilters(); updateCards(); goTo('recetas');
    clearTimeout(FLASH_T);
    if (flash) FLASH_T = setTimeout(function () { S.flash = null; updateCards(); }, 2400);
  }
  function syncLock() {
    const any = !!(S.sel || S.drawer || S.menu);
    document.documentElement.classList.toggle('lock', any);
    R.app.inert = any;
    R.modal.inert = !S.sel; R.drawer.inert = !S.drawer; R.mpanel.inert = !S.menu;
  }
  function remember() { RET = document.activeElement; }
  function restore() { const el = RET; RET = null; if (el && el.focus && document.contains(el)) { try { el.focus({ preventScroll: true }); } catch (e) { /* ignorar */ } } }
  function focusSoon(el) { setTimeout(function () { if (el && el.focus) { try { el.focus({ preventScroll: true }); } catch (e) { /* ignorar */ } } }, 60); }
  function openRecipe(id) {
    if (!RMAP[id]) return;
    remember(); S.sel = id; LAST_SEL = id; renderModal();
    R.sinner.scrollTop = 0; R.sbody.scrollTop = 0;
    R.modal.classList.add('open'); R.modal.setAttribute('aria-hidden', 'false'); syncLock(); focusSoon(R.mClose);
  }
  function closeModal() { if (!S.sel) return; S.sel = null; R.modal.classList.remove('open'); R.modal.setAttribute('aria-hidden', 'true'); syncLock(); restore(); }
  function openDrawer() { if (S.menu) toggleMenu(false, true); remember(); S.drawer = true; renderDrawer(); R.drawer.classList.add('open'); R.drawer.setAttribute('aria-hidden', 'false'); syncLock(); focusSoon(R.dClose); }
  function closeDrawer() { if (!S.drawer) return; S.drawer = false; R.drawer.classList.remove('open'); R.drawer.setAttribute('aria-hidden', 'true'); syncLock(); restore(); }
  function toggleMenu(open, silent) {
    S.menu = open == null ? !S.menu : !!open;
    document.body.classList.toggle('menu-open', S.menu);
    R.mpanel.setAttribute('aria-hidden', String(!S.menu)); R.burger.setAttribute('aria-expanded', String(S.menu));
    syncLock();
    if (S.menu) focusSoon(R.mClose2); else if (!silent) focusSoon(R.burger);
  }
  function renderModal() {
    const r = RMAP[S.sel || LAST_SEL] || RECIPES[0], inW = S.week[r.id] != null, isF = !!S.favs[r.id];
    R.mHero.style.backgroundImage = r.cielo;
    R.mArt.innerHTML = miniArt(r, true);
    const dish = R.mArt.querySelector('.dish'); dish.setAttribute('role', 'img'); dish.setAttribute('aria-label', r.alt); dish.removeAttribute('aria-hidden');
    const li = function (t) { return '<li>' + esc(t) + '</li>'; };
    R.sbody.innerHTML = '<p class="chip"><span class="dot" style="background-color:' + r.acento + '"></span>' + esc(r.upper) + ' · ' + esc(r.hora) + '</p>' +
      '<h2 id="m-title" class="anton">' + esc(r.receta) + '</h2><p class="sdesc">' + esc(r.desc) + '</p>' +
      '<div class="smeta"><span>' + esc(r.time) + '</span><span>' + esc(r.portions) + '</span><span>Receta ' + esc(r.kindLow) + '</span></div>' +
      '<div class="tags">' + tagsHTML(r, false) + '</div>' +
      '<div class="scols"><div><h3>INGREDIENTES</h3><ul class="ing">' + r.ingredientes.map(li).join('') + '</ul></div><div><h3>PREPARACIÓN</h3><ol class="pasos">' + r.pasos.map(li).join('') + '</ol></div></div>' +
      '<div class="sactions"><button class="btn-dark" type="button" data-act="add" data-id="' + r.id + '">' + (inW ? 'Quitar de Mi semana' : 'Agregar a Mi semana') + '</button>' +
      '<button class="btn-line" type="button" data-act="fav" data-id="' + r.id + '" aria-pressed="' + isF + '">' + (isF ? 'En favoritas' : 'Guardar en favoritas') + '</button></div>' +
      (inW ? '<p class="wnote">Está en tu semana: ' + DAYS[S.week[r.id]].toLowerCase() + '.</p>' : '');
  }
  function pendingCount() { let p = 0; weekList().forEach(function (r) { r.ingredientes.forEach(function (g, j) { if (!S.checked[r.id + ':' + j]) p++; }); }); return p; }
  function updateDrawerSub() {
    const list = weekList(), days = {};
    list.forEach(function (r) { days[S.week[r.id]] = true; });
    const nd = Object.keys(days).length, p = pendingCount();
    R.dSub.textContent = list.length ? list.length + (list.length === 1 ? ' receta' : ' recetas') + ' en ' + nd + (nd === 1 ? ' día' : ' días') + ' · ' + p + (p === 1 ? ' cosa' : ' cosas') + ' por comprar' : 'Todavía no agregas recetas.';
  }
  function renderDrawer() {
    const list = weekList();
    updateDrawerSub();
    if (!list.length) { R.dBody.innerHTML = '<p class="dempty">Toca + en una receta para sumarla a tu semana. Aquí eliges el día y se arma la lista de compras con todo lo que lleva.</p>'; return; }
    let html = '';
    DAYS.forEach(function (name, d) {
      const items = list.filter(function (r) { return S.week[r.id] === d; });
      if (!items.length) return;
      html += '<div class="dday"><p class="ddn">' + name + '</p><ul class="dweek">' + items.map(function (r) {
        return '<li><span class="dot" style="background-color:' + r.acento + '"></span><span class="dn">' + esc(r.receta) + '<span class="ds">' + esc(r.upper) + '</span></span>' +
          '<label class="dsel"><span class="sr">Día para ' + esc(r.receta) + '</span><select data-id="' + r.id + '">' + DAYS_S.map(function (s, i) { return '<option value="' + i + '"' + (i === d ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></label>' +
          '<button class="dx" type="button" data-act="remove" data-id="' + r.id + '" aria-label="Quitar de Mi semana: ' + esc(r.receta) + '">' + icon(XMARK, 16) + '</button></li>';
      }).join('') + '</ul></div>';
    });
    html += '<p class="dh3">LISTA DE COMPRAS</p><ul class="dlist">';
    list.forEach(function (r) {
      r.ingredientes.forEach(function (g, j) {
        const k = r.id + ':' + j, on = !!S.checked[k];
        html += '<li><label class="chk' + (on ? ' done' : '') + '"><input type="checkbox" data-k="' + k + '"' + (on ? ' checked' : '') + '><span>' + esc(g) + '</span></label><span class="dfrom">' + esc(r.corto) + '</span></li>';
      });
    });
    R.dBody.innerHTML = html + '</ul>';
  }

  /* ================= Animación ================= */
  function tr(x, y) { return 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)'; }
  function layout() {
    const vw = window.innerWidth || 1440, vh = R.stage.clientHeight || window.innerHeight || 900;
    const mode = (vw < 820 || vw / vh < 1.05) ? 'm' : 'd';
    if (mode !== MODE) setMode(mode);
    const s = Math.min(vh / G.H, vw / G.minW);
    VW = vw / s; LEFT = (G.W - VW) / 2;
    const t = 'translate(-50%,-50%) scale(' + s.toFixed(4) + ')';
    R.sceneBack.style.transform = t; R.sceneFront.style.transform = t;
    R.rockL.style.left = (LEFT - G.rockOffL).toFixed(1) + 'px';
    R.rockR.style.left = (G.W - LEFT - G.rockOffR).toFixed(1) + 'px';
    const cm = vw < 820 ? 'm' : 'd'; if (cm !== CTA_MODE) buildCta(cm);
    CTA_W = R.cta.clientWidth || vw;
  }
  function drift(els, list, amp, vw, left, t) {
    for (let i = 0; i < list.length; i++) {
      const el = els[i]; if (!el) continue;
      const c = list[i], span = vw + c.w + 160;
      el.style.transform = tr(left + wrap(c.x0 - left + c.v * t, span) - c.w - 80, amp * Math.sin(t * 0.35 + i * 1.7));
    }
  }
  function ambient(t, st, hh, vh) {
    if (st < hh + 40) {
      drift(FAR_EL, G.far, 4, VW, LEFT, t); drift(NEAR_EL, G.near, 6, VW, LEFT, t);
      for (let i = 0; i < G.birds.length; i++) {
        const el = BIRD_EL[i]; if (!el) continue;
        const b = G.birds[i], x = LEFT + wrap(b.x0 - LEFT + b.v * t, VW + 200) - 100, y = b.y + 7 * Math.sin(t * 0.7 + b.p), fl = 0.45 + 0.55 * Math.abs(Math.sin(t * 6.5 + b.p));
        el.style.transform = tr(x, y) + ' scale(' + b.s + ',' + (b.s * fl).toFixed(3) + ')';
      }
    }
    const ct = R.cta.offsetTop, ch = R.cta.offsetHeight;
    if (st + vh > ct && st < ct + ch) drift(CTA_EL, CTA_SET, 4, CTA_W, 0, t);
  }
  function paint(p, t) {
    const pA = clamp(p / 0.35), pC = clamp((p - 0.7) / 0.3), eA = eio(pA), eC = eio(pC);
    const mx = MODE === 'd' && !RM ? MX : 0, my = MODE === 'd' && !RM ? MY : 0;
    R.sky.style.transform = tr(-8 * mx, -(G.skyA * eA + G.skyC * eC) - 5 * my);
    R.far.style.transform = tr(-16 * mx, -(G.farA * eA + 50 * eC) - 6 * my);
    R.near.style.transform = tr(-30 * mx, -G.nearA * eA - 8 * my) + ' scale(' + (1 + 0.6 * eA).toFixed(3) + ')';
    R.near.style.opacity = (1 - clamp((pA - 0.3) / 0.55)).toFixed(3);
    R.mount.style.transform = tr(-12 * mx, G.mountA * (1 - eA) - G.mountC * eC - 4 * my);
    R.meadow.style.transform = tr(-20 * mx, G.meadowA * (1 - eA) - G.worldC * eC - 4 * my);
    const eR = eio(clamp((pA - 0.12) / 0.88));
    R.rockL.style.transform = tr(-G.rockX * (1 - eR) - 34 * mx, G.rockY * (1 - eR) - G.worldC * eC);
    R.rockR.style.transform = tr(G.rockX * (1 - eR) - 34 * mx, G.rockY * (1 - eR) - G.worldC * eC);
    const amp = RM ? 0 : 1 - eA, ph = t * Math.PI * 2 / 5, intro = RM ? 1 : eout(clamp(t / 1.1));
    const yBase = G.y0 + (G.y1 - G.y0) * eA - G.worldC * eC, s = 1 - (1 - G.avoSC) * eC;
    const y = yBase + 12 * Math.sin(ph) * amp + (1 - intro) * 40, rotA = 360 * eA + 4 * Math.sin(ph + 0.9) * amp;
    R.avo.style.transform = tr(-10 * mx, y - G.avoH / 2) + ' rotate(' + rotA.toFixed(2) + 'deg) scale(' + (s * (0.92 + 0.08 * intro)).toFixed(3) + ')';
    R.avo.style.opacity = intro.toFixed(3);
    const land = eio(clamp((pA - 0.55) / 0.45)), bottom = yBase + G.avoH / 2 * s;
    R.shadow.style.transform = tr(-10 * mx, bottom - 22) + ' scale(' + ((0.45 + 0.55 * land) * s).toFixed(3) + ')';
    R.shadow.style.opacity = (land * 0.9).toFixed(3);
    for (let i = 0; i < LETTERS.length; i++) {
      const el = CH_EL[i]; if (!el) continue;
      const Lt = LETTERS[i], ti = RM ? 1 : clamp((t - 0.2 - i * 0.05) / 0.9), b = ti >= 1 ? 1 : backOut(ti), u = 1 - b;
      const x = u * u * Lt.sx + 2 * u * b * Lt.cx; let yy = u * u * Lt.sy + 2 * u * b * Lt.cy, op = clamp(ti * 1.8);
      const bl = 8 * clamp(1 - b), xo = clamp((pA - i * 0.022) / 0.3);
      yy -= G.titleUp * ein(xo); op *= 1 - xo;
      el.style.transform = tr(x, yy) + ' rotate(' + (Lt.r0 * u).toFixed(1) + 'deg) scale(' + (0.4 + 0.6 * b).toFixed(3) + ')';
      el.style.opacity = op.toFixed(3);
      el.style.filter = bl > 0.05 ? 'blur(' + bl.toFixed(1) + 'px)' : 'none';
    }
    R.world.style.transform = tr(-10 * mx, -G.worldC * eC);
    for (let i = 0; i < LABEL_EL.length; i++) {
      const st0 = 0.36 + i * 0.07, ld = eio(clamp((p - st0) / 0.12)), la = eout(clamp((p - st0 - 0.05) / 0.12));
      const ln = LINE_EL[i]; if (ln) ln.style.strokeDashoffset = (1 - ld).toFixed(3);
      const lb = LABEL_EL[i], dir = i % 2 === 0 ? 1 : -1, vis = la > 0.5;
      lb.style.opacity = la.toFixed(3);
      lb.style.transform = tr(dir * G.shift * (1 - la), (MODE === 'd' ? 0 : 16) * (1 - la)) + ' scale(' + (0.96 + 0.04 * la).toFixed(3) + ')';
      if (vis !== lb._vis) { lb._vis = vis; lb.style.pointerEvents = vis ? 'auto' : 'none'; lb.querySelector('button').tabIndex = vis ? 0 : -1; }
    }
    [R.hl0, R.hl1].forEach(function (el, k) { const hv = eout(clamp((pC - 0.08 - k * 0.14) / 0.45)); el.style.transform = 'translate3d(0,' + ((1 - hv) * 140).toFixed(1) + '%,0)'; });
    const hb = eout(clamp((pC - 0.5) / 0.4)), bv = hb > 0.5;
    R.btns.style.opacity = hb.toFixed(3); R.btns.style.transform = tr(0, (1 - hb) * 24);
    if (bv !== FL.btns) { FL.btns = bv; R.btns.style.pointerEvents = bv ? 'auto' : 'none'; R.btns.querySelectorAll('a').forEach(function (a) { a.tabIndex = bv ? 0 : -1; }); }
    R.cue.style.opacity = ((1 - clamp(p / 0.05)) * (RM ? 0 : eout(clamp((t - 1.5) / 0.6)))).toFixed(3);
  }
  function reveal(sec, key, st, vh) { if (FL[key]) return; if (st + vh > sec.offsetTop + 160) { FL[key] = true; sec.classList.add('in'); } }
  function loop(now) {
    const st = window.pageYOffset || document.documentElement.scrollTop || 0, hh = R.hero.offsetHeight, vh = window.innerHeight;
    const want = RM || st > G.trig ? 1 : 0;
    const dt = LAST ? Math.min(64, now - LAST) : 16; LAST = now;
    if (TAU == null) TAU = want;
    if (TAU !== want) { const step = dt / 1000 / (want > TAU ? DUR_IN : DUR_OUT); TAU = want > TAU ? Math.min(want, TAU + step) : Math.max(want, TAU - step); }
    const km = 1 - Math.exp(-dt / 420); MX += (MXT - MX) * km; MY += (MYT - MY) * km;
    const t = (now - T0) / 1000;
    ambient(RM ? 0 : t, st, hh, vh);
    if (st < hh + 40) paint(tauP(TAU), RM ? 60 : t);
    const navL = st > hh - 70;
    if (navL !== FL.navL) { FL.navL = navL; document.body.classList.toggle('nav-light', navL); }
    reveal(R.recetas, 'c', st, vh); reveal(R.nutricion, 'n', st, vh); reveal(R.como, 's', st, vh);
    requestAnimationFrame(loop);
  }

  /* ================= Eventos ================= */
  function onTilt(e) {
    if (RM || !FINE) return;
    const el = e.currentTarget, r = el.getBoundingClientRect(); if (!r.width) return;
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.transform = 'perspective(900px) rotateX(' + ((0.5 - y) * 7).toFixed(2) + 'deg) rotateY(' + ((x - 0.5) * 9).toFixed(2) + 'deg)';
  }
  function offTilt(e) { e.currentTarget.style.transform = ''; }
  function onClick(e) {
    const a = e.target.closest('[data-act]'); if (!a) return;
    const act = a.getAttribute('data-act'), id = a.getAttribute('data-id'), v = a.getAttribute('data-v');
    const inModal = !!a.closest('#modal');
    if (a.tagName === 'A') e.preventDefault();
    switch (act) {
      case 'open': openRecipe(id); break;
      case 'fav': toggleFav(id); if (inModal) { renderModal(); focusSoon(R.sbody.querySelector('[data-act="fav"]')); } break;
      case 'add': toggleWeek(id); if (inModal) { renderModal(); focusSoon(R.sbody.querySelector('[data-act="add"]')); } break;
      case 'remove': toggleWeek(id); renderDrawer(); focusSoon(R.dBody.querySelector('select, [data-act="remove"]') || R.dClose); break;
      case 'fmeal': S.fMeal = v; updateFilters(); updateCards(); break;
      case 'fkind': S.fKind = v; updateFilters(); updateCards(); break;
      case 'clear': S.fMeal = 'todas'; S.fKind = 'todas'; S.q = ''; updateFilters(); updateCards(); break;
      case 'pick': setLight(id); showMeal(id, true); break;
      case 'meal': if (S.menu) toggleMenu(false, true); showMeal(v, false); break;
      case 'go': if (S.menu) toggleMenu(false, true); goTo(v); break;
      case 'drawer': openDrawer(); break;
      case 'close-modal': closeModal(); break;
      case 'close-drawer': closeDrawer(); break;
      case 'menu': toggleMenu(); break;
    }
  }
  function onDrawerChange(e) {
    const t = e.target;
    if (t.matches('select[data-id]')) {
      const id = t.getAttribute('data-id'), d = parseInt(t.value, 10);
      if (S.week[id] == null || !(d >= 0 && d < 7)) return;
      S.week[id] = d; save(); renderDrawer(); updateCards();
      focusSoon(R.dBody.querySelector('select[data-id="' + id + '"]'));
    } else if (t.matches('input[data-k]')) {
      const k = t.getAttribute('data-k');
      if (t.checked) S.checked[k] = true; else delete S.checked[k];
      save(); t.closest('.chk').classList.toggle('done', t.checked); updateDrawerSub();
    }
  }
  function onKey(e) {
    if (e.key !== 'Escape') return;
    if (S.sel) closeModal(); else if (S.drawer) closeDrawer(); else if (S.menu) toggleMenu(false);
  }

  /* ================= Inicio ================= */
  function init() {
    ['app', 'stage', 'sceneBack', 'sceneFront', 'sky', 'stars', 'birds', 'far', 'near', 'mount', 'meadow', 'rockL', 'rockR', 'shadow', 'avo', 'world', 'labels', 'linesG', 'titleArt', 'hl0', 'hl1', 'btns', 'cue',
      'recetas', 'nutricion', 'como', 'cta', 'ctaClouds', 'grid', 'fMeals', 'fKinds', 'q', 'count', 'empty', 'emptyMsg', 'ngrid', 'badge', 'cartBtn', 'burger', 'mpanel', 'modal', 'sinner', 'sbody', 'mHero', 'mArt', 'drawer', 'dSub', 'dBody'
    ].forEach(function (id) { R[id] = $(id); });
    R.hero = $('inicio'); R.mClose = $('m-close'); R.dClose = $('d-close'); R.mClose2 = $('mclose');
    try { RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches; FINE = window.matchMedia('(pointer: fine)').matches; } catch (e) { RM = false; }
    if (RM) document.documentElement.classList.add('rm');
    load();
    buildLandscape(); buildCards(); buildFilters(); buildNutri();
    layout(); refresh(); updateLight(); syncLock();
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    R.drawer.addEventListener('change', onDrawerChange);
    R.q.addEventListener('input', function () { S.q = R.q.value; updateCards(); });
    let queued = false;
    window.addEventListener('resize', function () { if (queued) return; queued = true; requestAnimationFrame(function () { queued = false; layout(); }); });
    R.stage.addEventListener('mousemove', function (e) { if (MODE !== 'd' || !FINE) return; MXT = clamp(e.clientX / (window.innerWidth || 1)) * 2 - 1; MYT = clamp(e.clientY / (R.stage.clientHeight || 1)) * 2 - 1; });
    R.stage.addEventListener('mouseleave', function () { MXT = 0; MYT = 0; });
    T0 = performance.now();
    requestAnimationFrame(loop);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
