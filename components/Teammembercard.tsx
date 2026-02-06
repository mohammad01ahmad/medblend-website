import React from 'react'
import { BorderBeam } from './ui/border-beam'
import { CiLinkedin } from 'react-icons/ci'

function Teammembercard({ name, role }: { name: string, role: string }) {
    return (
        <div className="flex flex-row justify-between absolute bottom-2 left-2 right-2 bg-[hsl(0,0%,10%,0.9)] backdrop-blur-sm rounded-2xl p-4">
            <div className="flex flex-col">
                <h3 className="text-white text-lg sm:text-xl font-semibold mb-1">
                    {name}
                </h3>
                <p className="text-gray-300 text-sm">
                    {role}
                </p>
            </div>
            <div className="flex items-center justify-end">
                <CiLinkedin className="text-white text-2xl sm:text-3xl hover:text-blue-400 transition-colors" />
            </div>
            <BorderBeam
                duration={6}
                size={100}
                colorFrom='hsl(0,0%,90%)'
                colorTo='hsl(69,69%,50%)'
            />
        </div>
    )
}

export default Teammembercard