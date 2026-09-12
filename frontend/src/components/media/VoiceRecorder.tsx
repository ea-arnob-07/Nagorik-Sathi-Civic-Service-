import React, { useEffect, useRef, useState } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, Check, AlertCircle, UploadCloud } from 'lucide-react';
import { toBanglaNumber } from '../../utils/formatters';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlobOrUrl: string) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete }) => {
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'paused' | 'recorded'>('idle');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [error, setError] = useState('');
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (recordingState === 'recording') {
      timerRef.current = window.setInterval(() => setSecondsElapsed(value => value + 1), 1000);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [recordingState]);

  useEffect(() => {
    if (secondsElapsed >= 60 && recordingState === 'recording' && recorderRef.current?.state !== 'inactive') {
      recorderRef.current?.stop();
      streamRef.current?.getTracks().forEach(track => track.stop());
      setRecordingState('recorded');
    }
  }, [secondsElapsed, recordingState]);

  const handleStart = async () => {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError('এই ব্রাউজারে অডিও রেকর্ডিং সমর্থিত নয়।');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : '';
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorderRef.current = recorder;
      recorder.ondataavailable = event => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        if (!blob.size) {
          setError('কোনো অডিও ধারণ করা যায়নি। আবার চেষ্টা করুন।');
          return;
        }
        setIsUploading(true);
        try {
          const extension = blob.type.includes('mp4') ? 'm4a' : 'webm';
          const formData = new FormData();
          formData.append('file', new File([blob], `voice-note.${extension}`, { type: blob.type }));
          const response = await fetch(`${API_BASE_URL}/media/upload`, { method: 'POST', body: formData });
          if (!response.ok) throw new Error('অডিও সার্ভারে সংরক্ষণ করা যায়নি।');
          const result = await response.json();
          setAudioUrl(result.url);
          onRecordingComplete(result.url);
          setRecordingState('recorded');
        } catch {
          if (blob.size <= 900 * 1024) {
            const reader = new FileReader();
            reader.onload = () => {
              const localUrl = String(reader.result);
              setAudioUrl(localUrl);
              onRecordingComplete(localUrl);
              setRecordingState('recorded');
            };
            reader.readAsDataURL(blob);
          } else {
            setError('অডিও সংরক্ষণ করতে backend media service চালু করুন।');
            setRecordingState('idle');
          }
        } finally {
          setIsUploading(false);
        }
      };
      recorder.start(250);
      setSecondsElapsed(0);
      setRecordingState('recording');
    } catch {
      setError('মাইক্রোফোন ব্যবহারের অনুমতি দিন, তারপর আবার চেষ্টা করুন।');
    }
  };

  const handlePause = () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.pause();
    setRecordingState('paused');
  };

  const handleResume = () => {
    if (recorderRef.current?.state === 'paused') recorderRef.current.resume();
    setRecordingState('recording');
  };

  const handleStop = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') recorderRef.current.stop();
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    setRecordingState('recorded');
  };

  const handleReset = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') recorderRef.current.stop();
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (audioUrl.startsWith('blob:')) URL.revokeObjectURL(audioUrl);
    setAudioUrl('');
    setSecondsElapsed(0);
    setIsPlaying(false);
    setError('');
    setRecordingState('idle');
  };

  const togglePlayback = async () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      await audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTimer = (totalSec: number) => `${toBanglaNumber(Math.floor(totalSec / 60))}:${toBanglaNumber(String(totalSec % 60).padStart(2, '0'))}`;

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4 text-center">
      <div className="mb-3 flex items-center justify-between gap-2 text-xs text-[var(--muted)]">
        <span className="flex items-center gap-1.5 font-semibold text-[var(--ink)]"><Mic className="h-4 w-4 text-[var(--accent)]" />ভয়েস নোট রেকর্ডার</span>
        <span className="rounded-full border border-[var(--line)] bg-[var(--paper-elevated)] px-2.5 py-1 text-[10px] font-medium">সর্বোচ্চ ৬০ সেকেন্ড</span>
      </div>

      <div className="my-4 flex flex-col items-center justify-center">
        <div className="mb-2 font-mono text-2xl font-bold tracking-wider text-[var(--ink)]">{formatTimer(secondsElapsed)}</div>
        {recordingState === 'recording' && <div className="my-2 flex h-8 items-center justify-center gap-1">{[40, 70, 90, 30, 85, 60, 100, 45, 80, 50, 95, 35].map((height, index) => <span key={index} className="w-1 animate-pulse rounded-full bg-[var(--accent)]" style={{ height: `${height}%`, animationDelay: `${index * .1}s` }} />)}</div>}
        {recordingState === 'idle' && <p className="max-w-xs text-xs text-[var(--muted)]">মাইক্রোফোনে চাপ দিয়ে সমস্যার বিবরণ বলুন। অডিওটি প্রমাণ হিসেবে সংরক্ষিত হবে।</p>}
        {recordingState === 'recorded' && !isUploading && <div className="flex items-center gap-2 rounded-xl bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)]"><Check className="h-4 w-4" />রেকর্ডিং সংরক্ষিত</div>}
      </div>

      <div className="flex items-center justify-center gap-3">
        {recordingState === 'idle' && <button type="button" onClick={handleStart} disabled={isUploading} className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[var(--accent-hover)] disabled:opacity-50"><Mic className="h-4 w-4" />রেকর্ড শুরু</button>}
        {recordingState === 'recording' && <><button type="button" onClick={handlePause} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--paper-elevated)] px-4 py-2 text-xs font-semibold text-[var(--ink)]"><Pause className="h-3.5 w-3.5" />বিরতি</button><button type="button" onClick={handleStop} className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-5 py-2 text-xs font-bold text-white"><Square className="h-3.5 w-3.5" />শেষ করুন</button></>}
        {recordingState === 'paused' && <><button type="button" onClick={handleResume} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-4 py-2 text-xs font-semibold text-white"><Mic className="h-3.5 w-3.5" />আবার শুরু</button><button type="button" onClick={handleStop} className="inline-flex items-center gap-1.5 rounded-full bg-rose-600 px-5 py-2 text-xs font-bold text-white"><Square className="h-3.5 w-3.5" />শেষ করুন</button></>}
        {recordingState === 'recorded' && !isUploading && <><button type="button" onClick={togglePlayback} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--paper-elevated)] px-4 py-2 text-xs font-semibold text-[var(--ink)]">{isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}{isPlaying ? 'বিরতি' : 'শুনুন'}</button><button type="button" onClick={handleReset} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] px-4 py-2 text-xs font-medium text-[var(--muted)]"><RotateCcw className="h-3.5 w-3.5" />আবার</button></>}
      </div>

      {isUploading && <p className="mt-3 inline-flex items-center gap-2 text-xs text-[var(--accent)]"><UploadCloud className="h-4 w-4 animate-bounce" />অডিও সংরক্ষণ হচ্ছে…</p>}
      {error && <p className="mt-3 flex items-start justify-center gap-2 text-xs text-rose-700"><AlertCircle className="h-4 w-4 shrink-0" />{error}</p>}
      <audio ref={audioRef} src={audioUrl || undefined} onEnded={() => setIsPlaying(false)} onPause={() => setIsPlaying(false)} className="hidden" />
    </div>
  );
};
