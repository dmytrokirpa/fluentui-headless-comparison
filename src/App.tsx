import { useEffect, useMemo, useState } from 'react';
import { libraries, components } from '../bundle-size/manifest.js';
import './App.css';

interface Entry {
  name: string;
  minifiedSize: number;
  gzippedSize: number;
}

type View = 'gzipped' | 'minified';

const fmt = (bytes: number) => `${(bytes / 1024).toFixed(2)} kB`;

function App() {
  const [data, setData] = useState<Entry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('minified');

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}monosize.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Entry[]>;
      })
      .then(setData)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : String(e)),
      );
  }, []);

  const byName = useMemo(
    () => new Map((data ?? []).map((e) => [e.name, e] as const)),
    [data],
  );

  const sizeOf = (name: string) => {
    const entry = byName.get(name);
    if (!entry) return null;
    return view === 'gzipped' ? entry.gzippedSize : entry.minifiedSize;
  };

  const libKeys = Object.keys(libraries);
  const componentKeys = Object.keys(components);

  return (
    <main className="report">
      <header>
        <h1>Headless library bundle-size comparison</h1>
        <p className="subtitle">
          Per-component and aggregate cost across {libKeys.length} libraries.{' '}
          <code>All</code> is a single fixture that imports every component for
          that library — it accounts for shared internals and is usually less
          than the per-component sum.
        </p>
        <div className="controls" role="radiogroup" aria-label="Size to show">
          {(['gzipped', 'minified'] as View[]).map((v) => (
            <label key={v}>
              <input
                type="radio"
                name="view"
                value={v}
                checked={view === v}
                onChange={() => setView(v)}
              />
              {v}
            </label>
          ))}
        </div>
      </header>

      {error && (
        <p className="error">
          Could not load <code>monosize.json</code>: {error}. Run{' '}
          <code>yarn measure</code>.
        </p>
      )}

      {!error && !data && <p>Loading…</p>}

      {data && (
        <table>
          <thead>
            <tr>
              <th scope="col">Component</th>
              {libKeys.map((k) => (
                <th key={k} scope="col">
                  {libraries[k].label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {componentKeys.map((c) => {
              const row = libKeys.map((k) => sizeOf(`${k}/${c}`));
              const present = row.filter((v): v is number => v != null);
              // best/worst only meaningful with at least two data points
              const min = present.length >= 2 ? Math.min(...present) : null;
              const max = present.length >= 2 ? Math.max(...present) : null;
              return (
                <tr key={c}>
                  <th scope="row">{c}</th>
                  {libKeys.map((k, i) => {
                    const v = row[i];
                    const cls =
                      v == null
                        ? 'na'
                        : v === min
                          ? 'best'
                          : v === max
                            ? 'worst'
                            : '';
                    return (
                      <td key={k} className={cls}>
                        {v == null ? '—' : fmt(v)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            <tr className="total">
              <th scope="row">All (combined)</th>
              {libKeys.map((k) => {
                const v = sizeOf(`${k}/All`);
                return (
                  <td key={k}>{v == null ? '—' : fmt(v)}</td>
                );
              })}
            </tr>
          </tbody>
        </table>
      )}
    </main>
  );
}

export default App;
