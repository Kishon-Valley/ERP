import Link from "next/link";
import type { ReactNode } from "react";

export function KpiStrip({items}:{items:Array<{label:string;value:string;detail?:string;tone?:"neutral"|"good"|"warn"|"bad"}>}) {
  return <div className="kpi-strip" aria-label="Key performance indicators">
    {items.map(item => <div className="kpi" key={item.label}>
      <span className="kpi-label">{item.label}</span>
      <strong className="kpi-value">{item.value}</strong>
      {item.detail && <span className={"kpi-detail "+(item.tone ?? "neutral")}>{item.detail}</span>}
    </div>)}
  </div>;
}

export function SectionHeader({eyebrow,title,description,actions}:{eyebrow?:string;title:string;description?:string;actions?:ReactNode}) {
  return <div className="section-header">
    <div><h2>{title}</h2>{description && <p>{description}</p>}{eyebrow && <span>{eyebrow}</span>}</div>
    {actions && <div className="section-actions">{actions}</div>}
  </div>;
}

export function FlatTable({columns,rows}:{columns:string[];rows:ReactNode[][]}) {
  return <div className="data-table-wrap"><table className="data-table"><thead><tr>{columns.map(c=><th key={c}>{c}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

export function Status({children,tone="neutral"}:{children:ReactNode;tone?:"neutral"|"good"|"warn"|"bad"|"info"}) {
  return <span className={"status status-"+tone}><i aria-hidden="true"/>{children}</span>;
}

export function PageTabs({items,active}:{items:string[];active:string}) {
  return <nav className="page-tabs" aria-label="Section views">{items.map(item=><button key={item} className={item===active?"active":""}>{item}</button>)}</nav>;
}

export function QuickLink({href,label,meta}:{href:string;label:string;meta:string}) {
  return <Link href={href} className="quick-link"><span>{label}</span><small>{meta}</small><b aria-hidden="true">→</b></Link>;
}
