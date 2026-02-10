'use client';

import { type LobeHubProps } from '@lobehub/ui/brand';
import { memo } from 'react';

import Image from '@/libs/next/Image';

interface ProductLogoProps extends LobeHubProps {
  height?: number;
  width?: number;
}

export const ProductLogo = memo<ProductLogoProps>(({ size = 32, ...rest }) => {
  return (
    <Image
      alt="Diggo Chat"
      height={size}
      src="/avatars/diggo-chat.png"
      unoptimized
      width={size}
      {...rest}
    />
  );
});
