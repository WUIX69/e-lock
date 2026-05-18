"use client"

import * as React from "react"
import { Upload, Download, CheckCircle, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BACKUP_STATS } from "../data/mock-settings"

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
    <Card className="bg-muted/50 rounded-xl p-8 border border-border/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 bg-card rounded-2xl flex items-center justify-center shadow-lg rotate-[-3deg] border border-border/50 shrink-0">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Download className="size-8 text-primary" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-foreground">System Backups & Logs</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Redundant storage of worker credentials and safety audit history.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            disabled={isImporting || isExporting}
            onClick={handleImportDatabase}
            className="border-primary text-primary hover:bg-primary/5 font-bold h-12 px-6 rounded-xl flex items-center gap-2"
            aria-label="Import database"
          >
            {isImporting ? (
              <>
                <Loader2 className="size-5 animate-spin mr-2" />
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
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 px-8 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95 transition-all"
            aria-label="Export audit logs as CSV"
          >
            {isExporting ? (
              <>
                <Loader2 className="size-5 animate-spin mr-2" />
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
        <div className="mt-4 text-center animate-fade-in relative z-10">
          <p className="text-xs font-semibold text-primary">
            {importMessage || exportMessage}
          </p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="bg-card/60 backdrop-blur-sm p-4 rounded-xl border border-border/50">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
            Last Backup
          </p>
          <p className="text-sm font-bold text-foreground mt-1">{BACKUP_STATS.lastBackup}</p>
        </div>

        <div className="bg-card/60 backdrop-blur-sm p-4 rounded-xl border border-border/50">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
            Archive Size
          </p>
          <p className="text-sm font-bold text-foreground mt-1">{BACKUP_STATS.archiveSize}</p>
        </div>

        <div className="bg-card/60 backdrop-blur-sm p-4 rounded-xl border border-border/50">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
            Integrity Check
          </p>
          <p className="text-sm font-bold text-primary flex items-center gap-1.5 mt-1">
            <CheckCircle className="size-3.5" />
            {BACKUP_STATS.integrityCheck}
          </p>
        </div>
      </div>
    </Card>
  )
}