import Image from "next/image"
import { cn } from "@/lib/utils"
import { Shield, User } from "lucide-react"
import type { Profile } from "@/types"

type ProfileCardProps = {
  profile: Profile
  email?: string
}

const ROLE_CONFIG = {
  admin: { label: "Yönetici", color: "bg-yey-red/20 text-yey-red", icon: Shield },
  member: { label: "Üye", color: "bg-yey-turquoise/20 text-yey-turquoise", icon: User },
} as const

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function ProfileCard({ profile, email }: ProfileCardProps) {
  const role = ROLE_CONFIG[profile.role]
  const RoleIcon = role.icon
  const memberSince = new Date(profile.created_at).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
  })

  return (
    <div className="yey-card flex flex-col items-center gap-6 p-8 sm:flex-row sm:items-start">
      {profile.avatar_url ? (
        <Image
          src={profile.avatar_url}
          alt={profile.full_name}
          width={96}
          height={96}
          className="h-24 w-24 shrink-0 rounded-full object-cover ring-4 ring-yey-yellow/30"
        />
      ) : (
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yey-yellow to-yey-turquoise text-2xl font-bold text-yey-dark-bg ring-4 ring-yey-yellow/30">
          {getInitials(profile.full_name)}
        </div>
      )}

      <div className="flex-1 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-foreground">{profile.full_name}</h2>
        {email && <p className="mt-1 text-sm text-foreground/60">{email}</p>}

        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
              role.color
            )}
          >
            <RoleIcon className="h-3 w-3" />
            {role.label}
          </span>
          <span className="text-xs text-foreground/50">
            {memberSince}&apos;dan beri üye
          </span>
        </div>
      </div>
    </div>
  )
}
