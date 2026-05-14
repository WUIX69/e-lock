import { PersonnelStat } from "@/types/dashboard";
import { Users, UserCheck, ShieldAlert, Activity } from "lucide-react";

export const MOCK_PERSONNEL_STATS: PersonnelStat[] = [
  {
    label: "Total Personnel",
    value: "142",
    icon: Users,
    color: "bg-primary",
  },
  {
    label: "Active on Site",
    value: "24",
    icon: UserCheck,
    color: "bg-sidebar-accent",
  },
  {
    label: "High Clearance",
    value: "12",
    icon: Activity,
    color: "bg-foreground",
  },
  {
    label: "Access Denials",
    value: "3",
    icon: ShieldAlert,
    color: "bg-destructive",
  },
];
