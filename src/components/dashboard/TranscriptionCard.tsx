'use client'

import { useState } from 'react'
import { Copy, Trash2, Check, Clock, Globe } from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import { t } from '@/lib/i18n'
import type { Transcription, Language } from '@/types'

interface TranscriptionCardProps {
  transcription: Transcription
  onDelete: (id: string) => void
  uiLanguage: Language
}

export function TranscriptionCard({ transcription, onDelete, uiLanguage }: TranscriptionCardProps) {
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const tx = t(uiLanguage)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(transcription.cleanText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDelete = async () => {
    setDeleting(true)
    await onDelete(transcription.id)
    setDeleting(false)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(uiLanguage === 'pt' ? 'pt-BR' : 'en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">

      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">

          {transcription.title && (
            <h3 className="font-medium text-slate-800 dark:text-slate-200 text-sm">
              {transcription.title}
            </h3>
          )}

          <div className="flex items-center gap-2 flex-wrap">
           <span className="flex items-center gap-1 text-xs text-slate-400">
  <Globe className="w-3 h-3" />
  {transcription.language === 'pt' ? 'Português' : 'English'}
</span>
            <span className="text-slate-200 dark:text-slate-700">•</span>
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              {formatDuration(transcription.duration)}
            </span>
            <span className="text-slate-200 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-400">
              {formatDate(transcription.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            title={tx.card.copy}
          >
            {copied
              ? <Check className="w-4 h-4 text-green-500" />
              : <Copy className="w-4 h-4" />
            }
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all disabled:opacity-50"
            title={tx.card.delete}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-3">
        {transcription.cleanText}
      </p>

      <details className="group">
        <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600 transition-colors list-none flex items-center gap-1">
          <span className="group-open:hidden">{tx.card.showRaw}</span>
          <span className="hidden group-open:inline">{tx.card.hideRaw}</span>
        </summary>
        <p className="mt-2 text-xs text-slate-400 leading-relaxed italic border-l-2 border-slate-200 dark:border-slate-700 pl-3">
          {transcription.rawText}
        </p>
      </details>

    </div>
  )
}