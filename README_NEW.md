# TUT-RE — Aplicación de Formularios para Reaseguro

Este repositorio contiene la interfaz web para crear y gestionar formularios relacionados con procesos de reaseguro en TUT-RE. Está diseñada con foco en facilidad de uso, consistencia visual y componentes reutilizables.

## Tecnologías principales

- **Next.js** (App Router) — React + SSR/SSG
- **React 19** + **TypeScript**
- **Tailwind CSS** para utilidades de diseño
- **react-datepicker** para selección de fecha/hora
- **pnpm** como gestor de paquetes

## Estructura del repositorio

```
tut-ret/
├── app/
│   ├── components/
│   │   └── forms/          # Formularios de reaseguro
│   ├── globals.css         # Estilos globales y animaciones
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Página de inicio
├── public/                 # Assets estáticos
├── next.config.ts          # Configuración de Next.js
├── tsconfig.json           # Configuración de TypeScript
├── tailwind.config.js      # Configuración de Tailwind
└── package.json            # Dependencias y scripts
```

## Arquitectura de los formularios

Cada formulario es un componente React funcional (TypeScript) ubicado en `app/components/forms/`.

### Patrón común de implementación

- **Estado local** con `useState` para inputs y colecciones (filas repetibles)
- **Funciones de manipulación**: `addX`, `removeX`, `updateX` para gestionar arrays
- **Eliminación con animación**: 
  - Se marca el `id` del item en un array `removingIds`
  - Se aplica la clase CSS `animate-pop-out`
  - Tras ~200ms se elimina del array para completar la animación
- **Layout responsive**: grids de Tailwind con clases utilitarias para accesibilidad

### Ejemplos de formularios

- `CotizacionForm.tsx` — Información general de cotización
- `VigenciaForm.tsx` — Fechas y vigencias con DatePicker
- `CoberturasAdicionalesForm.tsx` — Coberturas adicionales dinámicas
- `ClausulasForm.tsx` — Cláusulas con items repetibles
- `DeduciblesForm.tsx`, `LimitesForm.tsx`, `ImpuestosForm.tsx` — Formularios especializados

## Estilos y tema

### Tailwind CSS
- Base del sistema de diseño con clases utilitarias
- Paleta de colores: zinc/blue/violet
- Tema único claro (se eliminaron variantes `dark:` para consistencia)

### CSS personalizado (`app/globals.css`)
- Variables globales CSS
- Animaciones reutilizables:
  - `.animate-fade-up` — entrada de secciones
  - `.animate-pop` — entrada de items
  - `.animate-pop-out` — salida de items
  - `.will-change-transform` — optimización de rendimiento

## DatePicker — Personalizaciones

Se usa `react-datepicker` con estilos personalizados en `app/components/forms/datepicker-custom.css`:

### Características implementadas

- **Tema claro forzado**: eliminadas reglas `@media (prefers-color-scheme: dark)`
- **Contraste mejorado**: 
  - Día seleccionado con gradiente oscuro (#1e40af → #5b21b6)
  - Día actual con borde azul visible
- **Selectores mes/año**: fondo blanco y texto oscuro para legibilidad
- **Portal rendering**: 
  - `popperContainer` renderiza el calendario en `document.body`
  - `popperPlacement="top-start"` para evitar clipping
- **z-index elevado** (9999) para overlay correcto

### Implementación típica

```typescript
<DatePicker
  selected={fecha}
  onChange={handleChange}
  dateFormat="dd/MM/yyyy"
  popperPlacement="top-start"
  popperContainer={popperContainer}
  showMonthDropdown
  showYearDropdown
/>
```

## Animaciones

Animaciones CSS ligeras (~180-200ms) para mejorar la experiencia:

| Clase | Uso | Duración |
|-------|-----|----------|
| `animate-fade-up` | Aparición de secciones | 300ms |
| `animate-pop` | Items añadidos | 200ms |
| `animate-pop-out` | Items eliminados | 180ms |

Las animaciones usan `transform` y `opacity` para rendimiento óptimo.

## Comandos de desarrollo

### Instalación

```powershell
pnpm install
```

### Desarrollo

```powershell
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

### Producción

```powershell
# Build
pnpm build

# Ejecutar build
pnpm start
```

### Linting

```powershell
pnpm lint
```

## Mejores prácticas

### Al trabajar con formularios

✅ **Hacer**
- Usar `map`, `filter` y spread operator para actualizaciones inmutables
- Mantener consistencia en clases de Tailwind
- Revisar si DatePicker necesita `popperContainer` para evitar clipping
- Probar animaciones en dev server tras cambios de CSS

❌ **Evitar**
- Mutaciones directas de arrays/objetos en estado
- Mezclar estilos inline con Tailwind sin necesidad
- Cambios globales de layout sin coordinación

### Patrones de código

```typescript
// ✅ Correcto: actualización inmutable
setItems(items.map(item => 
  item.id === id ? { ...item, field: value } : item
))

// ❌ Incorrecto: mutación directa
items[index].field = value
setItems(items)
```

## Checklist de QA

Antes de crear un PR, verificar:

- [ ] Inputs dinámicos (añadir/eliminar) funcionan correctamente
- [ ] Animaciones de entrada/salida se reproducen sin cortes
- [ ] DatePickers no quedan recortados (probar meses con 5-6 filas)
- [ ] Navegación por teclado (Tab, Shift+Tab) funcional
- [ ] Contraste de colores adecuado (WCAG AA mínimo)
- [ ] Sin errores de TypeScript/ESLint
- [ ] Build de producción exitoso (`pnpm build`)

## Troubleshooting

### Calendario/hora recortado

**Problema**: El popper del DatePicker queda cortado por contenedores padre.

**Soluciones aplicadas**:
1. Renderizado en portal: `popperContainer={(props) => ReactDOM.createPortal(props.children, document.body)}`
2. Posicionamiento: `popperPlacement="top-start"`
3. z-index elevado en CSS

**Causa común**: Ancestros con `overflow: hidden` o `transform` crean stacking contexts.

### Errores de TypeScript con Popper

**Problema**: Props de `popperModifiers` causan errores de tipo.

**Solución**: Crear wrapper tipado o casting temporal:
```typescript
popperModifiers={modifiers as any}
```

### Animaciones no funcionan

**Problema**: Clases de animación no se aplican.

**Verificar**:
1. `will-change-transform` en elemento padre
2. Importación de `globals.css` en layout
3. Purge/caché de Tailwind (`rm -rf .next`)

## Contribuciones

### Flujo de trabajo

1. Crear feature branch desde `main`
2. Implementar cambios siguiendo guía de estilo
3. Probar localmente (checklist QA)
4. Abrir PR con descripción clara
5. Esperar review y merge

### Commits

Usar mensajes descriptivos:
- `feat: añadir formulario de exclusiones`
- `fix: corregir animación de eliminación en ClausulasForm`
- `style: mejorar contraste en DatePicker`
- `docs: actualizar README con ejemplos`

## Licencia

Privado — TUT-RE Reaseguradora

---

**Contacto**: Equipo de desarrollo TUT-RE para consultas técnicas o de negocio.
