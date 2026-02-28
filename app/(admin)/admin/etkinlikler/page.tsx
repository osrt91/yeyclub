import type { Metadata } from "next";
import { getEventsWithCounts } from "@/lib/queries/events";
import { AdminEventsContent } from "@/components/admin/AdminEventsContent";

export const metadata: Metadata = {
  title: "Etkinlik Yönetimi | YeyClub Admin",
  description: "YeyClub etkinliklerini yönetin.",
};

export default async function AdminEtkinliklerPage() {
  const events = await getEventsWithCounts();

  return <AdminEventsContent initialEvents={events} />;
}
