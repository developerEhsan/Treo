import { cn } from '@renderer/utils'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

function useGridLayout(): {
  layout: {
    vertical: number
    horizontal: number
  }
  containerRef: React.RefObject<HTMLDivElement | null>
} {
  const containerRef = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState({ vertical: 0, horizontal: 0 })

  useEffect(() => {
    const updateLayout = (): void => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) {
        return
      }
      setLayout({
        vertical: Math.floor(rect.height),
        horizontal: Math.floor(rect.width)
      })
    }

    updateLayout()

    // Can be debounced if needed
    window.addEventListener('resize', updateLayout)
    return (): void => window.removeEventListener('resize', updateLayout)
  }, [])

  return {
    layout,
    containerRef
  }
}

function plotSquares(width: number, height: number, size: number): { x: number; y: number }[] {
  const squares: { x: number; y: number }[] = []

  const boundary = size * 2
  const used = new Set<number>()

  for (let x = boundary; x < width / 2 - boundary; x += size) {
    for (let y = boundary; y < height - boundary; y += size) {
      // Custom logic to reduce the number of squares
      if (
        used.has(x - y + size) ||
        used.has(x + y - size) ||
        used.has(x + y + size * 4) ||
        used.has(x + y - size * 4)
      ) {
        continue
      }

      used.add(x + y)
      squares.push({ x, y })
    }
  }
  return squares
}

const size = 24 // h-6
const boxClassName =
  'absolute h-6 w-6 rounded-md bg-transparent p-px border border-gray-400/30 border-box group '

function Grid(): React.JSX.Element {
  const {
    layout: { vertical, horizontal },
    containerRef
  } = useGridLayout()

  const squares = useMemo(() => plotSquares(horizontal, vertical, size), [horizontal, vertical])
  const [active, setActive] = useState(0)
  const timerRef = useRef<NodeJS.Timeout>(undefined)

  const onMouseEnter = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    const set = (): void => {
      const next = squares[Math.floor(Math.random() * squares.length) % squares.length]
      setActive(Number(next?.x + next?.y))
    }

    set()

    const cycleCount = 5
    let count = 0
    timerRef.current = setInterval(() => {
      if (count === cycleCount) {
        clearInterval(timerRef.current)
        setActive(0)
        return
      }

      set()
      count++
    }, 1000)
  }, [squares])

  const cells = useMemo(() => {
    return squares.map(({ x, y }, i) => {
      let xPos = x
      if (i % 2) {
        // Mirror the grid horizontally (50% of the time)
        xPos = horizontal - x - size
      }

      const shouldHighlight = active - x === x || active - y === y
      return (
        <div
          className={boxClassName}
          key={`${x}-${y}`}
          onClick={onMouseEnter}
          onMouseEnter={onMouseEnter}
          style={{
            transform: `translate(${xPos}px, ${y}px)`
          }}
        >
          <div
            className={cn(
              'h-full w-full scale-90 rounded bg-gray-400/30 opacity-0 transition-all duration-700',
              {
                'scale-100 opacity-100': shouldHighlight,
                'group-hover:scale-100 group-hover:opacity-100': !shouldHighlight
              }
            )}
            style={{
              transitionDelay: active ? `${x + y}ms` : '0ms'
            }}
          />
        </div>
      )
    })
  }, [squares, horizontal, active, onMouseEnter])

  return (
    <div
      className={cn('absolute inset-0 !min-h-full w-full grid items-center')}
      onMouseEnter={onMouseEnter}
      ref={containerRef}
    >
      {cells}
    </div>
  )
}

export default function InteractiveGrid({
  children,
  className,
  contentClassName
}: {
  readonly children: React.ReactNode
  readonly className?: string
  readonly contentClassName?: string
}): React.JSX.Element {
  return (
    <div
      className={cn('storybook-fix relative h-full w-full overflow-hidden rounded-3xl', className)}
      style={{
        backgroundImage:
          'linear-gradient(123deg, transparent 0%, transparent 36%, rgba(17, 17, 57, 0.02) 36%, rgba(17, 17, 87, 0.02) 56%, transparent 56%, transparent 100%), linear-gradient(251deg, transparent 0%, transparent 68%, rgba(3, 3, 3, 0.02) 68%, rgba(3, 3, 93, 0.02) 99%, transparent 99%, transparent 100%), linear-gradient(135deg, hsl(var(--background)), hsl(var(--muted)))'
      }}
    >
      <Grid />

      <div className={cn('relative mx-auto h-full w-fit grid items-center', contentClassName)}>
        {children}
      </div>
    </div>
  )
}
