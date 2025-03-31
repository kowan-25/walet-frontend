import Button from "@/components/buttons/Button";
import Image from "next/image";
import { Alice } from "next/font/google";
import Link from "next/link";

const alice = Alice({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center bg-background text-foreground px-4 mt-[200px] mx-[50px]">
      <div className="flex w-full px-[90px]">
        <div className="z-40">
          <div className="text-[50px] font-medium"
            style={{
              textShadow: "1px 6px 6px rgba(110, 185, 220, 0.5)",
            }}
          >
            Empower Your Team&apos;s Financial Transparency with <span className={`${alice.className} text-[70px] text-[#18555E]`}>Walet</span>
          </div>
          <div className="mb-[10px] mt-[30px]">
            Join over million people who choose Walet as their go-to financial companion
          </div>
          <Link href={`/register`}>
            <Button className="bg-accent-dirty-blue text-white w-[200px]">Join Now</Button>
          </Link>
        </div>
        <div className="w-[800px]">
        </div>
        <div className="absolute z-0 right-0 top-0">
          <Image src={"/landing/bgslash.svg"} alt={""} width={800} height={300} className="top-0" />
        </div>
        <div className="absolute right-0 ">
          <Image src={"/landing/wave.svg"} alt={""} width={900} height={500} />
        </div>
      </div>
      
      <div className="mt-[500px] flex items-center gap-12 px-[90px]">
        <div className="w-[200px] h-[200px] rounded-full overflow-hidden border-4 border-accent-dirty-blue shadow-lg">
          <Image
            src="/landing/met2.png"
            alt="Person"
            width={200}
            height={200}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="max-w-xl">
          <h3 className="text-3xl font-semibold mb-2 text-accent-dirty-blue">Muhammad Matthew 1992</h3>
          <p className="text-gray-600 text-lg leading-relaxed">
            UI Computer Science student and infrastructure architect of Walet. Passionate about tech innovation and financial systems.
          </p>
        </div>
      </div>

      <footer className="mt-[500px] text-sm text-muted text-center">
        <p className="text-gray-500">&copy; 2025 Walet. All rights reserved.</p>
      </footer>
    </main>
  );
}
