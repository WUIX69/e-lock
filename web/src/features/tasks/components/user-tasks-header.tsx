import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Filter, Mail } from "lucide-react"
import type { Invitation } from "@/features/tasks/components/invitations-modal"
import { InvitationsModal } from "@/features/tasks/components/invitations-modal"
import { getPendingInvitationsAction } from "@/features/tasks/server/actions/tasks"

interface UserTasksHeaderProps {
  pendingInvitationCount?: number
  onInvitationsRefresh?: () => void
}

export const UserTasksHeader = ({
  pendingInvitationCount = 0,
  onInvitationsRefresh,
}: UserTasksHeaderProps) => {
  const router = useRouter()
  const [showInvitations, setShowInvitations] = useState(false)
  const [invitations, setInvitations] = useState<Invitation[]>([])

  const handleOpenInvitations = async () => {
    const res = await getPendingInvitationsAction()
    if (res.invitations) setInvitations(res.invitations as Invitation[])
    setShowInvitations(true)
  }

  return (
    <>
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <span className="text-sm font-bold tracking-widest uppercase">
              Personal Log
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground">
            Operational Task History
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            A detailed record of your safety verifications and LOTO procedures.
            Your contributions ensure the facility operates with maximum precision
            and zero risk.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {pendingInvitationCount > 0 && (
            <button
              type="button"
              onClick={handleOpenInvitations}
              className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-6 py-3 font-bold text-primary transition-all hover:bg-primary/10 active:scale-95"
            >
              <Mail className="size-4" />
              View Invitations ({pendingInvitationCount})
            </button>
          )}
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 font-bold text-primary transition-all hover:bg-muted active:scale-95"
          >
            <Filter className="size-4" />
            Filter View
          </button>
          <button
            type="button"
            onClick={() => router.push("/devices")}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:brightness-110 active:scale-95"
          >
            <Plus className="size-4" />
            New Submission
          </button>
        </div>
      </div>

      <InvitationsModal
        open={showInvitations}
        onOpenChange={setShowInvitations}
        invitations={invitations}
        onRefresh={() => {
          setShowInvitations(false)
          onInvitationsRefresh?.()
        }}
      />
    </>
  )
}
