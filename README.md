# Recetario Vegano

Recetas veganas con ingredientes que se consiguen en Chile, para desayuno, almuerzo, once y cena.

**Sitio:** https://moises-salgado.github.io/recetario-vegano-2/

## Qué tiene

- Portada animada: con un scroll corto la palta aterriza en el prado y aparecen los cuatro momentos del día. Las nubes, los pájaros y las flores se mueven solos.
- 12 recetas con filtros por momento, rápidas o elaboradas, búsqueda por nombre o ingrediente e íconos de gluten, picante, alta en proteína, alta en azúcar y soya.
- Ficha de cada receta con ingredientes y pasos.
- Favoritas y **Mi semana**: eliges el día de cada receta y se arma la lista de compras. Todo se guarda en el navegador (localStorage).
- Información nutricional básica para veganos: B12, hierro, proteína, calcio, omega-3, vitamina D y yodo.

## Estructura

```
index.html        estructura de la página
css/styles.css    estilos
js/main.js        textos (CONTENT), dibujos SVG del paisaje y los platos, animaciones y lógica
```

No usa librerías ni pasos de compilación: es HTML, CSS y JavaScript puros.

## Editar textos y recetas

Todo el contenido está en el objeto `CONTENT`, al inicio de `js/main.js`: momentos del día, recetas (ingredientes, pasos, etiquetas) y tarjetas de nutrición.

## Probar en tu computador

Abre `index.html` en el navegador, o sirve la carpeta con cualquier servidor estático, por ejemplo:

```
python -m http.server 8000
```

y entra a http://localhost:8000.

## Publicación

GitHub Pages, desde la rama `main` y la carpeta raíz.

> La información nutricional es general y no reemplaza la consulta con un nutricionista o médico.
