import React from 'react'
import Link from 'next/link'
import { ShimmerButton } from "@/components/ui/shimmer-button"

const Header = () => {
    return (
        <header className="fixed bg-black top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/#">
                    <div className="text-2xl font-bold text-white cursor-pointer">Medblend</div>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <a href="/#" className="text-white hover:text-purple-600 transition-colors">About</a>
                    <a href="/#" className="text-white hover:text-purple-600 transition-colors">Features</a>
                    <a href="/#" className="text-white hover:text-purple-600 transition-colors">Register</a>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/#">
                        <ShimmerButton>
                            Join Our Newsletter
                        </ShimmerButton>
                    </Link>
                </div>

            </div>
        </header>
    )
}

export default Header 