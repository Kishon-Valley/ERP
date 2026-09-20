# Construction ERP

Production-oriented multi-branch construction materials ERP UI.

## Current milestone
Phase B — responsive ERP shell and executive dashboard.

## Architecture direction
Next.js App Router + TypeScript. UI boundaries are intentionally separated from future application services, PostgreSQL/Neon persistence, RBAC, inventory ledger, sales, procurement, delivery and finance modules.

## Design principles
- Operational correctness over decorative UI
- Dense, readable enterprise data surfaces
- Responsive HQ and branch workflows
- Accessible controls and clear status semantics
- No client-side authority for financial, stock or permission decisions
