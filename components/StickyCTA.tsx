import React, { useState, useEffect } from 'react';

export default function StickyCTA() {
    const [isOn, setIsOn] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 600) {
                setIsOn(true);
            } else {
                setIsOn(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div
            id="scta"
            className={`fixed bottom-[1.5rem] left-1/2 z-[998] flex items-center gap-4 whitespace-nowrap rounded-[var(--r-full)] border border-[var(--border)] bg-[rgba(10,10,15,0.9)] p-[0.8rem_1rem_0.8rem_1.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-[20px] transition-all duration-500 ease-[var(--ease-out)] -webkit-backdrop-blur-[20px]
        ${isOn ? 'translate-x-[-50%] translate-y-0 opacity-100' : 'translate-x-[-50%] translate-y-[100px] opacity-0'}`}
        >
            <span className="text-[0.88rem] text-[var(--white-dim)]">
                <strong className="text-white font-bold">MedBlend</strong> · Waitlist open now
            </span>
            <a
                href="#waitlist"
                className="btn-primary"
                style={{ padding: '.55rem 1.25rem', fontSize: '.82rem' }}
            >
                Join →
            </a>
        </div>
    );
}