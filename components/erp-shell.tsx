"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Bell, Boxes, ChevronDown, CircleDollarSign, ClipboardCheck, FileText, Home, Menu, PackageSearch, Search, Settings, Truck, Users, X } from "lucide-react";

const nav=[
  ["Dashboard","/",Home],["Sales","/sales",CircleDollarSign],["Inventory","/inventory",Boxes],["Procurement","/procurement",PackageSearch],
  ["Customers & Projects","/customers",Users],["Deliveries","/deliveries",Truck],["Finance","/finance",FileText],["Reports","/reports",BarChart3],["Approvals","/approvals",ClipboardCheck]
] as const;

export function ErpShell({children}:{children:React.ReactNode}){
 const [open,setOpen]=useState(false); const pathname=usePathname();
 return <div className="app-shell">
  <aside className={open?"sidebar open":"sidebar"}>
   <div className="brand"><div className="brand-mark">CV</div><div><strong>Construction ERP</strong><span>Operations Platform</span></div><button className="mobile-close" onClick={()=>setOpen(false)}><X size={18}/></button></div>
   <div className="workspace"><span>Organization</span><button>Ghana Building Supply <ChevronDown size={15}/></button></div>
   <nav>{nav.map(([label,href,Icon])=><Link onClick={()=>setOpen(false)} className={pathname===href?"nav-item active":"nav-item"} href={href} key={href}><Icon size={18}/><span>{label}</span>{label==="Approvals"&&<b>4</b>}</Link>)}</nav>
   <div className="sidebar-footer"><Link className="nav-item" href="/admin"><Settings size={18}/><span>Administration</span></Link><div className="user"><div className="avatar">KA</div><div><strong>K. Admin</strong><span>Org Administrator</span></div></div></div>
  </aside>
  <main className="main">
   <header className="topbar"><button className="icon-btn mobile-menu" onClick={()=>setOpen(true)}><Menu size={20}/></button><div className="search"><Search size={18}/><input placeholder="Search products, customers, invoices, orders…" /><kbd>⌘ K</kbd></div><div className="top-actions"><button className="branch">Accra Central <ChevronDown size={15}/></button><button className="icon-btn"><Bell size={19}/><i/></button><div className="avatar">KA</div></div></header>
   <div className="content">{children}</div>
  </main>
 </div>
}
