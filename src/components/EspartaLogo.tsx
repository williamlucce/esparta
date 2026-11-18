import espartaLogoImg from '../assets/images/esparta_logo.jpg';

export function EspartaLogo({
  light = false,
  size = 'md',
  className = '',
}: {
  light?: boolean;
  size?: 'md' | 'lg';
  className?: string;
}) {
  const boxSize = size === 'lg' ? 'w-14 h-14 rounded-lg' : 'w-11 h-11 rounded-md';

  return (
    <span
      className={`inline-flex items-center gap-3 whitespace-nowrap shrink-0 ${className}`}
    >
      <span
        className={`${boxSize} overflow-hidden bg-black border border-white/15 inline-flex items-center justify-center shrink-0`}
      >
        <img
          src={espartaLogoImg}
          alt="Logotipo Esparta Imob"
          className="w-full h-full object-cover scale-[1.22]"
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display ${
            size === 'lg' ? 'text-xl' : 'text-lg sm:text-xl'
          } font-bold tracking-[0.14em] uppercase ${
            light ? 'text-[#FFFFFF]' : 'text-[#111111]'
          }`}
        >
          ESPARTA
        </span>
        <span className="text-[10px] font-semibold tracking-[0.28em] text-[#F47721] uppercase mt-0.5">
          IMOB
        </span>
      </span>
    </span>
  );
}
