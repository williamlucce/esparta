import { ExternalLink, MapPin } from 'lucide-react';

interface LocationMapProps {
  title: string;
  address: string;
  latitude?: string;
  longitude?: string;
}

export function LocationMap({
  title,
  address,
  latitude = '-23.5649',
  longitude = '-46.6689',
}: LocationMapProps) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${address} (${latitude}, ${longitude})`
  )}`;

  return (
    <div className="rounded-lg border border-zinc-200 overflow-hidden bg-[#141416] text-white">
      <div className="relative h-64 sm:h-72 w-full overflow-hidden">
        {/* Architectural vector street grid */}
        <svg
          viewBox="0 0 800 320"
          className="w-full h-full object-cover opacity-80"
          aria-hidden="true"
        >
          <rect width="800" height="320" fill="#141416" />
          <g stroke="#27272A" strokeWidth="1.5">
            <line x1="0" y1="60" x2="800" y2="95" />
            <line x1="0" y1="145" x2="800" y2="120" />
            <line x1="0" y1="225" x2="800" y2="250" />
            <line x1="120" y1="0" x2="90" y2="320" />
            <line x1="270" y1="0" x2="310" y2="320" />
            <line x1="460" y1="0" x2="430" y2="320" />
            <line x1="640" y1="0" x2="680" y2="320" />
          </g>
          <g stroke="#3F3F46" strokeWidth="3">
            <line x1="0" y1="185" x2="800" y2="155" />
            <line x1="395" y1="0" x2="415" y2="320" />
          </g>
          <rect
            x="295"
            y="85"
            width="105"
            height="68"
            fill="#1C2621"
            stroke="#2D3D35"
            strokeWidth="1"
          />
          <circle
            cx="406"
            cy="170"
            r="48"
            fill="#F47721"
            fillOpacity="0.12"
            stroke="#F47721"
            strokeOpacity="0.45"
            strokeWidth="1.5"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <div className="w-11 h-11 rounded-full bg-[#F47721] text-white flex items-center justify-center shadow-lg mb-2">
            <MapPin className="w-5 h-5" />
          </div>
          <p className="font-display text-sm font-semibold text-white bg-[#111111]/90 px-3 py-1 rounded-md border border-white/15">
            {title}
          </p>
        </div>
      </div>

      <div className="px-5 py-4 bg-[#111111] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-white">{address}</p>
          <p className="text-xs text-zinc-400 tabular-nums mt-0.5">
            Coordenadas aproximadas: {latitude}, {longitude}
          </p>
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F47721] hover:underline whitespace-nowrap shrink-0"
        >
          Ver rota no mapa
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
