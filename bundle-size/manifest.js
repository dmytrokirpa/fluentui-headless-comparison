/**
 * Source of truth for the bundle-size comparison.
 *
 * `libraries` lists what we're comparing. `components` lists the components
 * to measure across them. The generator (`generate.mjs`) reads this file and
 * emits one `*.fixture.js` per (library, component), plus an `All` fixture
 * per library that aggregates every import — the per-component numbers add
 * up to more than the "All" total because of shared internals, and that
 * gap is part of what we want to see.
 *
 * Per-component / per-library cell:
 *   undefined           → use the library's default subpath
 *   null                → skip this library for this component
 *   ImportDescriptor[]  → explicit imports (one or more) for this cell
 *
 * ImportDescriptor:
 *   { from: '<subpath>' }                → `import * as Ref from '<subpath>'`
 *   { from: '<subpath>', named: 'Sym' }  → `import { Sym as Ref } from '<subpath>'`
 */

/** @typedef {{ from: string, named?: string }} ImportDescriptor */

/** @type {Record<string, { label: string, packageName: string }>} */
export const libraries = {
  radix: {
    label: "Radix",
    packageName: "radix-ui",
  },
  baseui: {
    label: "Base UI",
    packageName: "@base-ui/react",
  },
  aria: {
    label: "React Aria",
    packageName: "react-aria-components",
  },
  fluent: {
    label: "FluentUI Headless",
    packageName: "@fluentui/react-headless-components-preview",
  },
};

const kebab = (/** @type {string} */ s) =>
  s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

/**
 * @param {string} libKey
 * @param {string} Component
 * @returns {ImportDescriptor[]}
 */
function defaultImports(libKey, Component) {
  switch (libKey) {
    case "radix":
      // radix-ui@1.4.3 is a single barrel — per-component cost comes from tree-shaking
      return [{ from: "radix-ui", named: Component }];
    case "aria":
      return [{ from: `react-aria-components/${Component}` }];
    case "baseui":
      return [{ from: `@base-ui/react/${kebab(Component)}` }];
    case "fluent":
      return [
        {
          from: `@fluentui/react-headless-components-preview/${kebab(Component)}`,
        },
      ];
    default:
      throw new Error(`Unknown library: ${libKey}`);
  }
}

/**
 * Component set follows FluentUI Headless's export map (33 entries; the two
 * infrastructure exports — `positioning` and `provider` — are intentionally
 * excluded). For each other library we map to the equivalent primitive when
 * one exists, or set `null` to render an explicit gap in the report.
 *
 * @type {Record<string, Record<string, ImportDescriptor[] | null | undefined>>}
 */
export const components = {
  Accordion: {
    aria: null, // RAC has Disclosure/DisclosureGroup but no single Accordion primitive
  },
  Avatar: {
    aria: null,
  },
  // Badge: {
  //   radix: null,
  //   baseui: null,
  //   aria: null,
  // },
  Breadcrumb: {
    radix: null,
    baseui: null,
    aria: [{ from: "react-aria-components/Breadcrumbs" }],
  },
  Button: {
    radix: null, // radix-ui has no Button primitive — only Slot/AccessibleIcon helpers
  },
  // Card: {
  //   radix: null,
  //   baseui: null,
  //   aria: null,
  // },
  Checkbox: {},
  Dialog: {
    // RAC splits the overlay surface (Modal) from the dialog role primitive
    aria: [
      { from: "react-aria-components/Modal" },
      { from: "react-aria-components/Dialog" },
    ],
    baseui: [
      { from: "@base-ui/react/alert-dialog", named: "AlertDialog" },
      { from: "@base-ui/react/dialog", named: "Dialog" },
    ],
    radix: [
      { from: "radix-ui", named: "AlertDialog" },
      { from: "radix-ui", named: "Dialog" },
    ],
  },
  Divider: {
    radix: [{ from: "radix-ui", named: "Separator" }],
    baseui: [{ from: "@base-ui/react/separator" }],
    aria: [{ from: "react-aria-components/Separator" }],
  },
  Drawer: {
    radix: null,
    aria: null,
  },
  Field: {
    radix: null,
    aria: null, // RAC ships FieldError/Label but no Field wrapper
  },
  // Image: {
  //   radix: null,
  //   baseui: null,
  //   aria: null,
  // },
  Input: {
    radix: null,
  },
  Link: {
    radix: null,
    baseui: null,
  },
  // MessageBar: {
  //   radix: null,
  //   baseui: null,
  //   aria: null,
  // },
  // Persona: {
  //   radix: null,
  //   baseui: null,
  //   aria: null,
  // },
  Popover: {},
  ProgressBar: {
    radix: [{ from: "radix-ui", named: "Progress" }],
    baseui: [{ from: "@base-ui/react/progress" }],
  },
  RadioGroup: {},
  // Rating: {
  //   radix: null,
  //   baseui: null,
  //   aria: null,
  // },
  // RatingDisplay: {
  //   radix: null,
  //   baseui: null,
  //   aria: null,
  // },
  SearchBox: {
    radix: null,
    baseui: null,
    aria: [{ from: "react-aria-components/SearchField" }],
  },
  Select: {},
  // Skeleton: {
  //   radix: null,
  //   baseui: null,
  //   aria: null,
  // },
  Slider: {},
  SpinButton: {
    radix: null,
    baseui: [{ from: "@base-ui/react/number-field" }],
    aria: [{ from: "react-aria-components/NumberField" }],
  },
  // Spinner: {
  //   radix: null,
  //   baseui: null,
  //   aria: null,
  // },
  Switch: {},
  Tabs: {
    // FluentUI exposes tabs under `tab-list`
    fluent: [{ from: "@fluentui/react-headless-components-preview/tab-list" }],
  },
  Textarea: {
    radix: null,
    baseui: null,
    aria: [{ from: "react-aria-components/TextArea" }],
  },
  ToggleButton: {
    radix: [{ from: "radix-ui", named: "Toggle" }],
    baseui: [{ from: "@base-ui/react/toggle" }],
  },
  Toolbar: {},
  Tooltip: {},
};

/**
 * @param {string} libKey
 * @param {string} Component
 * @returns {ImportDescriptor[] | null}
 */
export function resolveImports(libKey, Component) {
  const override = components[Component]?.[libKey];
  if (override === null) return null;
  return override ?? defaultImports(libKey, Component);
}
