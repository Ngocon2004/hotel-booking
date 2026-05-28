'use client'

import { useRef } from 'react'
import type { ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

type Props = {
  children: ReactNode
  className?: string
}

export default function GsapReveal({ children, className }: Props) {
  const scope = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const revealItems = gsap.utils.toArray<HTMLElement>('[data-gsap-reveal]')
      const staggerGroups = gsap.utils.toArray<HTMLElement>('[data-gsap-stagger]')

      if (reduceMotion) {
        gsap.set([...revealItems, ...staggerGroups], { clearProps: 'all', autoAlpha: 1, y: 0 })
        return
      }

      revealItems.forEach((item) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: Number(item.dataset.gsapY || 24) },
          {
            autoAlpha: 1,
            y: 0,
            duration: Number(item.dataset.gsapDuration || 0.7),
            delay: Number(item.dataset.gsapDelay || 0),
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 86%',
              once: true,
            },
          }
        )
      })

      staggerGroups.forEach((group) => {
        const items = gsap.utils.toArray<HTMLElement>('[data-gsap-item]', group)
        if (items.length === 0) return

        gsap.fromTo(
          items,
          { autoAlpha: 0, y: Number(group.dataset.gsapY || 20) },
          {
            autoAlpha: 1,
            y: 0,
            duration: Number(group.dataset.gsapDuration || 0.55),
            ease: 'power2.out',
            stagger: Number(group.dataset.gsapStagger || 0.08),
            scrollTrigger: {
              trigger: group,
              start: 'top 88%',
              once: true,
            },
          }
        )
      })
    },
    { scope }
  )

  return (
    <div ref={scope} className={className}>
      {children}
    </div>
  )
}
