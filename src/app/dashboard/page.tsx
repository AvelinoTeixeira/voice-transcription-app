'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Mic } from 'lucide-react'
import { TranscriptionCard } from '@/components/dashboard/TranscriptionCard'
import { SearchBar } from '@/components/dashboard/SearchBar'
import { useTranscriptions } from '@/hooks/useTranscriptions'
import { t } from '@/lib/i18n'
import type { Language } from '@/types'

export default function DashboardPage() {
  const [search, setSearch] = useState('')
  const [languageFilter, setLanguageFilter] = useState<Language | 'all'>('all')
  const [uiLanguage, setUiLanguage] = useState<Language>('pt')

  useEffect(() => {
    const stored = localStorage.getItem('ui-language') as Language | null
    if (stored === 'pt' || stored === 'en') setUiLanguage(stored)
  }, [])

  const { transcriptions, isLoading, error, deleteTranscription } = useTranscriptions()

  const filtered = useMemo(() => {
    return transcriptions.filter(item => {
      const matchesSearch = search === '' ||
        item.cleanText.toLowerCase().includes(search.toLowerCase()) ||
        item.rawText.toLowerCase().includes(search.toLowerCase()) ||
        item.title?.toLowerCase().includes(search.toLowerCase())

      const matchesLanguage = languageFilter === 'all' || item.language === languageFilter
      return matchesSearch && matchesLanguage
    })
  }, [transcriptions, search, languageFilter])

  // tx depois de todos os hooks
  const tx = t(uiLanguage)

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col gap-8">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {tx.dashboard.title}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {transcriptions.length} {transcriptions.length !== 1 ? tx.dashboard.countPlural : tx.dashboard.countSingular}
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <Mic className="w-4 h-4" />
            {tx.dashboard.newRecording}
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <SearchBar value={search} onChange={setSearch} placeholder={tx.dashboard.searchPlaceholder} />
          <div className="flex gap-2">
            {(['all', 'pt', 'en'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setLanguageFilter(lang)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  languageFilter === lang
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {lang === 'all' ? tx.dashboard.filterAll : lang === 'pt' ? tx.dashboard.filterPt : tx.dashboard.filterEn}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 h-32 animate-pulse"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 p-4">
            <p className="text-sm text-red-600 dark:text-red-400">{tx.dashboard.errorLoad}</p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Mic className="w-7 h-7 text-slate-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-300">
                    {search || languageFilter !== 'all' ? tx.dashboard.noResults : tx.dashboard.empty}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    {search || languageFilter !== 'all' ? tx.dashboard.noResultsHint : tx.dashboard.emptyHint}
                  </p>
                </div>
                {!search && languageFilter === 'all' && (
                  <Link
                    href="/"
                    className="text-sm text-slate-600 dark:text-slate-400 underline underline-offset-2 hover:text-slate-900 transition-colors"
                  >
                    {tx.dashboard.goToRecorder}
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map(transcription => (
                  <TranscriptionCard
                    key={transcription.id}
                    transcription={transcription}
                    onDelete={deleteTranscription}
                    uiLanguage={uiLanguage}
                  />
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </main>
  )
}