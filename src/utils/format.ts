/**
 * Formatting helpers for the demonstration dataset.
 * All timestamps are fixed ISO strings so output is reproducible.
 */

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

/** "12 Jun 2025, 08:45" — deterministic, locale-independent. */
export function formatDateTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  const day = String(date.getDate()).padStart(2, '0')
  const month = MONTHS[date.getMonth()]
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day} ${month} ${year}, ${hours}:${minutes}`
}

/** "12 Jun 2025" */
export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return `${String(date.getDate()).padStart(2, '0')} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

/** "08:45" */
export function formatTime(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '--:--'
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

/** Compact numeric formatting for large KPI values. */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatDecimal(value: number, digits = 1): string {
  return value.toFixed(digits)
}

/** "1,204" style with a unit suffix. */
export function formatWithUnit(value: number, unit: string, digits = 0): string {
  return `${formatDecimal(value, digits)} ${unit}`
}
