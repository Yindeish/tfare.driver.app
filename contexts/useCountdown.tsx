"use client"

import { useState, useEffect, useRef } from "react"

export interface CountdownTimeData {
  seconds: number
  completed: boolean
}

export interface UseCountdownProps {
  targetDate?: Date | number
  duration?: number // in milliseconds
  autoStart?: boolean
  onComplete?: (controls: { restart: () => void }) => void // Pass restart function to onComplete
  onTick?: (timeData: CountdownTimeData) => void
  interval?: number // update interval in milliseconds
  changeCondition?: any[]
}

export const useCountdown = ({
  targetDate,
  duration,
  autoStart = true,
  onComplete,
  onTick,
  interval = 1000,
  changeCondition = []
}: UseCountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<CountdownTimeData>({
    seconds: 0,
    completed: false,
  })
  const [isRunning, setIsRunning] = useState(autoStart)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const endTimeRef = useRef<number>(0)
  const durationRef = useRef<number | undefined>(duration)

  // Calculate the end time based on targetDate or duration
  useEffect(() => {
    if (targetDate) {
      const targetTime = targetDate instanceof Date ? targetDate.getTime() : targetDate
      endTimeRef.current = targetTime
    } else if (durationRef.current && isRunning) {
      endTimeRef.current = Date.now() + durationRef.current
    }
  }, [targetDate, isRunning])

  // Update duration ref when duration prop changes
  useEffect(() => {
    durationRef.current = duration;
  }, [duration, ...changeCondition])

  useEffect(() => {
    console.log(` restart();
    start();`)
    restart();
    start();
  }, changeCondition)

  // Calculate time left in seconds
  const calculateTimeLeft = (): CountdownTimeData => {
    const difference = endTimeRef.current - Date.now()

    if (difference <= 0) {
      return {
        seconds: 0,
        completed: true,
      }
    }

    // Convert milliseconds to seconds and round to whole number
    const totalSeconds = Math.ceil(difference / 1000)

    return {
      seconds: totalSeconds,
      completed: false,
    }
  }

  // Restart function
  const restart = () => {
    setIsRunning(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    if (targetDate) {
      const targetTime = targetDate instanceof Date ? targetDate.getTime() : targetDate
      endTimeRef.current = targetTime
    } else if (durationRef.current) {
      endTimeRef.current = Date.now() + durationRef.current
    }

    setTimeLeft({
      seconds: durationRef.current ? Math.ceil(durationRef.current / 1000) : 0,
      completed: false,
    })

    setIsRunning(true)
  }

  // Update timer
  useEffect(() => {
    if (!isRunning) return

    const updateTimer = () => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)

      if (onTick) {
        onTick(newTimeLeft)
      }

      if (newTimeLeft.completed) {
        setIsRunning(false)
        if (onComplete) {
          onComplete({ restart }) // Pass restart function to onComplete
        }
      }
    }

    // Initial update
    updateTimer()

    // Set interval for updates
    timerRef.current = setInterval(updateTimer, interval)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRunning, interval, onComplete, onTick])

  // Control functions
  const start = () => {
    if (!isRunning) {
      if (durationRef.current && !targetDate) {
        endTimeRef.current = Date.now() + durationRef.current
      }
      setIsRunning(true)
    }
  }

  const pause = () => {
    if (isRunning) {
      setIsRunning(false)
      if (durationRef.current && !targetDate) {
        // Save remaining time as new duration
        durationRef.current = endTimeRef.current - Date.now()
      }
    }
  }

  const reset = () => {
    setIsRunning(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    if (targetDate) {
      const targetTime = targetDate instanceof Date ? targetDate.getTime() : targetDate
      endTimeRef.current = targetTime
    } else if (durationRef.current) {
      endTimeRef.current = Date.now() + durationRef.current
    }

    setTimeLeft({
      seconds: 0,
      completed: false,
    })
  }

  return {
    seconds: timeLeft.seconds,
    completed: timeLeft.completed,
    isRunning,
    start,
    pause,
    reset,
    restart,
  }
}

