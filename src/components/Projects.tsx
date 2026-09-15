import { useRef, useState, useEffect } from 'react'

const PROJECTS = [
  {
    index: '01',
    id: 'REALTIME-VIDEO-CALL-TRANSLATION',
    title: 'Real-Time Video Call Translation',
    subtitle: 'Cross-language communication system',
    description:
      'Developed a real-time translation system processing audio streams with 90% accuracy across 10+ languages and implemented WebRTC for peer-to-peer video streaming, reducing latency by 40%.',
    year: '2025',
    category: 'AI + Communication',
    metric: '90%',
    metricUnit: 'accuracy',
    metricLabel: 'Across 10+ languages',
    accent: '#26A7FF',
    tags: ['Whisper AI', 'PyTorch', 'NodeJS', 'ReactJS', 'Flask', 'JavaScript'],
    repoUrl: 'https://github.com/Sidhartha-s-935/Videocall_translation',
  },
  {
    index: '02',
    id: 'CROPCAST',
    title: 'CropCast',
    subtitle: 'Crop yield forecasting dashboard',
    description:
      'Engineered an LSTM-based prediction model achieving 85% accuracy in crop yield forecasting and integrated a data visualization dashboard using Chart.js, then deployed the application on Render.',
    year: '2024',
    category: 'AI + Agriculture',
    metric: '85%',
    metricUnit: 'accuracy',
    metricLabel: 'Yield forecasting',
    accent: '#178CE0',
    tags: ['LSTM', 'Flask', 'Python', 'Chart.js', 'Render'],
    repoUrl: 'https://github.com/Sidhartha-s-935/CropCast',
  },
  {
    index: '03',
    id: 'SLEEP-STAGING',
    title: 'Sleep Staging Using EEG Signals',
    subtitle: 'Neural signal classification model',
    description:
      'Developed a high-performance sleep staging model using CNNs and Transformers, achieving state-of-the-art metrics (F1: 82.7, Kappa: 76.9, Balanced Accuracy: 76.7) and outperforming benchmarks on Sleep-EDF and multichannel datasets.',
    year: '2024',
    category: 'AI + Healthcare',
    metric: '82.7',
    metricUnit: 'F1',
    metricLabel: 'Sleep staging',
    accent: '#6BCBFF',
    tags: ['Python', 'PyTorch', 'NumPy', 'Matplotlib', 'Scikit-Learn', 'mne'],
    repoUrl: 'https://github.com/Mxlzz31/sleep',
  },
  {
    index: '04',
    id: 'EYE-DISEASE-VIT',
    title: 'Eye Disease Classification with ViT',
    subtitle: 'Medical image classification',
    description:
      'Developed a ViT-B16 model for multi-class classification of fundus images for glaucoma, cataract, and diabetic retinopathy and achieved 92% accuracy using transfer learning and optimized final classification layers.',
    year: '2024',
    category: 'AI + Healthcare',
    metric: '92%',
    metricUnit: 'accuracy',
    metricLabel: 'Disease classification',
    accent: '#8ED8FF',
    tags: ['Python', 'PyTorch', 'timm', 'torchvision'],
    repoUrl: 'https://github.com/Mxlzz31/eye_disease_classification',
  },
]

interface Tilt {
  rx: number
  ry: number
  gx: number
  gy: number
}

