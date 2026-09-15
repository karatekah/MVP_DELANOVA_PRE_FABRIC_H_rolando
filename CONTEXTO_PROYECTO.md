# Contexto de continuidad — MVP Venta Directa de Casas Prefabricadas

## Objetivo

Crear una página de venta directa, rápida y enfocada primero en móvil. La referencia funcional es un catálogo tipo retail: los productos deben aparecer de inmediato, con precio, descuento, fotografías, selección simple y llamada fuerte a WhatsApp.

Este MVP es independiente de la web corporativa DELANOVA / Portal del Valle, que permanece en pausa.

## Alcance implementado

- Catálogo de tres modelos: Esencial 36, Confort 54 y Premium 72.
- Dos imágenes conceptuales por modelo: exterior e interior.
- Precios de compra y alquiler referenciales.
- Oferta de 10 horas persistente por navegador.
- Popup inicial cerrable con llamada a la acción.
- Carrusel con controles, indicadores y gesto de deslizamiento.
- Especificaciones desplegables.
- WhatsApp con mensaje personalizado.
- Mobile-first y adaptación a escritorio.

## Datos que deben validarse con el cliente

- Número oficial del asesor.
- Nombre comercial final de cada casa.
- Precio regular, precio promocional y alquiler mensual.
- Metraje, ambientes, acabados, instalaciones y garantía.
- Costos y cobertura de transporte, instalación y cimentación.
- Vigencia y términos legales del descuento.
- Fotografías finales o aprobación expresa de las imágenes conceptuales.

## Precios provisionales

| Modelo | Regular | Promocional | Alquiler mensual |
| --- | ---: | ---: | ---: |
| Esencial 36 | S/ 27,900 | S/ 24,900 | S/ 1,190 |
| Confort 54 | S/ 39,900 | S/ 34,900 | S/ 1,690 |
| Premium 72 | S/ 51,900 | S/ 44,900 | S/ 2,290 |

Todos los valores son referenciales y están centralizados en `app.js`.

## Integración de WhatsApp

Configurar en `app.js`:

```js
const ADVISOR_WHATSAPP = "51987654321";
```

Mientras esté vacío, el sitio abre WhatsApp con el mensaje preparado, pero sin fijar un destinatario para evitar dirigir clientes a un número incorrecto.

## Imágenes

Las imágenes fueron creadas como visuales conceptuales para el prototipo mediante la herramienta integrada de generación de imágenes. No representan especificaciones contractuales. Los archivos finales se encuentran en `assets/images/`.
