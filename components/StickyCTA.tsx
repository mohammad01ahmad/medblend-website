import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function StickyCTA() {
    const [isOn, setIsOn] = useState(false);

    useEffect(() => {
        // Track the visibility of both sections
        let heroVisible = false;
        let footerVisible = false;

        const updateVisibility = () => {
            // Show the CTA only if BOTH the Hero and Footer are completely out of view
            setIsOn(!heroVisible && !footerVisible);
        };

        const callback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.target.id === 'landing-hero') {
                    heroVisible = entry.isIntersecting;
                }
                if (entry.target.id === 'site-footer') {
                    footerVisible = entry.isIntersecting;
                }
            });
            updateVisibility();
        };

        const observer = new IntersectionObserver(callback, {
            root: null, // Uses the browser viewport
            threshold: 0, // Triggers when even a single pixel is visible
        });

        // Target the elements by their IDs
        const heroElement = document.getElementById('landing-hero');
        const footerElement = document.getElementById('site-footer');

        if (heroElement) observer.observe(heroElement);
        if (footerElement) observer.observe(footerElement);

        // Cleanup function terminates the observer cleanly
        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className={`fixed bottom-[1.5rem] left-1/2 z-[998] flex items-center gap-4 rounded-full bg-[var(--void)] p-[0.8rem_1rem_0.8rem_1.5rem] border-2 border-white/10 transition-all duration-500 ease-[var(--ease-out)] -webkit-backdrop-blur-[20px]
        ${isOn ? 'translate-x-[-50%] translate-y-0 opacity-100' : 'translate-x-[-50%] translate-y-[100px] opacity-0'}`}
        >
            <span className="text-[0.88rem] text-white/80">
                <span className="text-white font-semibold">MedBlend</span> · Waitlist open now
            </span>
            <Link
                href="/waitlist"
                className="inline-flex items-center gap-2 bg-[var(--pulse)] text-white font-medium rounded-full cursor-pointer transition-all duration-300 shadow-[0_0_40px_rgba(22,163,74,0.6)] hover:-translate-y-1 hover:bg-[var(--pulse)] hover:shadow-[0_0_40px_rgba(22,163,74,0.6)]"
                style={{ padding: '.55rem 1.25rem', fontSize: '.82rem' }}
            >
                Join →
            </Link>
        </div>
    );
}