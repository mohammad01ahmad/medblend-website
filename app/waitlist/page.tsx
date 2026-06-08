import React from 'react'
import WaitlistParticles from '@/components/WaitlistParticles'

export default function page() {
    return (
        <div className='relative flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] p-4 overflow-hidden'>
            {/* Animated Ambient Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#34d399]/15 blur-[120px] animate-pulse"></div>
                <div className="absolute top-[40%] -right-[20%] w-[70%] h-[70%] rounded-full bg-[#10b981]/15 blur-[150px]" style={{ animation: 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>
                <div className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-[#f59e0b]/10 blur-[100px]" style={{ animation: 'pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite 2s' }}></div>
            </div>

            {/* Particle Effects */}
            <WaitlistParticles />

            <script async src="https://subscribe-forms.beehiiv.com/embed.js"></script>
            <div className="relative z-10 bg-black rounded-2xl overflow-hidden shadow-[0_0_80px_20px_rgba(52,211,153,0.15)] w-full max-w-[560px] ring-1 ring-white/10">
                <iframe src="https://subscribe-forms.beehiiv.com/cad1e23e-5b57-414b-8931-311f15151b30"
                    className="beehiiv-embed"
                    data-test-id="beehiiv-embed"
                    frameBorder="0"
                    scrolling="no"
                    style={{ 
                        width: "100%", 
                        height: "495px", 
                        margin: "0", 
                        backgroundColor: "transparent",
                        filter: "invert(1) hue-rotate(180deg) contrast(1.2)"
                    }}>
                </iframe>
            </div>
        </div>
    )
}
