import React from 'react'
import Image from 'next/image'

const Footer = () => {
    return (
        <footer className="bg-black text-white py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center text-xl font-bold text-white cursor-pointer">
                            <Image src="/MedBlend-logo.jpeg" alt="Logo" width={50} height={50} />
                            MedBlendApp
                        </div>
                        <p className="text-gray-400">Real Guidance From Students And Doctors Who’ve Already Lived It.</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#features" className="hover:text-purple-400 transition-colors">Medblend App</a></li>
                            <li><a href="#upcoming" className="hover:text-purple-400 transition-colors">Medblend Web</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#about" className="hover:text-purple-400 transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-purple-400 transition-colors">FAQ</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition-colors">Privacy</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition-colors">Terms & Conditions</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 text-left text-gray-400">
                    <p>Copyright © 2026 MedBlend. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer