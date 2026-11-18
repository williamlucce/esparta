import { Building2 } from 'lucide-react';
import { useState } from 'react';
import { resolveAssetUrl } from '../lib/assetImages';

interface PropertyImageProps {
  src?: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function PropertyImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
}: PropertyImageProps) {
  const [failed, setFailed] = useState(false);
  const resolved = resolveAssetUrl(src);

  if (failed || !resolved) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#18181B] via-[#27272A] to-[#111111] text-white/70 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Building2 className="w-8 h-8 text-[#F47721] mb-2" />
        <span className="text-xs font-medium text-white/80 line-clamp-2 max-w-[200px]">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={resolved}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
