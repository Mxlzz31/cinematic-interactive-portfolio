const EDUCATION = {
  school: 'Chennai Institute of Technology',
  period: 'November 2022 - March 2026',
  degree: 'B.E. in Computer Science and Engineering',
  gpa: 'GPA: 8.78 / 10',
  coursework: ['Data Structures', 'Algorithms', 'Operating Systems', 'Database Design', 'Agile Methods', 'SDLC'],
}

export default function Education() {
  return (
    <section id="education" className="relative overflow-hidden bg-[radial-gradient(circle_at_80%_20%,rgba(38,167,255,0.13),transparent_28%),#07070A] px-10 py-20 sm:px-16 sm:py-24 lg:px-24">
      <div className="pointer-events-none absolute -right-20 top-10 h-64 w-64 rounded-full border border-[#26A7FF]/15" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-display text-3xl font-extrabold uppercase leading-none tracking-[-0.03em] text-white sm:text-4xl">
            Education
          </h2>
          <span className="blue-label uppercase tracking-[0.14em]">
            {EDUCATION.period}
          </span>
        </div>

        <div className="grid gap-8 border-l-2 border-[#26A7FF] bg-[#0A0F16]/80 px-6 py-6 sm:px-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <h3 className="font-sans text-2xl font-extrabold leading-tight text-white sm:text-3xl">
              {EDUCATION.school}
            </h3>
            <p className="mt-3 font-sans text-sm font-semibold text-white/75">{EDUCATION.degree}</p>
            <p className="blue-label mt-4 uppercase tracking-[0.1em]">{EDUCATION.gpa}</p>
          </div>

          <div>
            <div className="mb-3 font-sans text-xs font-extrabold uppercase tracking-[0.16em] text-white/70">
              Relevant coursework
            </div>
            <div className="flex flex-wrap gap-2">
              {EDUCATION.coursework.map((item, index) => (
                <span
                  key={item}
                  className="border border-[#26A7FF]/30 bg-[#26A7FF]/[0.06] px-3 py-2 font-sans text-xs font-bold text-white/80 transition-colors duration-300 hover:border-[#26A7FF] hover:bg-[#26A7FF]/15 hover:text-white"
                  style={{ transitionDelay: `${index * 30}ms` }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
