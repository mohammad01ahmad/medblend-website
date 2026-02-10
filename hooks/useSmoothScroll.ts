import { useRouter, usePathname } from 'next/navigation';

export const useSmoothScroll = () => {
    const router = useRouter();
    const pathname = usePathname();

    const scrollToSection = (sectionId: string) => {
        // If not on home page, navigate home first
        if (pathname !== '/') {
            router.push(`/#${sectionId}`);
            return;
        }

        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 80; // Adjust this to match your navbar height
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    };

    return scrollToSection;
};