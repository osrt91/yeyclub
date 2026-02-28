import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Yönetimi | YeyClub Admin",
  description: "YeyClub blog yazılarını yönetin.",
};

export default function AdminBlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
