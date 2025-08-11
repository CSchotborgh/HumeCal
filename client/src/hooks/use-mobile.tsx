import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

export function useMobileOrientation() {
  const [orientation, setOrientation] = React.useState<{
    isMobile: boolean
    isPortrait: boolean
    isLandscape: boolean
  }>({
    isMobile: false,
    isPortrait: false,
    isLandscape: false
  })

  React.useEffect(() => {
    const updateOrientation = () => {
      const isMobile = window.innerWidth < MOBILE_BREAKPOINT
      const isPortrait = window.innerHeight > window.innerWidth
      const isLandscape = window.innerWidth > window.innerHeight
      
      setOrientation({
        isMobile,
        isPortrait: isMobile && isPortrait,
        isLandscape: isMobile && isLandscape
      })
    }

    // Initial check
    updateOrientation()

    // Listen for both resize and orientation change events
    window.addEventListener('resize', updateOrientation)
    window.addEventListener('orientationchange', updateOrientation)
    
    return () => {
      window.removeEventListener('resize', updateOrientation)
      window.removeEventListener('orientationchange', updateOrientation)
    }
  }, [])

  return orientation
}
