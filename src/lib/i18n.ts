import type { Language } from '@/types'

export const translations = {
  pt: {
    home: {
      title: 'Voice Transcription',
      subtitle: 'Grava a tua voz e obtém uma transcrição precisa com AI',
      history: 'Histórico',
      copyText: 'Copiar texto',
      viewHistory: 'Ver histórico',
      finalTranscription: 'Transcrição Final',
      viaWhisper: 'via Whisper + LLaMA',
      transcribingAudio: 'A transcrever áudio...',
      whisperProcessing: 'Whisper AI a processar',
      llmRefining: 'LLaMA a refinar...',
      whisperRaw: 'Whisper (cru)',
      errorTranscription: 'Erro ao transcrever o áudio. Tenta novamente.',
      errorConnect: 'Não foi possível conectar ao servidor.',
    },
    recorder: {
      paused: 'Pausado',
      processing: 'A processar...',
      restart: 'Recomeçar',
    },
    live: {
      noSupport: '⚠️ O teu browser não suporta transcrição ao vivo. A transcrição final estará disponível após a gravação via Whisper. Para melhor experiência usa o Chrome.',
      placeholder: 'A transcrição aparecerá aqui enquanto falas...',
      listening: 'A ouvir...',
    },
    dashboard: {
      title: 'Histórico',
      countSingular: 'transcrição guardada',
      countPlural: 'transcrições guardadas',
      newRecording: 'Nova gravação',
      searchPlaceholder: 'Pesquisar transcrições...',
      filterAll: '🌍 Todos',
      filterPt: '🇧🇷 Português',
      filterEn: '🇺🇸 English',
      noResults: 'Nenhum resultado encontrado',
      noResultsHint: 'Tenta ajustar os filtros',
      empty: 'Ainda não há transcrições',
      emptyHint: 'Grava a tua primeira voz!',
      goToRecorder: 'Ir para o gravador',
      errorLoad: 'Erro ao carregar transcrições.',
    },
    card: {
      langLabel: 'Português',
      copy: 'Copiar texto',
      delete: 'Apagar',
      showRaw: '▶ Ver texto original (Whisper)',
      hideRaw: '▼ Esconder texto original',
    },
  },

  en: {
    home: {
      title: 'Voice Transcription',
      subtitle: 'Record your voice and get an accurate AI transcription',
      history: 'History',
      copyText: 'Copy text',
      viewHistory: 'View history',
      finalTranscription: 'Final Transcription',
      viaWhisper: 'via Whisper + LLaMA',
      transcribingAudio: 'Transcribing audio...',
      whisperProcessing: 'Whisper AI processing',
      llmRefining: 'LLaMA refining...',
      whisperRaw: 'Whisper (raw)',
      errorTranscription: 'Error transcribing audio. Please try again.',
      errorConnect: 'Could not connect to the server.',
    },
    recorder: {
      paused: 'Paused',
      processing: 'Processing...',
      restart: 'Restart',
    },
    live: {
      noSupport: '⚠️ Your browser does not support live transcription. The final transcription will be available after recording via Whisper. For the best experience, use Chrome.',
      placeholder: 'Transcription will appear here as you speak...',
      listening: 'Listening...',
    },
    dashboard: {
      title: 'History',
      countSingular: 'transcription saved',
      countPlural: 'transcriptions saved',
      newRecording: 'New recording',
      searchPlaceholder: 'Search transcriptions...',
      filterAll: '🌍 All',
      filterPt: '🇧🇷 Português',
      filterEn: '🇺🇸 English',
      noResults: 'No results found',
      noResultsHint: 'Try adjusting the filters',
      empty: 'No transcriptions yet',
      emptyHint: 'Record your first voice note!',
      goToRecorder: 'Go to recorder',
      errorLoad: 'Error loading transcriptions.',
    },
    card: {
      langLabel: 'English',
      copy: 'Copy text',
      delete: 'Delete',
      showRaw: '▶ Show original text (Whisper)',
      hideRaw: '▼ Hide original text',
    },
  },
} as const

export type Translations = typeof translations['pt']

export function t(lang: Language): Translations {
  return translations[lang]
}