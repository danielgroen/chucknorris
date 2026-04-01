import { useState, useEffect, useRef } from 'react'
import { TIMER_INTERVAL_MS } from '@consts'

export const useTimer = (callback: () => void) => {
  const [isRunning, setIsRunning] = useState(false)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!isRunning) return
    const id = setInterval(() => callbackRef.current(), TIMER_INTERVAL_MS)
    return () => clearInterval(id)
  }, [isRunning])

  const toggle = () => setIsRunning(prev => !prev)

  return { isRunning, toggle }
}
