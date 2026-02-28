import type { Metadata } from "next";
import { Users, Shield, UserCheck, Search, MoreVertical } from "lucide-react";
import { getAllProfiles, getMemberStats } from "@/lib/queries/profiles";

export const metadata: Metadata = {
  title: "Üye Yönetimi | YeyClub Admin",
  description: "YeyClub üyelerini yönetin.",
};

const AVATAR_GRADIENTS = [
  "from-yey-yellow to-yey-red",
  "from-yey-turquoise to-yey-blue",
  "from-yey-blue to-yey-turquoise",
  "from-yey-red to-yey-yellow",
  "from-yey-yellow to-yey-turquoise",
];

export default async function AdminUyelerPage() {
  const [memberStats, profiles] = await Promise.all([
    getMemberStats(),
    getAllProfiles(),
  ]);

  const stats = [
    {
      label: "Toplam Üye",
      value: memberStats.total,
      icon: Users,
      color: "text-yey-yellow",
      bg: "bg-yey-yellow/10",
    },
    {
      label: "Admin",
      value: memberStats.admins,
      icon: Shield,
      color: "text-yey-turquoise",
      bg: "bg-yey-turquoise/10",
    },
    {
      label: "Bu Ay Yeni",
      value: memberStats.newThisMonth,
      icon: UserCheck,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="yey-heading text-3xl">Üye Yönetimi</h1>
        <p className="yey-text-muted mt-1">
          Topluluk üyelerini görüntüleyin ve yönetin.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="yey-card flex items-center justify-between"
            >
              <div>
                <p className="yey-text-muted text-sm">{s.label}</p>
                <p className="mt-1 text-3xl font-bold text-foreground">
                  {s.value}
                </p>
              </div>
              <div className={`rounded-xl ${s.bg} p-3`}>
                <Icon className={`h-6 w-6 ${s.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/40" />
        <input
          type="text"
          placeholder="Üye ara... (ad, e-posta)"
          className="w-full rounded-xl border border-border bg-card py-3 pl-12 pr-4 text-foreground placeholder:text-foreground/40 focus:border-yey-turquoise focus:outline-none focus:ring-2 focus:ring-yey-turquoise/20"
        />
      </div>

      <div className="yey-card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 font-medium text-foreground/60">
                  Üye
                </th>
                <th className="px-6 py-4 font-medium text-foreground/60">
                  Rol
                </th>
                <th className="px-6 py-4 font-medium text-foreground/60">
                  Kayıt Tarihi
                </th>
                <th className="px-6 py-4 font-medium text-foreground/60">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {profiles.map((member, i) => (
                <tr
                  key={member.id}
                  className="transition-colors hover:bg-accent"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]} text-sm font-bold text-white`}
                      >
                        {member.full_name.charAt(0)}
                      </div>
                      <span className="font-medium text-foreground">
                        {member.full_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        member.role === "admin"
                          ? "bg-yey-yellow/10 text-yey-yellow"
                          : "bg-yey-turquoise/10 text-yey-turquoise"
                      }`}
                    >
                      {member.role === "admin" ? "Admin" : "Üye"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground/60">
                    {new Date(member.created_at).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      className="rounded-lg p-2 text-foreground/40 transition-colors hover:bg-foreground/5 hover:text-foreground"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
