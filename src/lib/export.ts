export function exportToCSV<T extends Record<string, unknown>>(
  filename: string,
  rows: T[],
  headers?: { key: keyof T; label: string }[]
) {
  if (rows.length === 0) return;
  const cols =
    headers ?? (Object.keys(rows[0]) as (keyof T)[]).map((k) => ({ key: k, label: String(k) }));

  const escape = (val: unknown) => {
    if (val == null) return "";
    const s = String(val).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };

  const csv = [
    cols.map((c) => escape(c.label)).join(","),
    ...rows.map((r) => cols.map((c) => escape(r[c.key])).join(",")),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
