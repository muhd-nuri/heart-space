"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"

const WA_NUMBER = "60123456789" // placeholder — replace with real

export function WhatsAppFloat() {
  const [pulse, setPulse] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 3000)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.a
      href={`https://wa.me/${WA_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with HeartSpace on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 grid h-[52px] w-[52px] place-items-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.35)] transition hover:scale-105"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
    >
      {pulse && (
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-60" />
      )}
      <MessageCircle size={22} fill="currentColor" strokeWidth={0} />
      <span className="pointer-events-none absolute right-[60px] hidden whitespace-nowrap rounded-md bg-[var(--color-charcoal)] px-3 py-1.5 text-[0.78rem] font-medium text-white opacity-0 shadow transition-opacity group-hover:block group-hover:opacity-100 md:block">
        Chat with HeartSpace
      </span>
    </motion.a>
  )
}
