// Centralized currency helpers for displaying USD (no runtime conversion)

export const DISPLAY_CURRENCY = 'USD'

export const formatMoney = (value) => {
  const n = Number(value || 0)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: DISPLAY_CURRENCY,
    maximumFractionDigits: 2,
  }).format(n)
}
