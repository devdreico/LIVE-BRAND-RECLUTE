import { useState } from 'react'
import type { ChangeEvent } from 'react'
import type { Applicant } from '../../types'
import { seedApplicants } from '../../data/seedApplicants'
import { useApplicants } from '../../hooks/useApplicants'
import {
  STORAGE_KEY,
  exportApplicants,
  importApplicants,
} from '../../services/applicantStorage'
import { buildApplicantsCsv, csvFileName, fileDateSuffix } from '../../utils/exportCsv'

function downloadTextFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

interface DataActionsProps {
  /** Postulantes filtrados: son los que se exportan a CSV. */
  rows: Applicant[]
}

export default function DataActions({ rows }: DataActionsProps) {
  const { applicants, replaceAll } = useApplicants()
  const [message, setMessage] = useState('')

  const handleCsvExport = (): void => {
    if (rows.length === 0) return
    downloadTextFile(buildApplicantsCsv(rows), csvFileName(), 'text/csv;charset=utf-8')
    setMessage(`CSV exportado con ${rows.length} postulantes.`)
  }

  const handleBackupExport = (): void => {
    downloadTextFile(
      exportApplicants(applicants),
      `livebrand-backup-${fileDateSuffix()}.json`,
      'application/json;charset=utf-8',
    )
    setMessage(`Backup exportado con ${applicants.length} postulantes.`)
  }

  const handleImport = (event: ChangeEvent<HTMLInputElement>): void => {
    const input = event.target
    const file = input.files?.[0]
    input.value = ''
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const imported = importApplicants(String(reader.result ?? ''))
        replaceAll(imported)
        setMessage(`Backup importado: ${imported.length} postulantes.`)
      } catch {
        setMessage('No se pudo importar el archivo: formato de backup no válido.')
      }
    }
    reader.onerror = () => {
      setMessage('No se pudo leer el archivo de backup.')
    }
    reader.readAsText(file)
  }

  const handleRestore = (): void => {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Sin storage disponible seguimos recargando la semilla en memoria.
    }
    replaceAll([...seedApplicants])
    setMessage('Datos demo restaurados.')
  }

  const toolClass =
    'rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-display text-xs font-semibold text-white/70 transition hover:border-brand-400/50 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:text-white/70'

  return (
    <div role="group" aria-label="Exportar y respaldar datos" className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={handleCsvExport} disabled={rows.length === 0} className={toolClass}>
        Exportar CSV
      </button>
      <button type="button" onClick={handleBackupExport} className={toolClass}>
        Exportar backup
      </button>

      <label
        className={`${toolClass} cursor-pointer has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-300`}
      >
        Importar backup
        <input
          type="file"
          accept="application/json,.json"
          className="sr-only"
          onChange={handleImport}
        />
      </label>

      <button type="button" onClick={handleRestore} className={toolClass}>
        Restaurar datos demo
      </button>

      {message && (
        <span role="status" className="basis-full text-xs text-brand-200">
          {message}
        </span>
      )}
    </div>
  )
}
