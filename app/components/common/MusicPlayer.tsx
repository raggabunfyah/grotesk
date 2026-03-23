'use client';

import { useMusicStore, usePortalStore } from '@stores';
import { useEffect, useRef, useState } from 'react';
import { publicPath } from '../../utils/publicPath';

const TRACK_PATH = publicPath('/audio/theme.wav');

const MusicPlayer = ({ autoStart = false }: { autoStart?: boolean }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const pausedByVideoRef = useRef(false);
  const isPortalActive = usePortalStore((state) => !!state.activePortalId);
  const pauseSignal = useMusicStore((state) => state.pauseSignal);
  const resumeSignal = useMusicStore((state) => state.resumeSignal);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [trackMissing, setTrackMissing] = useState(false);

  const playAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      await audio.play();
      setIsPlaying(true);
      setNeedsInteraction(false);
      setTrackMissing(false);
    } catch {
      setIsPlaying(false);
      setNeedsInteraction(true);
    }
  };

  const pauseAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  useEffect(() => {
    if (!autoStart) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = false;
    setIsMuted(false);
    playAudio();
  }, [autoStart]);

  useEffect(() => {
    if (!needsInteraction) return;

    const unlock = () => {
      const audio = audioRef.current;
      if (audio) {
        audio.muted = false;
        setIsMuted(false);
      }
      playAudio();
    };

    window.addEventListener('click', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    window.addEventListener('touchstart', unlock, { once: true });

    return () => {
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, [needsInteraction]);

  useEffect(() => {
    if (!pauseSignal) return;
    pausedByVideoRef.current = isPlaying;
    pauseAudio();
  }, [pauseSignal]);

  useEffect(() => {
    if (!resumeSignal) return;
    if (!pausedByVideoRef.current) return;
    pausedByVideoRef.current = false;
    playAudio();
  }, [resumeSignal]);

  return (
    <div
      className="fixed left-8 bottom-[40px] md:left-6 md:bottom-6"
      style={{
        zIndex: 3,
        opacity: isPortalActive ? 0 : 1,
        transition: 'opacity 0.4s ease',
      }}
    >
      <audio
        ref={audioRef}
        src={TRACK_PATH}
        loop
        playsInline
        preload="auto"
        onError={() => {
          setTrackMissing(true);
          setIsPlaying(false);
          setNeedsInteraction(false);
        }}
      />
      <div
        className="flex items-center m gap-2 rounded-5xl px-3 py-2"
        style={{
          backgroundColor: 'transparent',
          border: '1px solid #eee',
          backdropFilter: 'blur(8px)',
        }}
      >
        {trackMissing ? (
          <span className="text-[10px] text-white/80">/public/audio/theme.wav ekleyin</span>
        ) : (
          <>
            <button
              type="button"
              onClick={isPlaying ? pauseAudio : playAudio}
              className="text-xs text-white hover:opacity-80"
            >
              {isPlaying ? 'Durdur' : 'Oynat'}
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="text-xs text-white hover:opacity-80"
            >
              {isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            </button>
            {needsInteraction ? <span className="text-[10px] text-white/80">Başlatmak için dokun</span> : null}
          </>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
