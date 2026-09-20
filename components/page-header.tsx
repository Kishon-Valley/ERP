import Link from "next/link";
export function PageHeader({eyebrow,title,description,action,href="/sales"}:{eyebrow:string,title:string,description:string,action?:string,href?:string}){
 return <header className="page-heading">
   <div className="heading-copy"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>
   {action && <Link className="primary-action" href={href}>{action}<span aria-hidden="true">+</span></Link>}
 </header>
}
