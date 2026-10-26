// Horizontal bar chart of review issues, as accessible inline SVG with a table alternative.
type Slice = { label: string; count: number; pct: number };

const BAR_H = 26;
const GAP = 12;
const LABEL_W = 210;
const CHART_W = 640;

export default function ReviewChart({ slices, total }: { slices: Slice[]; total: number }) {
  // Largest named issues first; "Other" last.
  const rows = [...slices].sort((a, b) => (a.label === 'Other' ? 1 : b.label === 'Other' ? -1 : b.count - a.count));
  const max = Math.max(...rows.map((r) => r.count));
  const height = rows.length * (BAR_H + GAP);
  const barSpace = CHART_W - LABEL_W - 70;

  return (
    <figure className="cs-chart">
      <svg viewBox={`0 0 ${CHART_W} ${height}`} role="img" aria-labelledby="review-chart-title review-chart-desc">
        <title id="review-chart-title">Main issue in {total} App Store reviews that mention one</title>
        <desc id="review-chart-desc">{rows.map((r) => `${r.label}: ${r.pct}% (${r.count})`).join('; ')}.</desc>
        {rows.map((r, i) => {
          const y = i * (BAR_H + GAP);
          const w = Math.max(4, (r.count / max) * barSpace);
          const focus = r.label === 'Content generalization';
          return (
            <g key={r.label} transform={`translate(0 ${y})`}>
              <text x={LABEL_W - 12} y={BAR_H / 2} className={`cs-chart-label${focus ? ' is-focus' : ''}`} textAnchor="end" dominantBaseline="central">{r.label}</text>
              <rect x={LABEL_W} y={0} width={w} height={BAR_H} rx={6} className={focus ? 'cs-bar is-focus' : 'cs-bar'} />
              <text x={LABEL_W + w + 10} y={BAR_H / 2} className="cs-chart-value" dominantBaseline="central">{r.pct}% · {r.count}</text>
            </g>
          );
        })}
      </svg>
      <details className="cs-chart-table">
        <summary>Show as a table</summary>
        <table>
          <thead><tr><th scope="col">Main issue</th><th scope="col">Reviews</th><th scope="col">Share of {total}</th></tr></thead>
          <tbody>
            {rows.map((r) => <tr key={r.label}><th scope="row">{r.label}</th><td>{r.count}</td><td>{r.pct}%</td></tr>)}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
