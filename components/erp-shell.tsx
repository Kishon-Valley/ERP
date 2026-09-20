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
   <div className="brand"><div className="brand-mark">GB</div><div><strong>Ghana Building Supply</strong><span>Enterprise operations</span></div><button className="mobile-close" aria-label="Close navigation" onClick={()=>setOpen(false)}><X size={18}/></button></div>
   <div className="workspace"><span>Operating context</span><button aria-label="Select organization">Ghana Building Supply <ChevronDown size={14}/></button><small>5 branches · 8 warehouses</small></div>
   <nav className="primary-nav">{nav.map(([label,href,Icon])=><Link onClick={()=>setOpen(false)} className={pathname===href?"nav-item active":"nav-item"} href={href} key={href}><Icon size={17}/><span>{label}</span>{label==="Approvals"&&<b>4</b>}</Link>)}</nav>
   <div className="sidebar-footer"><Link className={pathname==="/admin"?"nav-item active":"nav-item"} href="/admin"><Settings size={17}/><span>Administration</span></Link><div className="user"><div className="avatar">KA</div><div><strong>K. Admin</strong><span>Org Administrator</span></div></div></div>
  </aside>
  <main className="main">
   <header className="topbar"><button className="icon-btn mobile-menu" aria-label="Open navigation" onClick={()=>setOpen(true)}><Menu size={19}/></button>
    <div className="context-title"><span>OPERATIONS</span><strong>{pathname==="/sales"?"Sales":pathname==="/inventory"?"Inventory":pathname==="/procurement"?"Procurement":pathname==="/customers"?"Customers & Projects":pathname==="/deliveries"?"Deliveries":pathname==="/finance"?"Finance":pathname==="/approvals"?"Approvals":pathname==="/reports"?"Reports":pathname==="/admin"?"Administration":"Control room"}</strong></div>
    <label className="global-search"><Search size={17}/><input aria-label="Global search" placeholder="Search products, customers, orders…" /><kbd>⌘ K</kbd></label>
    <div className="top-actions"><button className="branch">Accra Central <ChevronDown size={14}/></button><button className="icon-btn" aria-label="Notifications"><Bell size={18}/><i/></button><div className="avatar">KA</div></div>
   </header>
   <div className="content">{children}</div>
   <footer className="app-footer"><span>Ghana Building Supply ERP</span><span>Accra Central · Operational data</span></footer>
  </main>
 </div>
}
