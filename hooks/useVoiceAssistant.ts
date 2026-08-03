"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type RecognitionResultEvent = {
  results: ArrayLike<{
    0: {
      transcript: string;
    };
  }>;
};

type RecognitionErrorEvent = {
  error?: string;
};

type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: RecognitionResultEvent) => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;
};

type SpeechRecognitionConstructor =
  new () => SpeechRecognitionInstance;

type VoiceWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

function prepareSpeechText(text: string) {
  return text
    .replace(/\[\[[\s\S]*?\]\]/g, "")
    .replace(/[→➡⇒➜➤►]/gu, ". ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*•▪◦]\s+/gm, ". ")
    .replace(/[*_`~]/g, "")
    .replace(/\n+/g, ". ")
    .replace(/\bFIFO\b/gi, "fifo")
    .replace(/\bFEFO\b/gi, "féfo")
    .replace(/\bWMS\b/gi, "double vé, ème, esse")
    .replace(/\bERP\b/gi, "é, erre, pé")
    .replace(/\bKPI\b/gi, "ka, pé, i")
    .replace(/\bAPI\b/gi, "a, pé, i")
    .replace(/\bIA\b/g, "i a")
    .replace(/[\p{Extended_Pictographic}\uFE0F]/gu, "")
    .replace(/\s*\.\s*\.\s*/g, ". ")
    .replace(/\s{2,}/g, " ")
    .replace(/\.{2,}/g, ".")
    .trim();
}

function getAdaptiveSpeechRate(text: string) {
  const isMobile =
    window.matchMedia("(max-width: 768px)").matches ||
    /Android|iPhone|iPad|iPod/i.test(
      navigator.userAgent,
    );

  if (isMobile) {
    if (text.length < 140) {
      return 1.05;
    }

    if (text.length < 450) {
      return 1.12;
    }

    return 1.19;
  }

  if (text.length < 140) {
    return 0.96;
  }

  if (text.length < 450) {
    return 1.03;
  }

  return 1.1;
}

export default function useVoiceAssistant() {
  const recognitionRef =
    useRef<SpeechRecognitionInstance | null>(null);

  const transcriptHandlerRef =
    useRef<((transcript: string) => void) | null>(null);

  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const voiceWindow = window as VoiceWindow;

    const Recognition =
      voiceWindow.SpeechRecognition ??
      voiceWindow.webkitSpeechRecognition;

    setSupported(Boolean(Recognition));

    if (!Recognition) {
      return;
    }

    const recognition = new Recognition();

    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
      setError(null);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.onerror = (event) => {
      setListening(false);

      if (event.error === "not-allowed") {
        setError("Autorisez le microphone dans votre navigateur.");
        return;
      }

      if (event.error === "no-speech") {
        setError("Aucune parole détectée. Réessayez.");
        return;
      }

      setError("La reconnaissance vocale a échoué.");
    };

    recognition.onresult = (event) => {
      const transcript =
        event.results?.[0]?.[0]?.transcript?.trim() ?? "";

      if (transcript) {
        transcriptHandlerRef.current?.(transcript);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
      recognitionRef.current = null;
      window.speechSynthesis?.cancel();
    };
  }, []);

  const startListening = useCallback(
    (onTranscript: (transcript: string) => void) => {
      if (!recognitionRef.current || listening) {
        return;
      }

      transcriptHandlerRef.current = onTranscript;
      setError(null);

      window.speechSynthesis?.cancel();
      setSpeaking(false);

      try {
        recognitionRef.current.start();
      } catch {
        setError("Le microphone est déjà en cours d’utilisation.");
      }
    },
    [listening],
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (
        !voiceEnabled ||
        !text.trim() ||
        !("speechSynthesis" in window)
      ) {
        return;
      }

      window.speechSynthesis.cancel();

      const cleanText =
        prepareSpeechText(text);

      if (!cleanText) {
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);

      utterance.lang = "fr-FR";
      utterance.rate = getAdaptiveSpeechRate(cleanText);
      utterance.pitch = 0.98;
      utterance.volume = 1;

      const voices =
        window.speechSynthesis.getVoices();

      const frenchVoices = voices.filter(
        (voice) =>
          voice.lang
            .toLowerCase()
            .startsWith("fr"),
      );

      const preferredNames = [
        "microsoft denise",
        "microsoft henri",
        "google français",
        "google francais",
        "audrey",
        "thomas",
      ];

      const selectedVoice =
        preferredNames
          .map((preferredName) =>
            frenchVoices.find((voice) =>
              voice.name
                .toLowerCase()
                .includes(preferredName),
            ),
          )
          .find(Boolean) ??
        frenchVoices[0];

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [voiceEnabled],
  );

  const toggleVoice = useCallback(() => {
    setVoiceEnabled((current) => {
      const next = !current;

      if (!next) {
        window.speechSynthesis?.cancel();
        setSpeaking(false);
      }

      return next;
    });
  }, []);

  return {
    supported,
    listening,
    speaking,
    voiceEnabled,
    error,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    toggleVoice,
  };
}
