"use client"

import * as React from "react"
import { Upload, Download, CheckCircle, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BACKUP_STATS } from "@/data/mock/settings"

export const SystemBackups = () => {
  const [isImporting, setIsImporting] = React.useState(false)
  const [isExporting, setIsExporting] = React.useState(false)
  const [importMessage, setImportMessage] = React.useState<string | null>(null)
  const [exportMessage, setExportMessage] = React.useState<string | null>(null)

  const handleImportDatabase = () => {
    setIsImporting(true)
    setImportMessage(null)
    setExportMessage(null)
    // HACK: Simulate secure database decrypt and schema verification
    setTimeout(() => {
      setIsImporting(false)
      setImportMessage("Database credentials successfully restored!")
    }, 2000)
  }

  const handleExportLogs = () => {
    setIsExporting(true)
    setImportMessage(null)
    setExportMessage(null)
    // HACK: Simulate compiling safety audit logs to CSV
    setTimeout(() => {
      setIsExporting(false)
      setExportMessage("Audit logs exported successfully!")
    }, 1500)
  }

  return (
    <Card className="relative overflow-hidden rounded-xl border border-border/50 bg-muted/50 p-8">
      <div className="pointer-events-none absolute top-0 right-0 -mt-32 -mr-32 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 shrink-0 rotate-[-3deg] items-center justify-center rounded-2xl border border-border/50 bg-card shadow-lg">
            <div className="rounded-xl bg-primary/10 p-3">
              <Download className="size-8 text-primary" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-foreground">
              System Backups & Logs
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Redundant storage of worker credentials and safety audit history.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            disabled={isImporting || isExporting}
            onClick={handleImportDatabase}
            className="flex h-12 items-center gap-2 rounded-xl border-primary px-6 font-bold text-primary hover:bg-primary/5"
            aria-label="Import database"
          >
            {isImporting ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" />
                IMPORTING...
              </>
            ) : (
              <>
                <Upload className="size-5" />
                IMPORT DATABASE
              </>
            )}
          </Button>
          <Button
            disabled={isImporting || isExporting}
            onClick={handleExportLogs}
            className="flex h-12 items-center gap-2 rounded-xl bg-primary px-8 font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl active:scale-95"
            aria-label="Export audit logs as CSV"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 size-5 animate-spin" />
                EXPORTING...
              </>
            ) : (
              <>
                <Download className="size-5" />
                EXPORT AUDIT LOGS (.CSV)
              </>
            )}
          </Button>
        </div>
      </div>

      {(importMessage || exportMessage) && (
        <div className="animate-fade-in relative z-10 mt-4 text-center">
          <p className="text-xs font-semibold text-primary">
            {importMessage || exportMessage}
          </p>
        </div>
      )}

      <div className="relative z-10 mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm">
          <p className="text-[10px] font-bold tracking-tighter text-muted-foreground uppercase">
            Last Backup
          </p>
          <p className="mt-1 text-sm font-bold text-foreground">
            {BACKUP_STATS.lastBackup}
          </p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm">
          <p className="text-[10px] font-bold tracking-tighter text-muted-foreground uppercase">
            Archive Size
          </p>
          <p className="mt-1 text-sm font-bold text-foreground">
            {BACKUP_STATS.archiveSize}
          </p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/60 p-4 backdrop-blur-sm">
          <p className="text-[10px] font-bold tracking-tighter text-muted-foreground uppercase">
            Integrity Check
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-primary">
            <CheckCircle className="size-3.5" />
            {BACKUP_STATS.integrityCheck}
          </p>
        </div>
      </div>
    </Card>
  )
}
