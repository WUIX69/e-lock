import { Upload, Award } from "lucide-react"

export const UserTasksBottom = () => {
  return (
    <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="relative overflow-hidden rounded-3xl bg-sidebar p-8 text-sidebar-foreground">
        <div className="relative z-10">
          <h4 className="mb-4 text-2xl font-black tracking-tighter">
            Safety Streak: 12 Days
          </h4>
          <p className="mb-6 max-w-sm text-sidebar-foreground/70">
            You have completed 12 consecutive days of accident-free task
            submissions. Your precision sets the standard for the entire shift.
          </p>
          <div className="mb-2 h-2 w-full rounded-full bg-white/10">
            <div className="h-full w-4/5 rounded-full bg-secondary" />
          </div>
          <p className="text-[10px] font-bold tracking-widest text-secondary uppercase">
            80% to Gold Safety Badge
          </p>
        </div>
        <Award className="absolute -bottom-4 -right-4 size-36 rotate-12 text-white/5" />
      </div>

      <div className="flex flex-col items-center justify-center rounded-3xl border border-border/20 bg-card p-8 text-center">
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-white dark:bg-card shadow-sm">
          <Upload className="size-8 text-primary" />
        </div>
        <h4 className="mb-2 text-2xl font-black tracking-tighter text-foreground">
          Need to submit a hard copy?
        </h4>
        <p className="mb-6 px-12 text-sm text-muted-foreground">
          Scan your physical safety logs to digitize them and add them to your
          operational history immediately.
        </p>
        <button
          type="button"
          className="rounded-xl border border-border bg-white dark:bg-card px-6 py-2 font-bold text-foreground transition-all hover:bg-muted active:scale-95"
        >
          Start Digital Scan
        </button>
      </div>
    </div>
  )
}
