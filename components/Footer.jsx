import React from 'react'
import Image from 'next/image'
import { IoLogoInstagram } from "react-icons/io5";
import { LuMail } from "react-icons/lu";

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
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#about" className="hover:text-purple-400 transition-colors">About</a></li>
                            <li><a href="/contact" className="hover:text-purple-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-purple-400 transition-colors">FAQ</a></li>
                            <li><a href="/privacy-policy" className="hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-purple-400 transition-colors">Terms & Conditions</a></li>
                        </ul>
                    </div>
                </div>
                {/* Make it mobile responsive */}
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 md:gap-0 border-t border-gray-800 pt-8 text-gray-400 text-sm sm:text-base">
                    <p className="text-left">
                        Copyright © 2026 MedBlend. All rights reserved.
                    </p>

                    <div className='flex flex-col sm:flex-row gap-4'>
                        <div className="flex items-center space-x-2">
                            <a href="https://www.instagram.com/medblendapp/" className="hover:text-purple-400 transition-colors text-2xl">
                                <IoLogoInstagram />
                            </a>
                            <a href="https://www.instagram.com/medblendapp/" className='hover:text-purple-400 transition-colors'>
                                Instagram
                            </a>
                        </div>

                        <div className="flex items-center space-x-2">
                            <a href="mailto:medblendapp@gmail.com" className="hover:text-purple-400 transition-colors text-2xl">
                                <LuMail />
                            </a>
                            <a href="mailto:medblendapp@gmail.com" className='hover:text-purple-400 transition-colors'>
                                medblendapp@gmail.com
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer



