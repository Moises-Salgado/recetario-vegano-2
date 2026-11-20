# Recetario Vegano

Recetas veganas con ingredientes que se consiguen en Chile, para desayuno, almuerzo, once y cena.

**Sitio:** https://moises-salgado.github.io/recetario-vegano-2/

## Qué tiene

- Portada en 3D hecha con Three.js: la palta flota entre nubes con frutas y verduras girando a su alrededor, y con un scroll corto aterriza en la pradera y aparecen los cuatro momentos del día. La cámara sigue el mouse y el cielo cambia según el momento (de noche aparecen la luna y las estrellas). Si el navegador no tiene WebGL 2, se muestra la portada plana.
- 12 recetas con filtros por momento, rápidas o elaboradas, búsqueda por nombre o ingrediente e íconos de gluten, picante, alta en proteína, alta en azúcar y soya.
- Ficha de cada receta con ingredientes y pasos.
- Favoritas y **Mi semana**: eliges el día de cada receta y se arma la lista de compras. Todo se guarda en el navegador (localStorage).
- Información nutricional básica para veganos: B12, hierro, proteína, calcio, omega-3, vitamina D y yodo.

## Estructura

```
index.html        estructura de la página
css/styles.css    estilos
js/main.js        textos (CONTENT), dibujos SVG del paisaje y los platos, animaciones y lógica
js/hero3d.js      portada 3D: cielo, nubes, montañas, pradera, rocas, palta, frutas y verduras
```

No hay pasos de compilación: es HTML, CSS y JavaScript. Solo la portada 3D usa una librería, Three.js, que se carga desde jsDelivr.

## Editar textos y recetas

Todo el contenido está en el objeto `CONTENT`, al inicio de `js/main.js`: momentos del día, recetas (ingredientes, pasos, etiquetas) y tarjetas de nutrición.

## Probar en tu computador

Sirve la carpeta con cualquier servidor estático (abriendo `index.html` directamente se ve la portada plana, porque el navegador no carga módulos de JavaScript desde archivos locales), por ejemplo:

```
python -m http.server 8000
```

y entra a http://localhost:8000.

## Publicación

GitHub Pages, desde la rama `main` y la carpeta raíz.

> La información nutricional es general y no reemplaza la consulta con un nutricionista o médico.
