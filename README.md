# EuroTermo · Landing de ventanas

Landing page en Astro, Tailwind CSS 4 y TypeScript para EuroTermo. Incluye configurador visual, productos, servicios, galería de referencia y preguntas frecuentes.

## Desarrollo

```sh
npm.cmd install
npm.cmd run dev
```

## Antes de publicar

El logotipo está en `public/logo-eurotermo-color.png`. Edita `src/config.ts` con la zona de servicio y el número de WhatsApp real. El número debe incluir código de país y estar escrito solo con dígitos (por ejemplo, `56912345678`). Mientras esté vacío, el formulario explica qué dato falta y no intenta enviar la solicitud.

El cotizador usa rangos de 60–300 cm para el ancho y 60–240 cm para el alto. La solicitud abre WhatsApp con medidas, tipo, terminación, vidrio, datos de contacto y comuna. El precio se confirma después de revisar medidas y alcance.

Las imágenes de productos y la galería son referencias visuales de Pexels, no muestran obras de EuroTermo. Sustitúyelas por fotos propias antes de presentar la sección como portafolio de proyectos realizados. Si se necesita una galería sin dependencia externa, agrega esas fotos a `public/` y actualiza las rutas en `src/pages/index.astro`.

