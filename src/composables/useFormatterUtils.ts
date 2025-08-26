export function useFormatterUtils() {
  /**
   * Format a number as Vietnamese currency
   */
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value)
  }

  return {
    formatCurrency
  }
} 