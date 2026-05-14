import { AccessProtocol } from "@/types/personnel";
import { Fingerprint, Lock, Key } from "lucide-react";

export const MOCK_ACCESS_PROTOCOLS: AccessProtocol[] = [
  { 
    label: "Biometric Reset", 
    icon: Fingerprint, 
    desc: "Re-sync biometric tokens for all active nodes" 
  },
  { 
    label: "Mass Lockout", 
    icon: Lock, 
    desc: "Immediate isolation of all industrial zones", 
    color: "text-destructive" 
  },
  { 
    label: "Keycard Enrollment", 
    icon: Key, 
    desc: "Assign new RFID tags to existing personnel" 
  },
];
