# Loldle Quiz PWA

Una aplicación web estilo "Loldle" para adivinar campeones de League of Legends, optimizada para móviles e instalable (PWA).

## ¿Cómo jugar en el móvil?

Tienes dos opciones principales para usar esta aplicación en tu teléfono:

### Opción 1: A través de tu red WiFi (Local)

Si tienes un ordenador con Python instalado (o cualquier servidor web):

1. **Abre una terminal** en la carpeta donde están estos archivos.
2. **Inicia el servidor**:
   ```bash
   python3 -m http.server 8000
   ```
3. **Averigua la IP de tu ordenador**:
   - En Windows: Abre terminal y escribe `ipconfig` (busca IPv4 Address).
   - En Mac/Linux: Escribe `ifconfig` o `ip a` (busca algo como `192.168.x.x`).
4. **En tu móvil**:
   - Asegúrate de estar conectado a la **misma red WiFi** que el ordenador.
   - Abre el navegador (Chrome en Android, Safari en iOS).
   - Escribe la dirección: `http://TU_IP:8000` (ejemplo: `http://192.168.1.35:8000`).

### Opción 2: Publicar en Internet (Recomendado)

Para usarla en cualquier lugar sin depender de tu ordenador:

1. **GitHub Pages**: Sube estos archivos a un repositorio de GitHub y activa GitHub Pages en la configuración.
2. **Netlify Drop**: Arrastra la carpeta con estos archivos a [Netlify Drop](https://app.netlify.com/drop). Te dará un enlace inmediato.
3. **Vercel**: Similar a Netlify.

### Cómo Instalar (PWA)

Una vez abierta la web en tu móvil:

- **Android (Chrome):** Toca los tres puntos (menú) -> "Instalar aplicación" o "Añadir a pantalla de inicio".
- **iOS (Safari):** Toca el botón "Compartir" (cuadrado con flecha) -> "Añadir a la pantalla de inicio".

¡Ahora tendrás un icono en tu menú y la app funcionará como una nativa!
