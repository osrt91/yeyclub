import { Utensils, Moon, PartyPopper, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  {
    id: "corba",
    title: "Çorba Dağıtımı",
    description:
      "Soğuk kış gecelerinde sıcak bir çorba ile gönüllere dokunuyoruz.",
    icon: Utensils,
    color: "text-yey-red",
    borderHover: "hover:border-yey-red/50",
    bgGlow: "group-hover:bg-yey-red/5",
  },
  {
    id: "iftar",
    title: "İftar Organizasyonları",
    description: "Ramazan ayında birlikte iftar sofraları kuruyoruz.",
    icon: Moon,
    color: "text-yey-yellow",
    borderHover: "hover:border-yey-yellow/50",
    bgGlow: "group-hover:bg-yey-yellow/5",
  },
  {
    id: "eglence",
    title: "Eğlence Etkinlikleri",
    description:
      "Konserler, piknikler ve daha fazlası ile eğlenceli vakit geçiriyoruz.",
    icon: PartyPopper,
    color: "text-yey-turquoise",
    borderHover: "hover:border-yey-turquoise/50",
    bgGlow: "group-hover:bg-yey-turquoise/5",
  },
  {
    id: "diger",
    title: "Diğer Etkinlikler",
    description:
      "Spor, kültür, sanat ve daha birçok alanda etkinlik düzenliyoruz.",
    icon: Star,
    color: "text-yey-blue",
    borderHover: "hover:border-yey-blue/50",
    bgGlow: "group-hover:bg-yey-blue/5",
  },
];

export function CategoriesSection() {
  return (
    <section className="py-20">
      <div className="yey-container">
        <div className="mb-12 text-center">
          <h2 className="yey-heading mb-4 text-3xl sm:text-4xl">
            Etkinlik Kategorileri
          </h2>
          <p className="yey-text-muted mx-auto max-w-2xl text-lg">
            Farklı kategorilerde düzenlediğimiz etkinliklerle herkese hitap
            ediyoruz.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className={cn(
                  "yey-card group cursor-pointer",
                  cat.borderHover,
                  "hover:scale-[1.03] hover:shadow-xl"
                )}
              >
                <div
                  className={cn(
                    "mb-4 inline-flex rounded-lg bg-foreground/5 p-3 transition-colors",
                    cat.bgGlow
                  )}
                >
                  <Icon className={cn("h-7 w-7", cat.color)} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {cat.title}
                </h3>
                <p className="text-sm text-foreground/60">{cat.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
