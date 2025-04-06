"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaPlus } from "react-icons/fa6";

export default function HeroSection() {
  const router = useRouter();

  const handleCreateProject = () => {
    router.push("/project/create");
  };

  return (
    <div className="flex relative justify-between pt-20 items-center bg-accent-white-rock text-black">
      <div className="bottom-0 absolute left-0">
        <Image
          src={"/hero/hero-walet.svg"}
          width={600}
          height={506.583}
          alt="Walet Logo"
          className="w-[400px] h-[284px] xl:w-[600px] xl:h-[426px]"
        />
      </div>
      <div></div>
      <div className="flex mr-36 items-end mb-24 mt-24">
        <div className="flex flex-col">
          <div className="w-full gap-5 text-right font-semibold text-6xl">
            <h1 className="whitespace-nowrap">Where Great Projects Begin:</h1>
            <h2>
              Welcome to <span className="text-accent-dirty-blue">Walet</span>
            </h2>
          </div>
          <p className="text-xl mt-10 w-1/2 self-end text-right">
            Walet adalah platform kolaboratif yang dirancang untuk memudahkan
            Anda dalam mengelola proyek dan keuangan secara efisien. Mulai
            proyek baru atau bergabung dengan proyek yang sudah ada, dan nikmati
            fitur-fitur unggulan kami.
          </p>
          <button
            onClick={handleCreateProject}
            className="flex cursor-pointer items-center text-white mt-10 self-end text-lg mr-52 px-12 py-3.5 bg-accent-dirty-blue rounded-xl font-semibold hover:bg-secondary hover:text-accent-white-rock transition shadow-[0_4px_8px_4px_rgba(22,96,136,0.4)]"
          >
            <FaPlus className="text-xl font-extralight" />
            <span className="ml-3">Buat Proyek</span>{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
