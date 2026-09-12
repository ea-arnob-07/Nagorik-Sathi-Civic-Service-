import React from 'react';
import { MediaAttachment } from '../../types';

export const MediaPreview: React.FC<{ media: MediaAttachment; className?: string; alt?: string }> = ({ media, className = 'h-full w-full object-cover', alt = 'Evidence' }) => {
  if (media.type === 'video') return <video src={media.url} controls className={className} />;
  if (media.type === 'audio') return <audio src={media.url} controls className="w-full" />;
  return <img src={media.url} alt={alt} className={className} loading="lazy" decoding="async" />;
};
