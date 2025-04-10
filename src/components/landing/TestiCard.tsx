import Image from "next/image";

interface TestimonialCardProps {
  name: string;
  description: string;
  imageSrc: string;
}

export default function TestimonialCard({
    name,
    description,
    imageSrc,
  }: TestimonialCardProps) {
    return (
      <div className="flex-shrink-0 min-w-[400px] flex items-center gap-8 bg-white shadow-md rounded-xl p-6 mr-6">
        <div className="min-w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-accent-dirty-blue shadow-lg relative">
        <Image
            src={imageSrc}
            alt={name}
            fill
            className="object-cover"
        />
        </div>
  
        <div>
          <h3 className="text-xl font-semibold mb-2 text-accent-dirty-blue">{name}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    );
  }
  
