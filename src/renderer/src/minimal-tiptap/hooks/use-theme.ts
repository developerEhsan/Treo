import * as React from 'react'

export const useTheme = (): boolean => {
  const [isDarkMode, setIsDarkMode] = React.useState(false)

  React.useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(darkModeMediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent): void => {
      const newDarkMode = e.matches
      setIsDarkMode(newDarkMode)
    }

    darkModeMediaQuery.addEventListener('change', handleChange)

    return (): void => {
      darkModeMediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return isDarkMode
}

export default useTheme
