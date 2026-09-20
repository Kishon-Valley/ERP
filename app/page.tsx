import { PageHeader } from "@/components/page-header";
import { KpiStrip, SectionHeader, FlatTable, Status, QuickLink } from "@/components/erp-ui";

const branches=[["Accra Central","GH₵ 62,480","38 orders"],["Tema","GH₵ 41,220","29 orders"],["Kumasi","GH₵ 35,810","24 orders"],["Takoradi","GH₵ 27,940","21 orders"],["Sunyani","GH₵ 17,170","14 orders"]];
const stock=[["Ghacem Cement 42.5R — 50kg","CEM-42.5-50","1,248","216","1,032","Healthy"],["Rebar 12mm — 12m","REB-12-12M","684","94","590","Healthy"],["6-inch Sandcrete Block","BLK-6-STD","8,420","1,860","6,560","Watch"],["Emulsion Paint — White 20L","PNT-EM-WHT","84","12","72","Low"]];

export default function Dashboard(){
 return <><PageHeader eyebrow="HQ OPERATIONS / 20 SEP 2026" title="Control room" description="A single operating view of sales, stock, branch activity and receivables." action="New sale"/>
 <KpiStrip items={[{label:"Sales today",value:"GH₵ 184,620",detail:"↑ 12.8% vs yesterday",tone:"good"},{label:"Orders",value:"126",detail:"14 awaiting fulfilment"},{label:"Available stock",value:"GH₵ 6.42M",detail:"17 items below threshold",tone:"warn"},{label:"Receivables",value:"GH₵ 1.84M",detail:"GH₵ 286,420 overdue",tone:"bad"}]}/>
 <section className="dashboard-grid">
  <div className="work-surface"><SectionHeader eyebrow="COMMERCIAL / 7 DAYS" title="Sales run-rate" description="Posted sales across all branches." actions={<button className="filter-control">This week⌄</button>}/>
   <div className="trend"><div className="trend-axis">{["250k","200k","150k","100k","50k","0"].map(x=><span key={x}>{x}</span>)}</div><div className="trend-plot">{[58,72,64,86,78,92,81].map((h,i)=><div key={i} className="trend-bar" style={{height:h+"%"}}><span className="trend-day" style={{left:(i+0.5)*14.28+"%"}}>{["M","T","W","T","F","S","S"][i]}</span></div>)}</div></div>
  </div>
  <div className="work-surface"><SectionHeader eyebrow="BRANCHES / TODAY" title="Branch activity" description="Posted sales by operating location."/><div className="branch-list">{branches.map((x,i)=><div className="branch-row" key={x[0]}><span className="branch-rank">0{i+1}</span><div><strong>{x[0]}</strong><span>{x[2]}</span></div><b>{x[1]}</b></div>)}</div></div>
 </section>
 <section className="watchlist"><SectionHeader eyebrow="INVENTORY / ATTENTION" title="Stock watchlist" description="Items where available quantity needs an operational decision." actions={<QuickLink href="/inventory" label="Open inventory" meta="Stock control" />}/><FlatTable columns={["Product","On hand","Reserved","Available","State"]} rows={stock.map(s=>[<><strong>{s[0]}</strong><small>{s[1]}</small></>,s[2],s[3],<strong>{s[4]}</strong>,<Status tone={s[5]==="Healthy"?"good":s[5]==="Watch"?"warn":"bad"}>{s[5]}</Status>])}/></section>
 </>;
}