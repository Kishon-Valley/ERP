import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Construction ERP",
  description: "Multi-branch construction materials ERP",
};

export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
