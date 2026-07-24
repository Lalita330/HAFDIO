# Nocthryn Studio — catálogo web

Sitio estático independiente para Nocthryn Studio. No necesita Codex, servidor, base de datos ni claves de API.

## Datos editables

Abre `site-config.js` para cambiar en un solo lugar:

- nombre del negocio;
- ciudad;
- número y mensaje de WhatsApp;
- correo;
- disponibilidad.

El título y la descripción SEO están también documentados al inicio de `index.html` para que los buscadores puedan leerlos sin ejecutar JavaScript.

## Vista local

Puedes abrir `index.html` directamente o iniciar cualquier servidor estático. Todos los enlaces y recursos son relativos, por lo que funciona tanto en un dominio propio como en una URL de proyecto de GitHub Pages.

## Publicar en GitHub Pages

1. Crea en GitHub un repositorio vacío llamado `nocthryn-studio`.
2. Desde PowerShell, dentro de esta carpeta, agrega el repositorio remoto y sube la rama `main`.
3. En GitHub abre **Settings → Pages** y elige **GitHub Actions** como fuente.
4. El flujo **Publicar en GitHub Pages** desplegará automáticamente el sitio. También puedes ejecutarlo manualmente desde la pestaña **Actions**.

La URL final tendrá el formato `https://TU_USUARIO.github.io/nocthryn-studio/`.

## Seguridad

El sitio no contiene credenciales ni formularios. El contacto se realiza mediante enlaces directos a WhatsApp y correo. GitHub Pages proporciona HTTPS. La política CSP básica está declarada en `index.html`; las cabeceras HTTP adicionales dependerán del hosting elegido.
