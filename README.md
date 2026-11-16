# 👁 Marketplace Visto

Extensión para **Brave** y **Chrome** que te deja marcar avisos de Facebook Marketplace como **"visto"**, así al buscar podés atenuarlos u ocultarlos y no revisar los mismos avisos una y otra vez.

---

## 📦 1. Antes de empezar

1. Copiá la carpeta **`fb-marketplace-visto`** a un lugar fijo de tu PC, por ejemplo `Documentos\Extensiones\fb-marketplace-visto`.
2. **No borres ni muevas esa carpeta después de instalar.** El navegador carga la extensión directamente desde ahí; si la borrás o la movés, la extensión deja de funcionar.

> Si te pasaron la extensión en un `.zip`, primero descomprimilo. El navegador necesita la carpeta, no el `.zip`.

La carpeta debe tener estos archivos adentro (no una subcarpeta con ellos):

```
fb-marketplace-visto/
├── manifest.json
├── content.js
├── content.css
├── popup.html
└── popup.js
```

---

## 🦁 2. Instalar en Brave

1. Abrí Brave y escribí en la barra de direcciones:
   ```
   brave://extensions
   ```
2. Arriba a la derecha, activá el interruptor **"Modo de desarrollador"** (en inglés, *Developer mode*).
3. Aparecen tres botones nuevos arriba. Hacé click en **"Cargar descomprimida"** (*Load unpacked*).
4. Elegí la carpeta **`fb-marketplace-visto`** (la que contiene `manifest.json`) y tocá **"Seleccionar carpeta"**.
5. Va a aparecer la tarjeta **"Marketplace Visto"** en la lista. ✅
6. **Recomendado:** fijá la extensión en la barra:
   - Click en el ícono de pieza de rompecabezas 🧩 (arriba a la derecha).
   - Click en el pin 📌 al lado de "Marketplace Visto".

---

## 🌐 3. Instalar en Chrome

1. Abrí Chrome y escribí en la barra de direcciones:
   ```
   chrome://extensions
   ```
2. Arriba a la derecha, activá el interruptor **"Modo de desarrollador"** (*Developer mode*).
3. Hacé click en **"Cargar extensión sin empaquetar"** (*Load unpacked*), arriba a la izquierda.
4. Elegí la carpeta **`fb-marketplace-visto`** y tocá **"Seleccionar carpeta"**.
5. Va a aparecer **"Marketplace Visto"** en la lista. ✅
6. Fijala con el ícono 🧩 → 📌, igual que en Brave.

> ℹ️ Chrome a veces muestra un aviso del tipo *"Inhabilitar extensiones en modo de desarrollador"* al abrir el navegador. Es normal para extensiones instaladas así: cerralo con la ✕ o tocá **"Conservar"**. **No** hagas click en "Inhabilitar".

---

## 🛒 4. Cómo se usa

Entrá a **https://www.facebook.com/marketplace** (si ya lo tenías abierto, recargá con **F5**).

### ✔️ Marcar un aviso como visto
- Cada aviso tiene un **cuadradito ☐ arriba a la derecha** de la foto.
- Click en el cuadradito → se pone verde **✓ Visto**.
- Click de nuevo → se desmarca.
- Hacer click en el cuadradito **no abre** el aviso.

### 🔗 Marcado automático
- Si **entrás a un aviso** (click normal, ctrl+click o click con la ruedita), queda marcado como visto automáticamente.
- Se puede desactivar desde el popup (ver abajo).

### 🎛️ Barra flotante (abajo a la izquierda)
| Elemento | Qué hace |
|---|---|
| `👁 5/36 vistos` | Cuántos de los avisos cargados en la página ya viste. |
| **Vistos: Atenuar / Ocultar / Normal** | Cada click cambia qué pasa con los vistos: **Atenuar** (gris y transparente), **Ocultar** (desaparecen) o **Normal** (se ven igual, sólo con el ✓). |
| **Marcar todos** | Marca como vistos todos los avisos cargados. Útil cuando terminaste de revisar una búsqueda entera. |

> 💡 Consejo: usá **Ocultar** cuando buscás algo nuevo, así sólo ves lo que todavía no revisaste. Si querés volver a ver algo, pasá a **Normal**.

---

## 🧩 5. El popup (ícono de la extensión)

Click en el ícono de **Marketplace Visto** en la barra del navegador:

- **Contador** total de avisos vistos.
- **Lista de vistos** (los más recientes primero), con miniatura, **título con link** al aviso, precio y fecha en que lo marcaste. La **✕** lo quita de vistos.
- **Buscador** para filtrar la lista por título o precio.
- **Modo** de los vistos: Atenuar / Ocultar / Mostrar normal.
- **Opciones:**
  - *Marcar como visto al abrir un aviso*.
  - *Mostrar barra flotante*.
- **Exportar / Importar:** guarda tu lista en un archivo `.json` (backup, o para pasarla a otro navegador o PC). Al importar se **suma** a la lista actual, no la reemplaza.
- **Borrar todos los vistos:** vacía la lista (no se puede deshacer; exportá antes si querés).

> Las miniaturas vienen de Facebook y vencen con el tiempo; si una se ve vacía es normal, el título y el link siguen funcionando.

---

## 🔄 6. Actualizar a una versión nueva

Cuando te pasen archivos nuevos de la extensión:

1. Reemplazá los archivos dentro de la **misma carpeta** `fb-marketplace-visto`.
2. Andá a `brave://extensions` o `chrome://extensions`.
3. En la tarjeta **"Marketplace Visto"**, tocá el botón de recargar **⟳**.
4. Recargá la pestaña de Marketplace con **F5**.

Tu lista de vistos **no se pierde** al actualizar.

> ⚠️ Si **quitás** la extensión (botón "Quitar"), la lista de vistos **sí se borra**. Exportala antes.

---

## 🛠️ 7. Problemas comunes

| Problema | Solución |
|---|---|
| No aparecen los cuadraditos en los avisos | Recargá Marketplace con **F5**. Si sigue igual, en la página de extensiones revisá que esté **activada** y tocá ⟳. |
| Error *"Falta el archivo de manifiesto"* al cargar | Elegiste la carpeta equivocada. Tenés que elegir la carpeta que tiene **`manifest.json` directamente adentro**. |
| La extensión desapareció o dice "no se puede cargar" | Moviste o borraste la carpeta. Volvé a ponerla donde estaba o cargala de nuevo con "Cargar descomprimida". |
| Aparece un botón rojo **"Errores"** en la tarjeta | Tocalo, copiá el mensaje y mandáselo a quien te pasó la extensión. |
| Dejó de funcionar de un día para otro | Facebook cambia su página seguido; puede necesitar una actualización. |
| Quiero usar la misma lista en Brave y Chrome | Exportá desde uno e importá en el otro (cada navegador guarda su propia lista). |

---

## 🔒 Privacidad

Todo se guarda **sólo en tu navegador**. La extensión no envía datos a ningún servidor, y sólo funciona dentro de `facebook.com`.
