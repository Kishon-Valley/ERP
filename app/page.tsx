"use client";

import { useState } from "react";
import {
  BarChart3, Bell, Boxes, ChevronDown, CircleDollarSign, ClipboardCheck,
  FileText, Home, Menu, PackageSearch, Search, Settings, Truck,
  Users, X, ArrowUpRight, ArrowDownRight, MoreHorizontal
} from "lucide-react";

const nav = [
  { label: "Dashboard", icon: Home, active: true },
  { label: "Sales", icon: CircleDollarSign },
  { label: "Inventory", icon: Boxes },
  { label: "Procurement", icon: PackageSearch },
  { label: "Customers & Projects", icon: Users },
  { label: "Deliveries", icon: Truck },
  { label: "Finance", icon: FileText },
  { label: "Reports", icon: BarChart3 },
  { label: "Approvals", icon: ClipboardCheck, badge: 4 },
];

const stock = [
  { sku: "CEM-42.5-50", name: "Ghacem Cement 42.5R — 50kg", onHand: "1,248", reserved: "216", available: "1,032", status: "Healthy" },
  { sku: "REB-12-12M", name: "Rebar 12mm — 12m", onHand: "684", reserved: "94", available: "590", status: "Healthy" },
  { sku: "BLK-6-STD", name: "6-inch Sandcrete Block", onHand: "8,420", reserved: "1,860", available: "6,560", status: "Watch" },
  { sku: "PNT-EM-WHT", name: "Emulsion Paint — White 20L", onHand: "84", reserved: "12", available: "72", status: "Low" },
];

function Metric({title,value,delta,up}:{title:string,value:string,delta:string,up?:boolean}) {
  return <div className="metric card">
    <div className="metric-label">{title}</div>
    <div className="metric-value">{value}</div>
    <div className={up ? "delta positive" : "delta"}>{up ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {delta}</div>
  </div>;
}

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return <div className="app-shell">
    <aside className={mobileOpen ? "sidebar open" : "sidebar"}>
      <div className="brand"><div className="brand-mark">CV</div><div><strong>Construction ERP</strong><span>Operations Platform</span></div><button className="mobile-close" onClick={()=>setMobileOpen(false)}><X size={18}/></button></div>
      <div className="workspace"><span>Organization</span><button>Ghana Building Supply <ChevronDown size={15}/></button></div>
      <nav>{nav.map(({label,icon:Icon,active,badge})=><a className={active?"nav-item active":"nav-item"} key={label} href="#"><Icon size={18}/><span>{label}</span>{badge && <b>{badge}</b>}</a>)}</nav>
      <div className="sidebar-footer"><a className="nav-item"><Settings size={18}/><span>Administration</span></a><div className="user"><div className="avatar">KA</div><div><strong>K. Admin</strong><span>Org Administrator</span></div><MoreHorizontal size={17}/></div></div>
    </aside>

    <main className="main">
      <header className="topbar">
        <button className="icon-btn mobile-menu" onClick={()=>setMobileOpen(true)}><Menu size={20}/></button>
        <div className="search"><Search size={18}/><input placeholder="Search products, customers, invoices, orders…" /><kbd>⌘ K</kbd></div>
        <div className="top-actions"><button className="branch">Accra Central <ChevronDown size={15}/></button><button className="icon-btn"><Bell size={19}/><i/></button><div className="avatar">KA</div></div>
      </header>

      <div className="content">
        <div className="page-heading"><div><div className="eyebrow">HQ OPERATIONS</div><h1>Dashboard</h1><p>Operational overview across branches, inventory, sales and receivables.</p></div><button className="primary">New Sale <span>+</span></button></div>

        <section className="metrics">
          <Metric title="Today's Sales" value="GH₵ 184,620" delta="12.8% vs yesterday" up />
          <Metric title="Orders Today" value="126" delta="8.4% vs yesterday" up />
          <Metric title="Available Stock Value" value="GH₵ 6.42M" delta="2.1% vs last week" up />
          <Metric title="Receivables" value="GH₵ 1.84M" delta="5.7% vs last week" />
        </section>

        <section className="grid-two">
          <div className="card panel">
            <div className="panel-head"><div><h2>Sales performance</h2><span>Last 7 days · all branches</span></div><button className="select">This week <ChevronDown size={14}/></button></div>
            <div className="chart"><div className="y-labels"><span>250k</span><span>200k</span><span>150k</span><span>100k</span><span>50k</span><span>0</span></div><div className="bars">{[58,72,64,86,78,92,81].map((h,i)=><div className="bar-col" key={i}><div className="bar" style={{height:h+"%"}}/><span>{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}</span></div>)}</div></div>
          </div>
          <div className="card panel">
            <div className="panel-head"><div><h2>Branch activity</h2><span>Sales posted today</span></div><a>View all</a></div>
            <div className="branch-list">{[
              ["Accra Central","GH₵ 62,480","38 orders"],["Tema","GH₵ 41,220","29 orders"],["Kumasi","GH₵ 35,810","24 orders"],["Takoradi","GH₵ 27,940","21 orders"],["Sunyani","GH₵ 17,170","14 orders"]
            ].map(x=><div className="branch-row" key={x[0]}><div className="branch-dot"/><div><strong>{x[0]}</strong><span>{x[2]}</span></div><b>{x[1]}</b></div>)}</div>
          </div>
        </section>

        <section className="card panel inventory">
          <div className="panel-head"><div><h2>Inventory watchlist</h2><span>Products requiring operational attention</span></div><button className="secondary">Open inventory</button></div>
          <div className="table-wrap"><table><thead><tr><th>Product</th><th>On hand</th><th>Reserved</th><th>Available</th><th>Status</th></tr></thead><tbody>{stock.map(s=><tr key={s.sku}><td><strong>{s.name}</strong><span>{s.sku}</span></td><td>{s.onHand}</td><td>{s.reserved}</td><td><b>{s.available}</b></td><td><span className={"status "+s.status.toLowerCase()}>{s.status}</span></td></tr>)}</tbody></table></div>
        </section>
      </div>
    </main>
  </div>;
}
