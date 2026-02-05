"use client";

import { useState } from "react";
import Link from "next/link";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";
import { ShimmerButton } from "./ui/shimmer-button";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="fixed bg-[#121212] top-0 w-full z-50">
            <div className="max-w-5xl mx-auto px-10 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/#" onClick={closeMenu}>
                    <div className="text-xl sm:text-2xl font-bold text-white cursor-pointer">
                        Medblend
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-4 lg:gap-8">
                    <a href="/#about" className="bg-transparent text-white py-2 px-3 lg:px-4 cursor-pointer rounded-lg hover:bg-white hover:text-black transition-colors">
                        About
                    </a>
                    <a href="/#features" className="bg-transparent text-white py-2 px-3 lg:px-4 cursor-pointer rounded-lg hover:bg-white hover:text-black transition-colors">
                        Features
                    </a>
                    <a href="/#register" className="bg-transparent text-white py-2 px-3 lg:px-4 cursor-pointer rounded-lg hover:bg-white hover:text-black transition-colors">
                        Register
                    </a>
                </nav>

                {/* Right side buttons */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Newsletter button - hidden on small mobile */}
                    <Link href="/#newsletter" className="hidden sm:block">
                        <ShimmerButton className="text-sm sm:text-base">
                            Join Our Newsletter
                        </ShimmerButton>
                    </Link>

                    {/* Hamburger/Close - only on mobile */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden text-white text-2xl cursor-pointer p-2"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <IoClose /> : <RxHamburgerMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={closeMenu}
            />

            {/* Mobile Menu Sidebar */}
            <nav
                className={`md:hidden fixed top-0 right-0 h-full w-64 sm:w-80 bg-[#1a1a1a] shadow-2xl transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Mobile Menu Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-700">
                        <span className="text-xl font-bold text-white">Menu</span>
                        <button
                            onClick={closeMenu}
                            className="text-white text-2xl p-2"
                            aria-label="Close menu"
                        >
                            <IoClose />
                        </button>
                    </div>

                    {/* Mobile Menu Links */}
                    <div className="flex flex-col gap-2 p-6 flex-1">

                        <a href="/#about"
                            onClick={closeMenu}
                            className="text-white py-3 px-4 rounded-lg hover:bg-white/10 transition-colors text-lg"
                        >
                            About
                        </a>

                        <a href="/#features"
                            onClick={closeMenu}
                            className="text-white py-3 px-4 rounded-lg hover:bg-white/10 transition-colors text-lg"
                        >
                            Features
                        </a>

                        <a href="/#register"
                            onClick={closeMenu}
                            className="text-white py-3 px-4 rounded-lg hover:bg-white/10 transition-colors text-lg"
                        >
                            Register
                        </a>
                    </div>

                    {/* Mobile Newsletter Button - at bottom */}
                    <div className="p-6 border-t border-gray-700">
                        <Link href="/#newsletter" onClick={closeMenu}>
                            <ShimmerButton className="w-full">
                                Join Our Newsletter
                            </ShimmerButton>
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
}