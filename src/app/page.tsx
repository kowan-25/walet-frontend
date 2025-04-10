import Button from "@/components/buttons/Button";
import Image from "next/image";
import { Alice } from "next/font/google";
import Link from "next/link";
import TestimonialCard from "@/components/landing/TestiCard";

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
      
      <h2 className="text-4xl font-bold text-center mt-[600px] mb-20 text-accent-dirty-blue">
        What People Are Saying About Walet
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-[90px] w-full">
        <TestimonialCard
          name="Muhammad Matthew 1992"
          description={'"Walet transformed the way our team handles finances. Everything is now clear, trackable, and accountable. It\'s a game-changer for our operations."'}
          imageSrc="/landing/met2.png"
        />
        <TestimonialCard
          name="Kucing Hutan"
          description={'"Awalnya skeptis, tapi ternyata Walet ngebantu banget buat ngatur dana program. Tinggal klik, upload, beres. Mantap!"'}
          imageSrc="/landing/testi/kucinghutan.jpg"
        />
        <TestimonialCard
          name="Naplep"
          description={'"Pake Walet tuh kayak punya bendahara pribadi di HP. Tinggal input, upload bukti, langsung bisa diajuin. Cuma sayangnya gak bisa diajak curhat."'}
          imageSrc="/landing/testi/naplep.png"
        />
        <TestimonialCard
          name="Yoshinoya"
          description={'"As a coordinator, I appreciate how Walet ensures transparency and speed in financial reporting. Highly recommended for any organization."'}
          imageSrc="/landing/testi/nopalyoshi.png"
        />
        <TestimonialCard
          name="Pokpol"
          description={'"Walet bikin urusan keuangan organisasi jadi gak ribet. UI-nya clean, UX-nya enak, dan proses approval-nya cepet. Cocok buat tim kampus!"'}
          imageSrc="/landing/testi/pokpol.jpg"
        />
        <TestimonialCard
          name="Silly"
          description={'"Gue dulu suka lupa udah laporin dana atau belum. Sekarang? Walet ngingetin terus, kayak mantan tapi versi berguna."'}
          imageSrc="/landing/testi/silly.png"
        />
      </div>
      
      <footer className="mt-[200px] mb-4 text-sm text-muted text-center">
        <p className="text-gray-500">&copy; 2025 Walet. All rights reserved.</p>
      </footer>
    </main>
  );
}
