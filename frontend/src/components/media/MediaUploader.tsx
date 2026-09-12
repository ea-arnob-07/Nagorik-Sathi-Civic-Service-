import React, { useRef, useState } from 'react';
import { MediaAttachment, UserRole, GeoLocation } from '../../types';
import { Camera, Video, X, UploadCloud, MapPin, Navigation, ExternalLink, AlertCircle, CheckCircle2, FileCheck2, ShieldCheck } from 'lucide-react';

interface MediaUploaderProps {
  attachments: MediaAttachment[];
  onAttachmentsChange: (items: MediaAttachment[]) => void;
  uploaderRole: UserRole;
  maxFiles?: number;
  currentLocation?: GeoLocation;
  onLocationDetected?: (loc: Partial<GeoLocation>) => void;
  onOpenMapPicker?: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

function toDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('ছবির preview তৈরি করা যায়নি।'));
    reader.readAsDataURL(blob);
  });
}

async function compressImage(file: File): Promise<File> {
  const imageUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = imageUrl;
    await image.decode();

    let scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
    let quality = 0.78;
    let blob: Blob | null = null;

    for (let attempt = 0; attempt < 7; attempt += 1) {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('ছবি optimize করা যায়নি।');
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
      if (blob && blob.size <= 550 * 1024) break;
      if (quality > 0.52) quality -= 0.08;
      else scale *= 0.82;
    }

    if (!blob) throw new Error('ছবি optimize করা যায়নি।');
    return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.jpg`, { type: 'image/jpeg' });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

function captureDeviceLocation(): Promise<{ lat: number; lng: number; accuracy: number; address: string } | null> {
  return new Promise(resolve => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        const accuracy = Math.round(position.coords.accuracy || 0);
        resolve({ lat, lng, accuracy, address: `GPS: ${lat}, ${lng}` });
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  });
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  attachments,
  onAttachmentsChange,
  uploaderRole,
  maxFiles = 4,
  onLocationDetected,
  onOpenMapPicker
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isCapturingGps, setIsCapturingGps] = useState(false);
  const [lastDetectedGps, setLastDetectedGps] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [uploadError, setUploadError] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (type: 'photo' | 'video', file?: File) => {
    if (!file) return;
    if (attachments.length >= maxFiles) {
      setUploadError(`সর্বোচ্চ ${maxFiles}টি ফাইল যুক্ত করা যাবে।`);
      return;
    }

    const maxBytes = type === 'photo' ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxBytes) {
      setUploadError(type === 'photo' ? 'ছবির আকার ১০ MB-এর মধ্যে হতে হবে।' : 'ভিডিওর আকার ৫০ MB-এর মধ্যে হতে হবে।');
      return;
    }

    setUploadError('');
    setIsUploading(true);
    let detectedGps: { lat: number; lng: number; accuracy: number; address: string } | null = null;

    try {
      if (type === 'photo') {
        setIsCapturingGps(true);
        detectedGps = await captureDeviceLocation();
        setIsCapturingGps(false);
        if (detectedGps) {
          setLastDetectedGps(detectedGps);
          onLocationDetected?.({ lat: detectedGps.lat, lng: detectedGps.lng, address: detectedGps.address });
        }
      }

      const processedFile = type === 'photo' ? await compressImage(file) : file;
      const formData = new FormData();
      formData.append('file', processedFile);

      let mediaUrl = '';
      let uploadedSize = processedFile.size;
      let isLocal = false;

      try {
        const response = await fetch(`${API_BASE_URL}/media/upload`, { method: 'POST', body: formData });
        if (response.ok) {
          const result = await response.json();
          mediaUrl = result.url;
          uploadedSize = result.file_size_bytes;
        } else if (![404, 502, 503].includes(response.status)) {
          const error = await response.json().catch(() => null);
          throw new Error(error?.detail || 'ফাইল আপলোড করা যায়নি।');
        }
      } catch (error) {
        if (error instanceof Error && error.message !== 'Failed to fetch' && !error.message.includes('NetworkError')) throw error;
      }

      if (!mediaUrl && type === 'photo') {
        mediaUrl = await toDataUrl(processedFile);
        isLocal = true;
      }
      if (!mediaUrl) throw new Error('ভিডিও আপলোড করতে backend media service চালু থাকতে হবে।');

      const geo = detectedGps
        ? { lat: detectedGps.lat, lng: detectedGps.lng, accuracy: detectedGps.accuracy, timestamp: new Date().toISOString(), address: detectedGps.address }
        : undefined;
      const attachment: MediaAttachment = {
        id: `ev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        type,
        url: mediaUrl,
        caption: file.name,
        uploadedAt: new Date().toISOString(),
        uploaderRole,
        isPrivacyMasked: false,
        fileSizeBytes: uploadedSize,
        originalName: file.name,
        mimeType: processedFile.type,
        isLocalOnly: isLocal,
        geoLocation: geo
      };

      onAttachmentsChange([...attachments, attachment]);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'ফাইল যুক্ত করা যায়নি।');
    } finally {
      setIsCapturingGps(false);
      setIsUploading(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const handleRemove = (id: string) => onAttachmentsChange(attachments.filter(item => item.id !== id));

  return (
    <div className="space-y-3.5">
      <input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" className="hidden" onChange={event => handleFileSelect('photo', event.target.files?.[0])} />
      <input ref={videoInputRef} type="file" accept="video/mp4,video/webm" capture="environment" className="hidden" onChange={event => handleFileSelect('video', event.target.files?.[0])} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button type="button" onClick={() => photoInputRef.current?.click()} disabled={isUploading || attachments.length >= maxFiles} className="group flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--paper)] p-5 text-center transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] disabled:opacity-50">
          <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]"><Camera className="h-5 w-5" /></span>
          <span className="text-sm font-bold text-[var(--ink)]">ছবি তুলুন / আপলোড করুন</span>
          <span className="mt-1 text-[11px] text-[var(--muted)]">JPG, PNG, WebP · সর্বোচ্চ ১০ MB</span>
          <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--accent)]"><Navigation className="h-3 w-3" /> অনুমতি দিলে GPS যুক্ত হবে</span>
        </button>

        <button type="button" onClick={() => videoInputRef.current?.click()} disabled={isUploading || attachments.length >= maxFiles} className="group flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--paper)] p-5 text-center transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] disabled:opacity-50">
          <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]"><Video className="h-5 w-5" /></span>
          <span className="text-sm font-bold text-[var(--ink)]">ভিডিও প্রমাণ যুক্ত করুন</span>
          <span className="mt-1 text-[11px] text-[var(--muted)]">MP4, WebM · সর্বোচ্চ ৫০ MB</span>
          <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--muted)]"><MapPin className="h-3 w-3" /> GPS না থাকলে মানচিত্রে পিন দিন</span>
        </button>
      </div>

      {isUploading && (
        <div className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--paper)] p-3 text-xs text-[var(--ink)]">
          <UploadCloud className="h-4 w-4 animate-bounce text-[var(--accent)]" />
          <span>{isCapturingGps ? 'ডিভাইসের GPS সংগ্রহ করা হচ্ছে…' : 'ফাইল প্রস্তুত ও আপলোড করা হচ্ছে…'}</span>
        </div>
      )}

      {uploadError && <p className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{uploadError}</p>}

      {lastDetectedGps && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
          <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" />GPS: {lastDetectedGps.lat}, {lastDetectedGps.lng} · ±{lastDetectedGps.accuracy}m</span>
          <a href={`https://www.google.com/maps?q=${lastDetectedGps.lat},${lastDetectedGps.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold"><span>মানচিত্রে দেখুন</span><ExternalLink className="h-3 w-3" /></a>
        </div>
      )}

      {attachments.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-[var(--ink)]">সংযুক্ত প্রমাণ ({attachments.length}/{maxFiles})</span>
            {onOpenMapPicker && <button type="button" onClick={onOpenMapPicker} className="inline-flex items-center gap-1 font-semibold text-[var(--accent)]"><MapPin className="h-3.5 w-3.5" />মানচিত্রে অবস্থান ঠিক করুন</button>}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {attachments.map(item => (
              <article key={item.id} className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--paper)] shadow-xs">
                <div className="aspect-video bg-[var(--bg)]">
                  {item.type === 'video' ? <video src={item.url} controls className="h-full w-full object-cover" /> : <img src={item.url} alt={item.caption || 'Uploaded evidence'} className="h-full w-full object-cover" loading="lazy" decoding="async" />}
                </div>
                <div className="space-y-2 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--accent-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--accent)]"><FileCheck2 className="h-3 w-3" />ফাইল সংযুক্ত</span>
                    <button type="button" onClick={() => handleRemove(item.id)} aria-label="ফাইল মুছুন" className="rounded-lg border border-[var(--line)] p-1.5 text-[var(--muted)] transition hover:border-rose-300 hover:text-rose-600"><X className="h-3.5 w-3.5" /></button>
                  </div>
                  <p className="truncate text-xs font-semibold text-[var(--ink)]">{item.caption}</p>
                  <p className="text-[10px] text-[var(--muted)]">{Math.max(1, Math.round((item.fileSizeBytes || 0) / 1024))} KB{item.isLocalOnly ? ' · এই ব্রাউজারে সংরক্ষিত' : ''}</p>
                  {item.geoLocation ? <p className="flex items-center gap-1 border-t border-[var(--line)] pt-2 text-[10px] text-[var(--muted)]"><Navigation className="h-3 w-3 text-[var(--accent)]" />{item.geoLocation.lat.toFixed(5)}, {item.geoLocation.lng.toFixed(5)}</p> : <p className="flex items-center gap-1 border-t border-[var(--line)] pt-2 text-[10px] text-amber-700"><AlertCircle className="h-3 w-3" />GPS নেই — মানচিত্রে পিন দিন</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      <p className="text-[10px] leading-relaxed text-[var(--muted)]">ছবি প্রমাণ হিসেবে সংরক্ষিত হবে। স্বয়ংক্রিয় মুখ বা নম্বরপ্লেট blur এই সংস্করণে সক্রিয় নয়; প্রকাশের আগে সংবেদনশীল তথ্য থাকলে তা নিজে ঢেকে দিন।</p>
    </div>
  );
};

export const PrivacyBadge: React.FC = () => (
  <span className="inline-flex items-center gap-1 rounded-md border border-[var(--line)] bg-[var(--paper-elevated)] px-2 py-0.5 text-[11px] font-medium text-[var(--muted)]">
    <ShieldCheck className="h-3 w-3" />প্রমাণ সংযুক্ত
  </span>
);
