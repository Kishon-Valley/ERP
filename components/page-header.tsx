import Link from "next/link";
export function PageHeader({eyebrow,title,description,action,href="/sales"}:{eyebrow:string,title:string,description:string,action?:string,href?:string}){
 return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action&&<Link className="primary" href={href}>{action} <span>+</span></Link>}</div>
}