function ProjectCard({ project, visible }: { project: (typeof PROJECTS)[0]; visible: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState<Tilt>({ rx: 0, ry: 0, gx: 50, gy: 50 })
  const [hovered, setHovered] = useState(false)

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const cx = r.width / 2
    const cy = r.height / 2
    setTilt({
      ry: ((x - cx) / cx) * 9,
      rx: -((y - cy) / cy) * 5,
      gx: (x / r.width) * 100,
      gy: (y / r.height) * 100,
    })
  }

  const onLeave = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50 })
    setHovered(false)
  }

  return (
    <div
      ref={ref}
      data-hover
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      onClick={() => window.open(project.repoUrl, '_blank', 'noopener,noreferrer')}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') window.open(project.repoUrl, '_blank', 'noopener,noreferrer')
      }}
      role="button"
      tabIndex={0}
      className="relative h-[470px] min-h-0 cursor-pointer overflow-hidden transition-all duration-700"
      style={{
        background: '#0B0B10',
        transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${hovered ? 1.015 : 1})`,
        transition: hovered
          ? 'transform 0.12s ease'
          : 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.8s ease',
        transformStyle: 'preserve-3d',
        opacity: visible ? 1 : 0,
      }}
    >
      <div className="absolute inset-0" style={{ perspective: '1200px' }}>
        <div
          className="relative h-full w-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="absolute inset-0 p-5 sm:p-7" style={{ backfaceVisibility: 'hidden' }}>
            <div className="absolute inset-x-0 top-0 h-1" style={{ background: project.accent, opacity: hovered ? 1 : 0.65 }} />
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              style={{ opacity: hovered ? 1 : 0, background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, ${project.accent}18 0%, transparent 58%)` }}
            />
            <div className="relative flex h-full flex-col">
              <div className="mb-6 flex items-start justify-between">
                <span className="blue-label uppercase">{project.index}</span>
                <span className="blue-label uppercase tracking-[0.08em]">
                  {project.category} · {project.year}
                </span>
              </div>

              <div className="relative mb-6 h-[112px] overflow-hidden border border-white/10 bg-[#07070A]">
                <div className="absolute inset-0 opacity-70" style={{ background: `radial-gradient(circle at 28% 38%, ${project.accent}44, transparent 24%), linear-gradient(125deg, ${project.accent}12, transparent 55%)` }} />
                <div className="absolute inset-x-5 top-1/2 h-px" style={{ background: `${project.accent}66` }} />
                <div className="absolute inset-y-5 left-[18%] w-px" style={{ background: `${project.accent}55`, transform: `rotate(${project.index === '03' ? '-20deg' : '24deg'})` }} />
                <div className="absolute inset-y-5 left-1/2 w-px" style={{ background: `${project.accent}55`, transform: 'rotate(-34deg)' }} />
                <div className="absolute inset-y-5 right-[18%] w-px" style={{ background: `${project.accent}55`, transform: 'rotate(22deg)' }} />
                <div className="absolute bottom-4 left-5 blue-label uppercase" style={{ color: project.accent }}>{project.index}</div>
                <div className="absolute right-5 top-4 grid grid-cols-3 gap-1">
                  {[1, 2, 3, 4, 5, 6].map(dot => <span key={dot} className="h-1.5 w-1.5 rounded-full" style={{ background: project.accent, opacity: 0.25 + dot * 0.1 }} />)}
                </div>
              </div>

              <h3 className="h-[70px] overflow-hidden font-display font-extrabold uppercase leading-[0.98] text-[#EEEAE0]" style={{ fontSize: 'clamp(24px, 2.5vw, 36px)', letterSpacing: '-0.025em' }}>
                {project.title}
              </h3>
              <p className="mt-4 h-[36px] overflow-hidden font-sans font-semibold text-sm leading-relaxed text-white/75">{project.subtitle}</p>
              <p className="mt-4 max-w-2xl font-sans text-[13px] font-medium leading-relaxed text-white/80">{project.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="border px-2 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.06em] text-white/75" style={{ borderColor: `${project.accent}55` }}>
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex items-end justify-between border-t border-[#EEEAE0]/10 pt-4">
                <div>
                  <div className="font-display font-extrabold text-2xl leading-none" style={{ color: project.accent }}>
                    {project.metric}<span className="ml-1 text-sm uppercase opacity-75">{project.metricUnit}</span>
                  </div>
                  <div className="blue-label mt-2 uppercase tracking-[0.08em]">{project.metricLabel}</div>
                </div>
                <span className="font-sans text-[11px] font-extrabold uppercase tracking-[0.06em]" style={{ color: project.accent }}>Open GitHub ↗</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="projects" className="py-24 sm:py-32 px-10 sm:px-16 lg:px-24 bg-[linear-gradient(110deg,rgba(38,167,255,0.16),transparent_45%,rgba(107,203,255,0.1)),#07070A]">
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div
          className="flex items-end justify-between mb-12 sm:mb-16 pb-7"
          style={{ borderBottom: '1px solid rgba(238,234,224,0.06)' }}
        >
          <div>
            <h2
              className="font-display font-black uppercase text-[#EEEAE0] leading-none"
              style={{ fontSize: 'clamp(30px, 3.5vw, 48px)', letterSpacing: '-0.03em' }}
            >
              Projects
            </h2>
          </div>
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#EEEAE0]/22 pb-2">
            4 projects
          </span>
        </div>

        <div ref={ref} className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <div key={project.id} style={{ transitionDelay: `${index * 100}ms` }}>
              <ProjectCard project={project} visible={visible} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
