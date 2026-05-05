import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react"
import { SocialIcon } from "@/components/ui/social-icon"

const ORG = [
  { href: "/about", label: "About" },
  { href: "/about/vision", label: "Vision" },
  { href: "/about/team", label: "Team" },
  { href: "/partners", label: "Partners" },
  { href: "/contact", label: "Contact" },
]

const INVOLVE = [
  { href: "/contribute", label: "Contribute" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/volunteer#yert", label: "YERT Programme" },
  { href: "/volunteer/fellowship", label: "Fellowship" },
]

export function Footer() {
  return (
    <footer>
      {/* Editorial main */}
      <section className="bg-[var(--color-charcoal)] text-white">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-12 md:gap-12 md:px-8 md:py-24">
          {/* Manifesto */}
          <div className="md:col-span-5">
            <Link href="/" aria-label="HeartSpace — home" className="inline-flex items-center">
              <Image
                src="/images/logo.png"
                alt="HeartSpace"
                width={594}
                height={157}
                className="h-10 w-auto"
              />
            </Link>

            <blockquote className="mt-9 max-w-md font-display text-[1.5rem] font-bold leading-[1.25] tracking-[-0.018em] text-white sm:text-[1.7rem]">
              <span className="text-[var(--color-coral)]">&ldquo;</span>
              No parent should pray for medicine that already exists.
              <span className="text-[var(--color-coral)]">&rdquo;</span>
            </blockquote>
            <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-white/65">
              HeartSpace turns generosity into clinics, mobile units, and
              immediate response across Asia and beyond. Built by youth.
              Governed to international standards.
            </p>

            <div className="mt-9 flex items-center gap-3">
              {(["instagram", "tiktok", "youtube", "linkedin"] as const).map((kind) => (
                <a
                  key={kind}
                  href="#"
                  aria-label={kind}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/80 transition hover:border-[var(--color-teal)] hover:text-[var(--color-teal-light)]"
                >
                  <SocialIcon kind={kind} size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links + newsletter + office */}
          <div className="grid gap-10 md:col-span-7 md:grid-cols-4 md:gap-8">
            <FooterColumn heading="Organisation" links={ORG} />
            <FooterColumn heading="Get Involved" links={INVOLVE} />

            <div className="md:col-span-2">
              <h4 className="text-label font-display font-bold uppercase tracking-[0.16em] text-white/70">
                Stay updated
              </h4>
              <p className="mt-4 text-[0.85rem] leading-relaxed text-white/65">
                Stories from the field, monthly. No fundraising emails — only the
                ones we&apos;d want to read ourselves.
              </p>
              <form className="mt-5 flex w-full items-stretch overflow-hidden rounded-full border border-white/15 bg-white/[0.06] focus-within:border-[var(--color-teal)]">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="min-w-0 flex-1 bg-transparent px-5 py-3 text-[0.92rem] text-white placeholder:text-white/40 focus:outline-none"
                />
                <button
                  type="submit"
                  className="group/sub inline-flex shrink-0 items-center gap-1 whitespace-nowrap bg-[var(--color-teal)] px-5 text-[0.85rem] font-semibold text-white transition-colors hover:bg-[var(--color-teal-dark)]"
                >
                  Subscribe
                  <ArrowRight size={14} className="transition-transform group-hover/sub:translate-x-0.5" />
                </button>
              </form>

              {/* HQ card */}
              <div className="mt-10 rounded-[var(--radius-card)] border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                <p className="text-label font-display font-bold uppercase tracking-[0.16em] text-[var(--color-teal-light)]">
                  HQ · Kuala Lumpur
                </p>
                <ul className="mt-5 space-y-3 text-[0.86rem] leading-relaxed text-white/75">
                  <li className="flex items-start gap-2.5">
                    <MapPin size={14} strokeWidth={1.8} className="mt-0.5 shrink-0 text-white/45" />
                    <span>
                      Lot 1A, Plaza Hamodal,
                      <br />
                      Jalan Tun Razak, 50400 KL, Malaysia
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Phone size={14} strokeWidth={1.8} className="shrink-0 text-white/45" />
                    <a href="tel:+60312345678" className="transition hover:text-[var(--color-teal-light)]">
                      +60 3-1234 5678
                    </a>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Mail size={14} strokeWidth={1.8} className="shrink-0 text-white/45" />
                    <a href="mailto:hello@heartspace.my" className="transition hover:text-[var(--color-teal-light)]">
                      hello@heartspace.my
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 px-6 py-6 text-[0.78rem] text-white/45 md:flex-row md:items-center md:justify-between md:px-8">
            <p>© 2026 MyHeart / HeartSpace · Registered NGO Malaysia</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="transition hover:text-white/80">
                Privacy
              </Link>
              <Link href="/terms" className="transition hover:text-white/80">
                Terms
              </Link>
              <Link href="/contact" className="transition hover:text-white/80">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </footer>
  )
}

function FooterColumn({
  heading,
  links,
}: {
  heading: string
  links: { href: string; label: string }[]
}) {
  return (
    <div>
      <h4 className="text-label font-display font-bold uppercase tracking-[0.16em] text-white/70">
        {heading}
      </h4>
      <ul className="mt-5 space-y-3 text-[0.92rem]">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              className="text-white/72 transition hover:text-[var(--color-teal-light)]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
