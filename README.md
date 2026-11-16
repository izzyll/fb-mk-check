# 👁 Marketplace Visto

Extensión para **Brave** y **Chrome** que te permite marcar avisos de Facebook Marketplace como **"visto"**. Así, al buscar, puedes atenuarlos u ocultarlos y no revisar los mismos avisos una y otra vez.

---

## 📦 1. Antes de empezar

1. Copia la carpeta **`fb-mk-check`** a un lugar fijo de tu PC, por ejemplo `Documentos\Extensiones\fb-mk-check`.
2. **No borres ni muevas esa carpeta después de instalar.** El navegador carga la extensión directamente desde ahí; si la borras o la mueves, la extensión deja de funcionar.

> Si recibiste la extensión en un `.zip`, primero descomprímelo. El navegador necesita la carpeta, no el `.zip`.

La carpeta debe tener estos archivos adentro (no una subcarpeta con ellos):

```
fb-mk-check/
├── manifest.json
├── content.js
├── content.css
├── popup.html
└── popup.js
```

---

## 🦁 2. Instalar en Brave

1. Abre Brave y escribe en la barra de direcciones:
   ```
   brave://extensions
   ```
2. Arriba a la derecha, activa el interruptor **"Modo de desarrollador"** (en inglés, *Developer mode*).
3. Aparecen tres botones nuevos arriba. Haz clic en **"Cargar descomprimida"** (*Load unpacked*).
4. Elige la carpeta **`fb-mk-check`** (la que contiene `manifest.json`) y presiona **"Seleccionar carpeta"**.
5. Aparecerá la tarjeta **"Marketplace Visto"** en la lista. ✅
6. **Recomendado:** fija la extensión en la barra:
   - Clic en el ícono de pieza de rompecabezas 🧩 (arriba a la derecha).
   - Clic en el pin 📌 junto a "Marketplace Visto".

---

## 🌐 3. Instalar en Chrome

1. Abre Chrome y escribe en la barra de direcciones:
   ```
   chrome://extensions
   ```
2. Arriba a la derecha, activa el interruptor **"Modo de desarrollador"** (*Developer mode*).
3. Haz clic en **"Cargar extensión sin empaquetar"** (*Load unpacked*), arriba a la izquierda.
4. Elige la carpeta **`fb-mk-check`** y presiona **"Seleccionar carpeta"**.
5. Aparecerá **"Marketplace Visto"** en la lista. ✅
6. Fíjala con el ícono 🧩 → 📌, igual que en Brave.

> ℹ️ Chrome a veces muestra un aviso como *"Inhabilitar extensiones en modo de desarrollador"* al abrir el navegador. Es normal para extensiones instaladas de esta forma: ciérralo con la ✕ o presiona **"Conservar"**. **No** hagas clic en "Inhabilitar".

---

## 🛒 4. Cómo se usa

Entra a **https://www.facebook.com/marketplace** (si ya lo tenías abierto, recarga con **F5**).

### ✔️ Marcar un aviso como visto
- Cada aviso tiene un **cuadrado ☐ arriba a la derecha** de la foto.
- Clic en el cuadrado → se pone verde **✓ Visto**.
- Clic de nuevo → se desmarca.
- Hacer clic en el cuadrado **no abre** el aviso.

### 🔗 Marcado automático
- Si **entras a un aviso** (clic normal, Ctrl+clic o clic con la rueda del mouse), queda marcado como visto automáticamente.
- Se puede desactivar desde el popup (ver más abajo).

### 🎛️ Barra flotante (abajo a la izquierda)
| Elemento | Qué hace |
|---|---|
| `👁 5/36 vistos` | Cuántos de los avisos cargados en la página ya has visto. |
| **Vistos: Atenuar / Ocultar / Normal** | Cada clic cambia qué pasa con los vistos: **Atenuar** (gris y transparente), **Ocultar** (desaparecen) o **Normal** (se ven igual, solo con el ✓). |
| **Marcar todos** | Marca como vistos todos los avisos cargados. Útil cuando terminas de revisar una búsqueda completa. |

> 💡 Consejo: usa **Ocultar** cuando busques algo nuevo, así solo ves lo que todavía no has revisado. Si quieres volver a ver algo, cambia a **Normal**.

---

## 🧩 5. El popup (ícono de la extensión)

Haz clic en el ícono de **Marketplace Visto** en la barra del navegador:

- **Contador** total de avisos vistos.
- **Lista de vistos** (los más recientes primero), con miniatura, **título con enlace** al aviso, precio y fecha en que lo marcaste. La **✕** lo quita de vistos.
- **Buscador** para filtrar la lista por título o precio.
- **Modo** de los vistos: Atenuar / Ocultar / Mostrar normal.
- **Opciones:**
  - *Marcar como visto al abrir un aviso*.
  - *Mostrar barra flotante*.
- **Exportar / Importar:** guarda tu lista en un archivo `.json` (como respaldo, o para pasarla a otro navegador o PC). Al importar, se **suma** a la lista actual; no la reemplaza.
- **Borrar todos los vistos:** vacía la lista (no se puede deshacer; exporta antes si quieres conservarla).

> Las miniaturas vienen de Facebook y caducan con el tiempo. Si una aparece vacía es normal; el título y el enlace siguen funcionando.

---

## 🔄 6. Actualizar a una versión nueva

Cuando recibas archivos nuevos de la extensión:

1. Reemplaza los archivos dentro de la **misma carpeta** `fb-mk-check`.
2. Ve a `brave://extensions` o `chrome://extensions`.
3. En la tarjeta **"Marketplace Visto"**, presiona el botón de recargar **⟳**.
4. Recarga la pestaña de Marketplace con **F5**.

Tu lista de vistos **no se pierde** al actualizar.

> ⚠️ Si **quitas** la extensión (botón "Quitar"), la lista de vistos **sí se borra**. Expórtala antes.

---

## 🛠️ 7. Problemas comunes

| Problema | Solución |
|---|---|
| No aparecen los cuadrados en los avisos | Recarga Marketplace con **F5**. Si sigue igual, en la página de extensiones revisa que esté **activada** y presiona ⟳. |
| Error *"Falta el archivo de manifiesto"* al cargar | Elegiste la carpeta equivocada. Debes elegir la carpeta que tiene **`manifest.json` directamente adentro**. |
| La extensión desapareció o dice "no se puede cargar" | Moviste o borraste la carpeta. Devuélvela a donde estaba o cárgala de nuevo con "Cargar descomprimida". |
| Aparece un botón rojo **"Errores"** en la tarjeta | Haz clic en él, copia el mensaje y envíaselo a quien te pasó la extensión. |
| Dejó de funcionar de un día para otro | Facebook cambia su página con frecuencia; puede necesitar una actualización. |
| Quiero usar la misma lista en Brave y Chrome | Exporta desde uno e importa en el otro (cada navegador guarda su propia lista). |

---

## 🔒 Privacidad

Todo se guarda **solo en tu navegador**. La extensión no envía datos a ningún servidor y solo funciona dentro de `facebook.com`.
