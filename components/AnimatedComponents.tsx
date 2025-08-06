"use client"

import { useEffect, useState, useRef } from "react"
import { motion, useInView, useAnimation } from "framer-motion"

// Animated Counter Component
interface AnimatedCounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export function AnimatedCounter({ end, duration = 2000, suffix = "", prefix = "", className = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)
      let startTime: number
      let animationFrame: number

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / duration, 1)
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        setCount(Math.floor(easeOutQuart * end))

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate)
        }
      }

      animationFrame = requestAnimationFrame(animate)

      return () => {
        if (animationFrame) {
          cancelAnimationFrame(animationFrame)
        }
      }
    }
  }, [isInView, end, duration, hasAnimated])

  return (
    <span ref={ref} className={`text-4xl font-bold ${className}`}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

// Fade In Section Component
interface FadeInSectionProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function FadeInSection({ children, delay = 0, duration = 0.6, className = "" }: FadeInSectionProps) {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration,
            delay: delay / 1000,
            ease: "easeOut"
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Slide In Section Component
interface SlideInSectionProps {
  children: React.ReactNode
  direction?: "left" | "right" | "up" | "down"
  delay?: number
  duration?: number
  className?: string
}

export function SlideInSection({ 
  children, 
  direction = "up", 
  delay = 0, 
  duration = 0.6, 
  className = "" 
}: SlideInSectionProps) {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  const getInitialPosition = () => {
    switch (direction) {
      case "left": return { x: -100, y: 0 }
      case "right": return { x: 100, y: 0 }
      case "up": return { x: 0, y: 50 }
      case "down": return { x: 0, y: -50 }
      default: return { x: 0, y: 50 }
    }
  }

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        hidden: { 
          opacity: 0, 
          ...getInitialPosition()
        },
        visible: { 
          opacity: 1, 
          x: 0, 
          y: 0,
          transition: { 
            duration,
            delay: delay / 1000,
            ease: "easeOut"
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Staggered List Component
interface StaggeredListProps {
  children: React.ReactNode[]
  staggerDelay?: number
  className?: string
}

export function StaggeredList({ children, staggerDelay = 0.1, className = "" }: StaggeredListProps) {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.5, ease: "easeOut" }
            }
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// Scale On Hover Component
interface ScaleOnHoverProps {
  children: React.ReactNode
  scale?: number
  duration?: number
  className?: string
}

export function ScaleOnHover({ children, scale = 1.05, duration = 0.2, className = "" }: ScaleOnHoverProps) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: scale * 0.95 }}
      transition={{ duration, ease: "easeInOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Floating Element Component
interface FloatingElementProps {
  children: React.ReactNode
  amplitude?: number
  duration?: number
  className?: string
}

export function FloatingElement({ children, amplitude = 10, duration = 3, className = "" }: FloatingElementProps) {
  return (
    <motion.div
      animate={{
        y: [-amplitude, amplitude, -amplitude],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Pulse Element Component
interface PulseElementProps {
  children: React.ReactNode
  scale?: number
  duration?: number
  className?: string
}

export function PulseElement({ children, scale = 1.1, duration = 2, className = "" }: PulseElementProps) {
  return (
    <motion.div
      animate={{
        scale: [1, scale, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Typewriter Effect Component
interface TypewriterProps {
  text: string
  delay?: number
  speed?: number
  className?: string
}

export function Typewriter({ text, delay = 0, speed = 50, className = "" }: TypewriterProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView && !hasStarted) {
      setHasStarted(true)
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          setCurrentIndex((prevIndex) => {
            if (prevIndex >= text.length) {
              clearInterval(interval)
              return prevIndex
            }
            return prevIndex + 1
          })
        }, speed)

        return () => clearInterval(interval)
      }, delay)

      return () => clearTimeout(timer)
    }
  }, [isInView, hasStarted, text, delay, speed])

  useEffect(() => {
    setDisplayText(text.slice(0, currentIndex))
  }, [currentIndex, text])

  return (
    <span ref={ref} className={className}>
      {displayText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block"
        >
          |
        </motion.span>
      )}
    </span>
  )
}

// Reveal Text Component
interface RevealTextProps {
  text: string
  delay?: number
  className?: string
}

export function RevealText({ text, delay = 0, className = "" }: RevealTextProps) {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.05,
            delayChildren: delay / 1000
          }
        }
      }}
      className={className}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.5, ease: "easeOut" }
            }
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  )
}

// Progress Bar Component
interface ProgressBarProps {
  progress: number
  height?: number
  color?: string
  backgroundColor?: string
  className?: string
}

export function ProgressBar({ 
  progress, 
  height = 4, 
  color = "#3b82f6", 
  backgroundColor = "#e5e7eb",
  className = "" 
}: ProgressBarProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div
      ref={ref}
      className={`w-full rounded-full overflow-hidden ${className}`}
      style={{ height, backgroundColor }}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={isInView ? { width: `${Math.min(Math.max(progress, 0), 100)}%` } : { width: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  )
}
