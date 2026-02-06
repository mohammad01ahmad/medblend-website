import React from 'react'

export default function page() {
    return (
        <div className='flex flex-col items-center justify-center h-screen bg-[#000000]'>
            <script async src="https://subscribe-forms.beehiiv.com/embed.js"></script>
            <iframe src="https://subscribe-forms.beehiiv.com/cad1e23e-5b57-414b-8931-311f15151b30"
                className="beehiiv-embed"
                data-test-id="beehiiv-embed"
                frameBorder="0"
                scrolling="no"
                style={{ width: "560px", height: "495px", margin: "0", borderRadius: "10px 10px 10px 10px !important", backgroundColor: "transparent", boxShadow: "0 0 #0000", maxWidth: "100%" }}>
            </iframe>
        </div>
    )
}
