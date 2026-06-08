import { BorderBeam } from './ui/border-beam'
import { CiLinkedin } from 'react-icons/ci'

function Teammembercard({
    name,
    role,
    linkedin,
}: {
    name: string
    role: string
    linkedin: string
}) {
    return (
        <div className="absolute inset-x-3 bottom-3 overflow-hidden rounded-2xl border border-white/10 bg-[rgba(8,14,11,0.82)] p-4 backdrop-blur-md transition-colors duration-300 group-hover:border-[var(--sage-glow)] group-hover:bg-[rgba(10,18,14,0.9)]">
            <div className="flex items-end justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="mb-1 font-syne text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--pulse)]">
                        Founding Team
                    </p>
                    <h3 className="truncate font-syne text-lg font-semibold leading-tight text-white sm:text-xl">
                        {name}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--white-dim)]">
                        {role}
                    </p>
                </div>

                <a
                    href={linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${name} on LinkedIn`}
                    className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all duration-300 hover:border-[var(--sage)] hover:bg-[var(--sage-soft)] hover:text-[var(--sage)] hover:shadow-[0_0_20px_var(--pulse-glow)]"
                >
                    <CiLinkedin className="text-xl sm:text-2xl" />
                </a>
            </div>

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--pulse)] to-transparent opacity-60" />

            <BorderBeam
                duration={8}
                size={120}
                colorFrom="var(--sage)"
                colorTo="var(--pulse)"
                borderWidth={1}
            />
        </div>
    )
}

export default Teammembercard
