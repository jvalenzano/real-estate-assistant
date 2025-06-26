export const theme = {
  colors: {
    background: 'bg-white',
    surface: 'bg-gray-50',
    card: 'bg-white',
    primary: 'bg-blue-600',
    primaryHover: 'bg-blue-700',
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-600',
      muted: 'text-gray-500',
      inverse: 'text-white'
    },
    border: 'border-gray-200',
    borderLight: 'border-gray-100',
    status: {
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800'
    }
  },
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  }
} as const;