# Headless React Library Bundle-Size Comparison

A per-component bundle-size comparison across four headless React UI
libraries, generated from real webpack bundles measured with
[monosize](https://github.com/microsoft/monosize).

| Library                                       | Version | Resolution style                                           |
| --------------------------------------------- | ------- | ---------------------------------------------------------- |
| `radix-ui`                                    | 1.4.3   | Named imports from a single barrel module                  |
| `@base-ui/react`                              | 1.4.1   | Per-component subpath exports (`./dialog`, `./popover`, …) |
| `react-aria-components`                       | 1.17.0  | Per-component subpath exports (`./Dialog`, `./Popover`, …) |
| `@fluentui/react-headless-components-preview` | 0.0.3   | Per-component subpath exports                              |

> **This is not a final or definitive comparison.** It measures one thing —
> the cost in bytes of importing each library's component entrypoints. It
> does **not** measure functional parity. Two components with the same name
> across libraries (e.g. `Dialog`, `Slider`, `Select`) often differ in
> meaningful ways: accessibility depth, focus management, RTL/i18n support,
> controlled-vs-uncontrolled patterns, sub-component composition, animation
> primitives, virtualization, asChild/Slot patterns, and how much state
> machinery ships in the box. Wherever possible we mapped primitives that
> play the same _role_ (see [Caveats](#caveats) for the full list), but a
> 4 kB `Select` and a 50 kB `Select` are rarely doing the same work. Use
> these numbers as one input to a sizing decision, not as a ranking.

## The libraries

**Radix UI** — Low-level, unstyled, accessibility-first primitives originally
shipped as individual `@radix-ui/react-*` packages. The 1.x `radix-ui`
meta-package consolidates them and exposes a `Component.Subcomponent` API via
named imports from a single barrel. Common patterns: `asChild`/`Slot`,
controlled + uncontrolled state, focus management baked in.

**Base UI** — Headless component library from the MUI team, positioned as the
successor to MUI Base. Unstyled, framework-agnostic primitives with a
render-prop / data-attribute styling model. Ships per-component subpath
exports so each import is naturally scoped.

**React Aria Components** — Adobe's component layer on top of the React Aria
hooks (from the [react-spectrum](https://github.com/adobe/react-spectrum)
monorepo). Strong opinions on accessibility (WAI-ARIA APG conformance,
keyboard interactions, RTL/i18n) and the most comprehensive built-in
collection/selection machinery of the four. Subpath exports.

**FluentUI Headless (preview)** — Microsoft's headless slice of FluentUI v9,
exposing the v9 component contracts (state hooks + render slots) without the
default Fluent styling. Currently a `0.0.x` preview. Per-component subpath
exports; depends on the existing `@fluentui/react-*` package surface
underneath.

## Headline: all components combined

Each library's "All" number comes from a single fixture that imports every
component covered for that library — so shared internals are counted once
(not once per component). **The four numbers are not directly comparable**
because each library covers a different subset of the matrix; see the
caveats below.

|                            | Radix     | Base UI   | React Aria | FluentUI Headless |
| -------------------------- | --------- | --------- | ---------- | ----------------- |
| Components covered (of 24) | 15        | 20        | 20         | 24                |
| Minified                   | 130.41 kB | 309.49 kB | 251.13 kB  | **84.45 kB**      |
| Gzipped                    | 40.78 kB  | 99.64 kB  | 77.42 kB   | **25.60 kB**      |

## Per-component bundle size (gzipped)

**Bold** = smallest in the row. `—` = the library has no equivalent
primitive.

| Component          | Radix       | Base UI  | React Aria | FluentUI Headless |
| ------------------ | ----------- | -------- | ---------- | ----------------- |
| Accordion          | 5.20 kB     | 8.87 kB  | —          | **4.74 kB**       |
| Avatar             | 2.59 kB     | 4.16 kB  | —          | **2.30 kB**       |
| Breadcrumb         | —           | —        | 16.98 kB   | **3.81 kB**       |
| Button             | —           | 3.22 kB  | 11.32 kB   | **1.99 kB**       |
| Checkbox           | **4.33 kB** | 7.11 kB  | 12.28 kB   | 5.09 kB           |
| Dialog             | 11.89 kB    | 20.77 kB | 22.38 kB   | **7.52 kB**       |
| Divider            | **1.44 kB** | 1.99 kB  | 3.71 kB    | 1.53 kB           |
| Drawer             | —           | 31.69 kB | —          | **9.74 kB**       |
| Field              | —           | 8.13 kB  | —          | **3.53 kB**       |
| Input              | —           | 4.17 kB  | 5.44 kB    | **3.11 kB**       |
| Link               | —           | —        | 10.12 kB   | **2.98 kB**       |
| Popover            | 20.26 kB    | 37.12 kB | 23.50 kB   | **6.87 kB**       |
| ProgressBar        | **2.25 kB** | 3.53 kB  | 4.72 kB    | 2.88 kB           |
| RadioGroup         | 5.91 kB     | 8.29 kB  | 16.45 kB   | **5.73 kB**       |
| SearchBox          | —           | —        | 16.74 kB   | **4.10 kB**       |
| Select             | 24.42 kB    | 42.07 kB | 50.23 kB   | **2.96 kB**       |
| Slider             | **5.62 kB** | 12.99 kB | 12.94 kB   | 5.71 kB           |
| SpinButton         | —           | 12.46 kB | 23.79 kB   | **4.47 kB**       |
| Switch             | **3.27 kB** | 5.72 kB  | 10.56 kB   | 5.27 kB           |
| Tabs               | 5.34 kB     | 12.51 kB | 27.72 kB   | **4.21 kB**       |
| Textarea           | —           | —        | 5.28 kB    | **3.39 kB**       |
| ToggleButton       | **2.16 kB** | 4.49 kB  | 10.43 kB   | 2.33 kB           |
| Toolbar            | **5.31 kB** | 8.46 kB  | 7.50 kB    | 6.52 kB           |
| Tooltip            | 16.03 kB    | 29.87 kB | 11.97 kB   | **5.86 kB**       |
| **All (combined)** | 40.78 kB    | 99.64 kB | 77.42 kB   | **25.60 kB**      |

## Per-component bundle size (minified)

| Component          | Radix        | Base UI   | React Aria | FluentUI Headless |
| ------------------ | ------------ | --------- | ---------- | ----------------- |
| Accordion          | 14.58 kB     | 24.79 kB  | —          | **12.98 kB**      |
| Avatar             | 6.32 kB      | 10.55 kB  | —          | **5.24 kB**       |
| Breadcrumb         | —            | —         | 52.97 kB   | **9.91 kB**       |
| Button             | —            | 7.81 kB   | 33.82 kB   | **4.87 kB**       |
| Checkbox           | **11.36 kB** | 18.03 kB  | 37.29 kB   | 13.07 kB          |
| Dialog             | 36.06 kB     | 63.86 kB  | 70.63 kB   | **20.59 kB**      |
| Divider            | **3.21 kB**  | 4.64 kB   | 9.70 kB    | 3.60 kB           |
| Drawer             | —            | 98.74 kB  | —          | **27.29 kB**      |
| Field              | —            | 22.16 kB  | —          | **8.92 kB**       |
| Input              | —            | 10.06 kB  | 15.59 kB   | **7.71 kB**       |
| Link               | —            | —         | 30.21 kB   | **7.28 kB**       |
| Popover            | 58.30 kB     | 110.73 kB | 72.50 kB   | **18.83 kB**      |
| ProgressBar        | **5.30 kB**  | 8.63 kB   | 12.42 kB   | 6.97 kB           |
| RadioGroup         | 16.14 kB     | 21.78 kB  | 51.47 kB   | **14.75 kB**      |
| SearchBox          | —            | —         | 49.90 kB   | **10.43 kB**      |
| Select             | 71.47 kB     | 121.92 kB | 159.19 kB  | **7.18 kB**       |
| Slider             | 14.80 kB     | 35.47 kB  | 38.58 kB   | **14.46 kB**      |
| SpinButton         | —            | 33.42 kB  | 73.51 kB   | **11.96 kB**      |
| Switch             | **7.74 kB**  | 14.29 kB  | 31.48 kB   | 13.46 kB          |
| Tabs               | 14.49 kB     | 35.03 kB  | 92.86 kB   | **10.91 kB**      |
| Textarea           | —            | —         | 14.80 kB   | **8.26 kB**       |
| ToggleButton       | **4.85 kB**  | 10.95 kB  | 31.15 kB   | 5.85 kB           |
| Toolbar            | **14.81 kB** | 23.44 kB  | 21.76 kB   | 18.29 kB          |
| Tooltip            | 45.53 kB     | 88.97 kB  | 33.93 kB   | **16.15 kB**      |
| **All (combined)** | 130.41 kB    | 309.49 kB | 251.13 kB  | **84.45 kB**      |

## How to read these numbers

- Each cell is the size of bundling a `import * as M from '<subpath>'` (or
  named-import equivalent for Radix) of that component's entrypoint with
  webpack, externalizing `react` and `react-dom`. So the numbers reflect
  "what comes along when you import this component" — including each
  library's required runtime and helpers.
- **"All combined"** is a single fixture that imports every component for
  that library at once. The per-component column sums are always larger
  than the `All` row because shared internals (state machines, focus utils,
  context providers) get counted multiple times in the per-component view.

## Caveats

1. **Coverage is asymmetric.** Each library exposes a different set of
   primitives, so the "All (combined)" totals are not apples-to-apples — a
   library that ships fewer components will appear lighter regardless of
   per-component efficiency. For example, Radix has no `Button` or `Drawer`,
   and React Aria has no `Avatar` or `Accordion`.
2. **Components with the same name are not the same component.** Even
   where every library ships a `Dialog` / `Slider` / `Select` / `Tabs`, the
   feature surface underneath varies a lot — keyboard handling depth,
   built-in collection management, animation hooks, focus scopes, RTL/i18n
   wiring, controlled-vs-uncontrolled defaults, sub-component composition,
   and whether things like type-ahead, virtualization, or async loading are
   included. A library that ships a smaller `Select` may simply be doing
   less. Treat the per-component numbers as a starting point for
   investigation, not as a verdict.
3. **Some equivalences are conceptual, not literal.** The matrix maps
   primitives by role, not by name. Same caveat as above applies — these
   are even more loosely equivalent than the same-named ones:
   - `Divider` ↔ `Separator` (Radix, Base UI, React Aria)
   - `ProgressBar` ↔ `Progress` (Radix, Base UI)
   - `ToggleButton` ↔ `Toggle` (Radix, Base UI)
   - `SpinButton` ↔ `NumberField` (React Aria) / `number-field` (Base UI)
   - `Breadcrumb` ↔ `Breadcrumbs` (React Aria)
   - `SearchBox` ↔ `SearchField` (React Aria)
   - `Textarea` ↔ `TextArea` (React Aria)
4. **`Dialog` includes the alert-dialog variant.** For Radix and Base UI
   the fixture imports both `Dialog` and `AlertDialog`. For React Aria it
   imports both `Modal` and `Dialog`, since RAC splits the overlay surface
   from the dialog role.
5. **Radix uses a barrel module, not subpath exports.** `radix-ui@1.4.x`
   exposes a single entrypoint, so per-component sizes for Radix reflect
   tree-shaking effectiveness rather than isolated entrypoint cost.
6. **Numbers are measurement artifacts, not absolutes.** They are
   webpack-bundled in production mode with `react` / `react-dom`
   externalized. A different bundler (Vite/Rollup, esbuild, Rspack) or
   different tree-shaking config can shift numbers in either direction.

## Reproducing the measurements

```sh
yarn install
yarn measure
```

`yarn measure` runs three steps: (1) generates one webpack fixture per
`(library, component)` cell from
[`bundle-size/manifest.js`](./bundle-size/manifest.js), plus an `All`
aggregate fixture per library, (2) runs `monosize measure`, which builds
each fixture and records minified + gzipped sizes into
`dist/bundle-size/monosize.json`, and (3) copies that JSON into
`public/monosize.json` so the React report at `yarn dev` can render it.

To extend the comparison: edit `bundle-size/manifest.js` (add a component
entry, with per-library overrides only where the default subpath doesn't
fit), then re-run `yarn measure`.
