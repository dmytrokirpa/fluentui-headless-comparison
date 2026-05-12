export interface ImportDescriptor {
  from: string;
  named?: string;
}

export interface Library {
  label: string;
  packageName: string;
}

export type ComponentOverrides = Record<
  string,
  ImportDescriptor[] | null | undefined
>;

export const libraries: Record<string, Library>;
export const components: Record<string, ComponentOverrides>;
export function resolveImports(
  libKey: string,
  Component: string,
): ImportDescriptor[] | null;
