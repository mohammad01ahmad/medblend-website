import { RxDotFilled } from 'react-icons/rx';

const words = [
  'Verified Mentors',
  'Honest Answers',
  'Real Students',
  'Specialty Insights',
  'Pre-Med Community',
  'Medical Guidance',
  'Async Mentorship',
  'Trusted Voices',
];

const Tape = () => {
  return (
    <div className="overflow-x-clip border-y border-white/5 bg-black">
      <div className="flex">
        <div
          className="flex flex-none items-center gap-5 py-5 pr-5 animate-move-left"
          style={{ animationDuration: '22s' }}
        >
          {[...new Array(2)].fill(0).map((_, index) => (
            <div key={index} className="flex flex-none items-center gap-5">
              {words.map((word) => (
                <div key={word} className="inline-flex items-center gap-5">
                  <span className="whitespace-nowrap font-syne text-xs font-bold uppercase tracking-[0.2em] text-[var(--white-dim)] sm:text-sm">
                    {word}
                  </span>
                  <RxDotFilled className="size-4 -rotate-12 text-[var(--pulse)] sm:size-5" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tape;
