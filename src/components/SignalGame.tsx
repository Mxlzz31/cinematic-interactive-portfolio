import { useCallback, useEffect, useRef, useState } from 'react'

const GRID = 4
const NODES = GRID * GRID
const START_MS = 1300
const MIN_MS = 430
const DECAY = 0.94
const LIVES = 3
const BEST_KEY = 'signal-best'

type Phase = 'idle' | 'playing' | 'over'

/**
 * A reflex game dressed as a latency probe: hit each node before its window
 * closes. The window shrinks with every hit, so the run ends in a miss.
 */
export default function SignalGame() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [score, setScore] = useState(0)
  const [lives, setLives] = useState(LIVES)
  const [active, setActive] = useState(-1)
  const [ripple, setRipple] = useState(-1)
  const [best, setBest] = useState(0)
  const [avgMs, setAvgMs] = useState(0)

  const limitRef = useRef(START_MS)
  const startedAtRef = useRef(0)
  const timesRef = useRef<number[]>([])
  const barRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef(0)
  const rippleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // The loop reads these without re-subscribing every render.
  const phaseRef = useRef<Phase>('idle')
  const missRef = useRef<() => void>(() => {})

  // Browser storage can throw (private mode, blocked site data).
  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem(BEST_KEY))
      if (Number.isFinite(saved) && saved > 0) setBest(saved)
    } catch {
      /* no stored best available */
    }
  }, [])

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  const nextNode = useCallback((exclude: number) => {
    let n = exclude
    while (n === exclude) n = Math.floor(Math.random() * NODES)
    setActive(n)
    startedAtRef.current = performance.now()
  }, [])

  const endRun = useCallback(
    (finalScore: number) => {
      setPhase('over')
      setActive(-1)
      const times = timesRef.current
      setAvgMs(times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0)
      if (finalScore > best) {
        setBest(finalScore)
        try {
          localStorage.setItem(BEST_KEY, String(finalScore))
        } catch {
          /* best score stays session-only */
        }
      }
    },
    [best],
  )

  const miss = useCallback(() => {
    setLives(l => {
      const left = l - 1
      if (left <= 0) {
        setScore(s => {
          endRun(s)
          return s
        })
      } else {
        setActive(a => {
          let n = a
          while (n === a) n = Math.floor(Math.random() * NODES)
          startedAtRef.current = performance.now()
          return n
        })
      }
      return left
    })
  }, [endRun])

  useEffect(() => {
    missRef.current = miss
  }, [miss])

  // One rAF loop for the whole game, driving the countdown bar directly.
  useEffect(() => {
    const tick = () => {
      if (phaseRef.current === 'playing') {
        const elapsed = performance.now() - startedAtRef.current
        const left = Math.max(0, 1 - elapsed / limitRef.current)
        if (barRef.current) barRef.current.style.transform = `scaleX(${left})`
        if (left <= 0) missRef.current()
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  useEffect(
    () => () => {
      if (rippleTimer.current) clearTimeout(rippleTimer.current)
    },
    [],
  )

  const start = () => {
    limitRef.current = START_MS
    timesRef.current = []
    setScore(0)
    setLives(LIVES)
    setAvgMs(0)
    setPhase('playing')
    phaseRef.current = 'playing'
    nextNode(-1)
  }

  const hit = (index: number) => {
    if (phase !== 'playing') return
    if (index !== active) {
      miss()
      return
    }
    timesRef.current.push(performance.now() - startedAtRef.current)
    setScore(s => s + 1)
    limitRef.current = Math.max(MIN_MS, limitRef.current * DECAY)
    setRipple(index)
    if (rippleTimer.current) clearTimeout(rippleTimer.current)
    rippleTimer.current = setTimeout(() => setRipple(-1), 320)
    nextNode(index)
  }

  const isNeighbour = (i: number) => {
    if (ripple < 0) return false
    const dr = Math.abs(Math.floor(i / GRID) - Math.floor(ripple / GRID))
    const dc = Math.abs((i % GRID) - (ripple % GRID))
    return dr <= 1 && dc <= 1 && i !== ripple
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#EEEAE0]/12 bg-[#0B0D12] shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-white/8 bg-[#0E1118] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        <span className="ml-3 truncate font-mono text-[10px] tracking-[0.12em] text-white/45">
          latency-probe
        </span>
        <span className="ml-auto font-sans text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#26A7FF]">
          Playable
        </span>
      </div>

      {/* HUD */}
      <div className="flex items-center justify-between gap-4 border-b border-white/8 px-4 py-2.5">
        <div className="flex items-baseline gap-2">
          <span className="font-sans text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/45">
            Score
          </span>
          <span className="font-display text-lg font-extrabold leading-none tabular-nums text-[#EEEAE0]">
            {score}
          </span>
        </div>
        <div className="flex items-center gap-1.5" aria-label={`${lives} lives remaining`}>
          {Array.from({ length: LIVES }).map((_, i) => (
            <span
              key={i}
              className="h-1.5 w-4 rounded-full transition-colors duration-300"
              style={{ background: i < lives ? '#26A7FF' : 'rgba(238,234,224,0.14)' }}
            />
          ))}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-sans text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/45">
            Best
          </span>
          <span className="font-display text-lg font-extrabold leading-none tabular-nums text-[#26A7FF]">
            {best}
          </span>
        </div>
      </div>

      {/* Countdown for the current node */}
      <div className="h-[3px] w-full bg-white/5">
        <div
          ref={barRef}
          className="h-full origin-left bg-[#26A7FF]"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Board */}
      <div className="relative p-4 sm:p-5">
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
          {Array.from({ length: NODES }).map((_, i) => {
            const isActive = i === active && phase === 'playing'
            const isRipple = i === ripple
            const neighbour = isNeighbour(i)
            return (
              <button
                key={i}
                type="button"
                onPointerDown={() => hit(i)}
                disabled={phase !== 'playing'}
                aria-label={isActive ? 'Active node - hit it' : 'Node'}
                className="relative aspect-square rounded-lg border transition-all duration-150 disabled:cursor-default"
                style={{
                  borderColor: isActive ? '#26A7FF' : 'rgba(238,234,224,0.09)',
                  background: isActive
                    ? 'rgba(38,167,255,0.22)'
                    : isRipple
                      ? 'rgba(38,167,255,0.14)'
                      : neighbour
                        ? 'rgba(38,167,255,0.06)'
                        : 'rgba(238,234,224,0.02)',
                  boxShadow: isActive ? '0 0 22px rgba(38,167,255,0.45)' : 'none',
                  transform: isActive ? 'scale(1.06)' : neighbour ? 'scale(1.03)' : 'scale(1)',
                }}
              >
                <span
                  className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-150"
                  style={{
                    background: isActive ? '#EEEAE0' : 'rgba(238,234,224,0.22)',
                    transform: isActive
                      ? 'translate(-50%, -50%) scale(2)'
                      : 'translate(-50%, -50%) scale(1)',
                  }}
                />
              </button>
            )
          })}
        </div>

        {/* Idle / game-over overlay */}
        {phase !== 'playing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0B0D12]/92 px-6 text-center backdrop-blur-sm">
            {phase === 'idle' ? (
              <>
                <div className="font-display text-xl font-extrabold uppercase tracking-tight text-[#EEEAE0]">
                  Latency probe
                </div>
                <p className="max-w-[260px] font-sans text-[12px] font-medium leading-relaxed text-white/65">
                  Hit each lit node before its window closes. The window gets shorter every time.
                </p>
              </>
            ) : (
              <>
                <div className="font-display text-xl font-extrabold uppercase tracking-tight text-[#EEEAE0]">
                  {score > 0 && score >= best ? 'New best' : 'Signal lost'}
                </div>
                <div className="flex items-center gap-6">
                  <div>
                    <div className="font-display text-3xl font-extrabold leading-none text-[#26A7FF]">
                      {score}
                    </div>
                    <div className="mt-1 font-sans text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/45">
                      Nodes
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-3xl font-extrabold leading-none text-[#EEEAE0]">
                      {avgMs}
                      <span className="ml-0.5 text-sm">ms</span>
                    </div>
                    <div className="mt-1 font-sans text-[9px] font-extrabold uppercase tracking-[0.16em] text-white/45">
                      Avg reaction
                    </div>
                  </div>
                </div>
              </>
            )}
            <button
              type="button"
              onClick={start}
              data-hover
              className="mt-1 bg-[#26A7FF] px-6 py-3 font-sans text-[11px] font-bold uppercase tracking-[0.1em] text-[#07070A] transition-colors duration-300 hover:bg-white"
            >
              {phase === 'idle' ? 'Start' : 'Run again'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
