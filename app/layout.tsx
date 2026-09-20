import type { Metadata } from "next"; import "./globals.css"; import { ErpShell } from "@/components/erp-shell";
export const metadata: Metadata={title:"Construction ERP",description:"Multi-branch construction materials ERP"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><ErpShell>{children}</ErpShell></body></html>}