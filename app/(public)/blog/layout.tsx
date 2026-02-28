import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "YeyClub blog yazıları ve haberler.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
