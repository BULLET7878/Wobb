import { Check } from "lucide-react";

interface VerifiedBadgeProps {
  verified: boolean;
}

export function VerifiedBadge({ verified }: VerifiedBadgeProps) {
  if (!verified) return null;
  return (
    <span
      className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-blue-500 text-white ml-1 flex-shrink-0"
      title="Verified Creator"
    >
      <Check className="w-2.5 h-2.5 stroke-[3]" />
    </span>
  );
}
