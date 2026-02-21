import React from 'react'
import { BorderBeam } from '@/components/ui/border-beam'

function page() {
    return (
        <div className='flex flex-col items-center justify-center h-screen'>
            {/* Single box in the middle of the screen with border beam */}
            <div className='relative p-10 bg-black rounded-lg'>
                <h1 className='text-4xl font-bold mb-2'>Contact Us</h1>
                <p className='text-xl text-hsl(0,0%,30%)'>Get in touch with us</p>
                <p className='text-lg text-gray-500 mt-6'>Email: medblend@gmail.com</p>
                <p className='text-lg text-gray-500 mt-2 hover:text-[hsl(245,72%,59%)] transition-colors'><a href="https://www.instagram.com/medblendapp/">Instagram @medblendapp</a></p>

                <BorderBeam
                    duration={6}
                    size={100}
                    colorFrom='hsl(0,0%,90%)'
                    colorTo='hsl(245,72%,59%)'
                />
            </div>
        </div >
    )
}

export default page