import { RxDotFilled } from "react-icons/rx";

// Data to populate the tape
const words = [
    'Performant',
    'Efficient',
    'Reliable',
    'Secure',
    'Scalable',
    'Maintainable',
    'Testable',
    'Modular',
    'Documented',
    'Collaborative',
];

const Tape = () => {
    return (
        <div className="overflow-x-clip">
            <div className="bg-black-900">
                <div className="flex">
                    <div
                        className="flex flex-none gap-4 py-6 pr-4 animate-move-left"
                        style={{ animationDuration: '15s' }}
                    >
                        {[...new Array(2)].fill(0).map((_, index) => (
                            <div key={index} className="flex flex-none gap-4 items-center">
                                {words.map((word, wordIndex) => (
                                    <div key={wordIndex} className="inline-flex items-center gap-4">
                                        <span className="text-md font-extrabold uppercase text-gray-200 whitespace-nowrap">
                                            {word}
                                        </span>
                                        <RxDotFilled className="size-6 -rotate-12 text-gray-200" />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tape;
