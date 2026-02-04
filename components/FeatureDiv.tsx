import { IconType } from "react-icons";

interface FeatureDivProps {
    icon: IconType;
    heading: string;
    description: string;
}

export default function FeatureDiv({ icon: Icon, heading, description }: FeatureDivProps) {
    return (
        <div className="flex flex-col gap-6 p-8 border border-black rounded-2xl hover:shadow-lg transition-shadow duration-300">
            <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center">
                <Icon className="w-10 h-10 text-gray-700" />
            </div>

            <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-semibold text-white">
                    {heading}
                </h3>
                <p className="text-lg text-gray-400 leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
}