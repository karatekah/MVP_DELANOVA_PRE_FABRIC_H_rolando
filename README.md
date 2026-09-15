# MVP Venta Directa de Casas Prefabricadas

Landing mobile-first de venta directa para las casas prefabricadas de DELANOVA. Presenta el catálogo desde el primer desplazamiento y convierte la selección del visitante en un mensaje personalizado para WhatsApp.

## Funcionalidades

- Selector de tres modelos: Esencial, Confort y Premium.
- Carrusel táctil con vista exterior e interior de cada modelo.
- Modalidades de compra y alquiler con precios referenciales.
- Descuento visible y contador de 10 horas persistente por navegador mediante `localStorage`.
- Detalles técnicos desplegables.
- Ventana promocional al iniciar, cerrable por el usuario.
- CTA fijo en móvil y acceso flotante a WhatsApp en escritorio.
- Mensaje de WhatsApp personalizado con modelo, modalidad, precio y estado de la promoción.
- Diseño responsive priorizado para celulares.

## Ejecutar localmente

No requiere instalar dependencias. Desde esta carpeta ejecute:

```powershell
python -m http.server 4180
```

Después abra `http://localhost:4180`.

## Configuración comercial pendiente

1. En `app.js`, configure `ADVISOR_WHATSAPP` con el número real en formato internacional, sin `+`, espacios ni guiones.
2. Valide precios de compra, alquiler, descuentos, metrajes, distribuciones y especificaciones.
3. Confirme qué incluyen transporte, instalación, cimentación, conexiones y garantía.
4. Reemplace o apruebe las imágenes conceptuales antes de la publicación comercial.
5. Añada términos de la promoción, política de privacidad y condiciones de alquiler.

## Control de versiones

El proyecto utiliza un repositorio Git independiente. Flujo sugerido:

```powershell
git add .
git commit -m "feat: descripción del cambio"
git push
```

Al conectar el repositorio con GitHub puede importarse en Vercel como sitio estático, sin comando de compilación.

## Nota sobre el contador

El vencimiento se crea una sola vez por navegador y se conserva aunque la página se recargue. Al llegar a cero no se reinicia automáticamente. Borrar los datos del navegador crea una sesión nueva, ya que este MVP todavía no usa autenticación ni backend.
