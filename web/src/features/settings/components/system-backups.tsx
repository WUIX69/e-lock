"use client"

import * as React from "react"
import { Upload, Download, CheckCircle } from "lucide-react"
import { BACKUP_STATS } from "../data/mock-settings"

export function SystemBackups() {
  return (
    <div className="bg-muted/50 rounded-xl p-8 border border-border/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 bg-card rounded-2xl flex items-center justify-center shadow-lg rotate-[-3deg]">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Download className="size-8 text-primary" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-foreground">System Backups & Logs</h3>
            <p className="text-muted-foreground text-sm">
              Redundant storage of worker credentials and safety audit history.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <button className="bg-card border-2 border-primary text-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary/5 transition-colors">
            <Upload className="size-5" />
            IMPORT DATABASE
          </button>
          <button className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95 transition-all">
            <Download className="size-5" />
            EXPORT AUDIT LOGS (.CSV)
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="bg-card/60 backdrop-blur-sm p-4 rounded-xl border border-border">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
            Last Backup
          </p>
          <p className="text-sm font-bold">{BACKUP_STATS.lastBackup}</p>
        </div>

        <div className="bg-card/60 backdrop-blur-sm p-4 rounded-xl border border-border">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
            Archive Size
          </p>
          <p className="text-sm font-bold">{BACKUP_STATS.archiveSize}</p>
        </div>

        <div className="bg-card/60 backdrop-blur-sm p-4 rounded-xl border border-border">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
            Integrity Check
          </p>
          <p className="text-sm font-bold text-primary flex items-center gap-1">
            <CheckCircle className="size-3" />
            {BACKUP_STATS.integrityCheck}
          </p>
        </div>
      </div>
    </div>
  )
}