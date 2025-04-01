const Header = () => {
    return (
        <div className="w-full flex flex-col items-start gap-[18px] p-[40px_36px] rounded-[20px] bg-gradient-to-r from-[#166088] to-[#2A7D8C] shadow-[0px_4px_12px_0px_rgba(168,213,226,0.80)]">
            <h1 className="self-stretch text-white text-[48px] font-semibold leading-normal">
                Manage Invitations
            </h1>
            <p className="text-white text-[18px] font-normal leading-normal max-w-[875px]">
                Kelola undangan ke proyek dengan efisien. Lihat daftar undangan, dan gabung ke proyek.
            </p>
        </div>
    )
}

export default Header;