'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export type RealizedProject = {
  id: string
  title: string
  subtitle: string
  image: string
}

type Props = {
  projects: readonly RealizedProject[]
  containerClassName: string
}

export default function RealizedProjectsSlider({ projects, containerClassName }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const getStep = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return 0
    const card = el.querySelector<HTMLElement>('[data-project-card]')
    if (!card) return el.clientWidth
    const gapCss = getComputedStyle(el).gap
    const gap = gapCss ? parseFloat(gapCss) : 24
    return card.getBoundingClientRect().width + (Number.isFinite(gap) ? gap : 24)
  }, [])

  const scrollByDir = (dir: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * getStep(), behavior: 'smooth' })
  }

  const scrollToIndex = (index: number) => {
    const el = scrollerRef.current
    if (!el) return
    const step = getStep()
    el.scrollTo({ left: index * step, behavior: 'smooth' })
  }

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    const onScroll = () => {
      const step = getStep()
      if (step <= 0) return
      const i = Math.round(el.scrollLeft / step)
      setActiveIndex(Math.min(Math.max(0, i), projects.length - 1))
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => el.removeEventListener('scroll', onScroll)
  }, [getStep, projects.length])

  useEffect(() => {
    const onResize = () => {
      const el = scrollerRef.current
      if (!el) return
      const step = getStep()
      if (step <= 0) return
      const i = Math.round(el.scrollLeft / step)
      setActiveIndex(Math.min(Math.max(0, i), projects.length - 1))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [getStep, projects.length])

  return (
    <section className="bg-[#fdfbf6] py-12 sm:py-16 lg:py-20">
      <div className={containerClassName}>
        <div className="mb-10 flex items-center gap-4 sm:mb-12 lg:mb-14">
          <span className="h-px min-w-[2rem] flex-1 bg-[#E62614] sm:min-w-[3rem]" aria-hidden />
          <h2 className="shrink-0 text-center text-2xl font-bold text-[#232326] sm:text-3xl lg:text-4xl">
            Реализованные объекты
          </h2>
          <span className="h-px min-w-[2rem] flex-1 bg-[#E62614] sm:min-w-[3rem]" aria-hidden />
        </div>

        <div className="flex items-stretch gap-2 sm:gap-3 md:gap-4">
          <button
            type="button"
            aria-label="Предыдущий слайд"
            onClick={() => scrollByDir(-1)}
            className="flex h-auto shrink-0 items-center justify-center px-1 text-[#232326] transition-colors hover:text-[#E62614] sm:px-2"
          >
            <ChevronLeft className="h-8 w-8 sm:h-10 sm:w-10" />
          </button>

          <div
            ref={scrollerRef}
            className="flex min-w-0 flex-1 snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {projects.map((project) => (
              <article
                key={project.id}
                data-project-card
                className="group relative min-w-0 shrink-0 snap-start overflow-hidden flex-[0_0_100%] md:flex-[0_0_calc((100%-1.5rem)/2)]"
              >
                <div className="h-full overflow-hidden rounded-lg border border-[#232326]/10 bg-[#e8e6e1] shadow-md transition-shadow duration-300 group-hover:shadow-lg">
                  <div className="relative aspect-[16/10] w-full max-w-full overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 85vw, 45vw"
                    />
                    <div
                      className="absolute inset-0 bg-[#232326]/0 transition-colors duration-300 group-hover:bg-[#E62614]/75"
                      aria-hidden
                    />
                    <p className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden px-4 text-center text-base font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:text-lg">
                      <span className="line-clamp-4 break-words">{project.title}</span>
                    </p>
                  </div>
                  <div className="min-w-0 border-t border-white/10 bg-[#3d3d40] px-4 py-4 text-left sm:px-5 sm:py-5">
                    <h3 className="break-words text-base font-bold text-white sm:text-lg">{project.title}</h3>
                    <p className="mt-2 break-words text-sm leading-relaxed text-white/85 sm:text-base">
                      {project.subtitle}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <button
            type="button"
            aria-label="Следующий слайд"
            onClick={() => scrollByDir(1)}
            className="flex h-auto shrink-0 items-center justify-center px-1 text-[#232326] transition-colors hover:text-[#E62614] sm:px-2"
          >
            <ChevronRight className="h-8 w-8 sm:h-10 sm:w-10" />
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2 sm:mt-10">
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              aria-label={`Слайд ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : undefined}
              onClick={() => scrollToIndex(index)}
              className={`h-2.5 w-2.5 rounded-full transition-colors sm:h-3 sm:w-3 ${
                index === activeIndex ? 'bg-[#232326]' : 'bg-[#232326]/25 hover:bg-[#232326]/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
    </svg>
  )
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
    </svg>
  )
}
