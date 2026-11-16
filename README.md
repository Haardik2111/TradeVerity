# TradeVerity — Intelligent Stock Market Fraud Detection & Investor Protection System

> **Verify Before You Invest.**

TradeVerity is an enterprise financial intelligence and investor protection platform designed to investigate potentially suspicious investment-related activities. It enables retail investors, cybercrime analysts, and regulatory compliance teams to submit, examine, and correlate unverified trading schemes, cloned APKs, impersonated advisors, and fraudulent payment endpoints.

The system analyzes submitted evidence using **explainable, deterministic rules**, **official public reference cross-checks**, and **cross-report entity correlation graphs**. It distinguishes verified facts, third-party reference data, user allegations, and inferred relationships—**never declaring guilt solely on a single heuristic indicator**.

---

## 1. Visual Identity — Obsidian Radar / Financial Intelligence

TradeVerity strictly implements the **Obsidian Radar** design palette approved in the Stitch design reference:

| Token | Hex Code | Purpose |
|---|---|---|
| **Root Background** | `#080C0A` | Main application backdrop |
| **Sidebar Background** | `#0B100D` | Left navigation shell |
| **Main Panel** | `#121915` | Dossier cards and primary panels |
| **Secondary Panel** | `#0E1311` | Nested surfaces & data tables |
| **Elevated Surface** | `#17211B` | Hover, selected states & metric boxes |
| **Border / Outlines** | `#28352D` | Thin dividers and subtle separators |
| **Primary Text** | `#E4EAE5` | Main high-contrast content |
| **Secondary Text** | `#9BA79F` | Supporting metadata and labels |
| **Primary Amber** | `#E27D42` | Primary calls to action & alert highlights |
| **Amber Hover** | `#F08E4F` | Interactive hover glow |
| **Emerald Green** | `#36B983` | Verified status & official references |
| **Muted Green** | `#1A3A2D` | Green-tinted surfaces & verification tags |
| **Danger Red** | `#D9685E` | Critical alert indicators |

### Typography
- **Inter / IBM Plex Sans**: Primary user interface font.
- **IBM Plex Mono**: Investigation IDs (`CRV-2026-8814`), hashes, UPI VPAs, and forensic telemetry.

---

## 2. Multi-Page Architecture & Route Map

The application features full client-side and server-side multi-page routing:

### Public Routes
- `/login`: Firebase email/password & Google Workspace sign-in with remember-me.
- `/register`: User onboarding with password strength validation and verification dispatch.
- `/forgot-password`: Cryptographic password recovery dispatch.
- `/verify-email`: Onboarding confirmation screen.

### Authenticated Routes (`/app`)
1. **Overview Radar** (`/app/overview`): Real-time threat radar, dynamic metric cards (Total Investigations, High Attention, Verified Entities, Pending Reviews), Live Intercepts table, Threat Distribution by medium, and Instant Entity Verification widget.
2. **New Investigation** (`/app/new-investigation`): Dynamic category-specific form, evidence file upload (PDF, PNG, JPG, TXT, CSV), indicator normalization, and instant heuristic analysis execution.
3. **Investigation History** (`/app/investigations`): Complete audit ledger with filtering by category, status, risk band, keyword search, sorting, and pagination.
4. **Investigation Details** (`/app/investigations/:caseId`): Deep case dossier displaying the 3 evaluation dimensions (*Risk Indicators*, *Evidence Confidence*, *Relationship Confidence*), pipeline timeline, explainable heuristic findings, official cross-checks, and downloadable PDF dossiers.
5. **Fraud Intelligence Network** (`/app/intelligence-network`): Signature interactive entity-relationship graph built on React Flow. Supports panning, zooming, node selection, cluster filters, and real-time dossier inspection.
6. **Entity Verification** (`/app/entity-verification`): Regulatory workspace querying SEBI Intermediary Registry, RBI Sachet, Exchange alerts, and RDAP Whois telemetry.
7. **Reports & Monitoring** (`/app/reports`): Report archive and server-side PDF generation streaming.
8. **Reviewer Workspace** (`/app/review-workspace`): Role-restricted triage desk for human analysts to review extracted indicators, accept/reject cluster links, and commit signed audit notes.
9. **Source Management** (`/app/source-management`): Admin workspace managing reference sources, freshness states (`LIVE`, `CACHED`, `DEMO`, `UNAVAILABLE`), and dataset versions.
10. **Settings & Profile** (`/app/settings`, `/app/profile`): User identity, Firebase UID linkage, data redaction parameters, and notification preferences.

---

## 3. Technology Stack

### Frontend
- **React 18** with **TypeScript** and **Vite 6**
- **React Router 6** for client-side routing and protected route guards
- **@xyflow/react** (React Flow) for interactive relationship graphs
- **Firebase Web SDK 11** for client authentication and Firestore user profile synchronization
- **Lucide React** for tactical line icons

### Backend
- **Java 21 / 23**
- **Spring Boot 3.3.5** (Web, Security, Validation, JDBC)
- **Spring JDBC (`JdbcTemplate`)** for explicit SQL queries, transactions, and row mappers
- **Firebase Admin SDK 9.3** for cryptographically verifying client ID tokens
- **OpenPDF 2.0.3** for real financial investigation PDF report generation
- **Flyway** for automated database schema migrations
- **PostgreSQL 16** (Production) / **H2 PostgreSQL-Compatibility Engine** (Dev/Test zero-friction mode)

---

## 4. Advanced Java Syllabus Demonstrations

1. **Object-Oriented Programming & Domain Architecture**:
   - Explicit domain models (`User`, `CaseReport`, `EvidenceItem`, `EntityRecord`, `EntityLink`, `SourceRecord`, `VerificationCheck`, `RiskAssessment`, `AuditEvent`, `ReviewerNote`).
2. **Inheritance & Polymorphism**:
   - `EvidenceAnalyzer` interface with polymorphic handlers: `UrlAnalyzer`, `PaymentUpiAnalyzer`, `TextAdvisoryAnalyzer`, and `RegistrationCodeAnalyzer`.
   - `VerificationProvider` interface implemented across regulatory sources: `SebiRegistryProvider`, `RbiSachetProvider`, `ExchangeAlertProvider`, and `DomainIntelProvider`.
3. **Rule-Based Fraud Detection Engine**:
   - `RiskRule` interface implemented as versioned rules:
     * `RULE-01`: Guaranteed or Assured Return Claims
     * `RULE-02`: Urgent Investment & Direct Payment Solicitation
     * `RULE-03`: Requests for Trading Passwords or Credentials
     * `RULE-04`: Claimed Financial Affiliation Mismatch
     * `RULE-05`: Suspicious Lookalike Domain Indicators
     * `RULE-06`: Repeated Reported Contact / Identifier
     * `RULE-07`: Missing or Mismatched Registration References
4. **Multithreading with Bounded Thread Pools**:
   - `FraudRuleEngine` utilizes a bounded `ExecutorService` (`Executors.newFixedThreadPool(4)`) to dispatch concurrent rule evaluation tasks using `Future` and timeouts.
5. **Spring Application Event Handling**:
   - Asynchronous decoupled events: `CaseSubmittedEvent`, `AnalysisCompletedEvent`, and `ReviewerActionEvent`.
   - `InvestigationEventListener` consumes events and writes permanent entries to `audit_events`.
6. **File Handling & Binary PDF Generation**:
   - `PdfReportService` constructs official multi-page PDF dossiers via OpenPDF with headers, metadata tables, explainable rule tables, and disclaimers.
7. **JDBC & Database Transactions**:
   - Clean, SQL-injection-proof prepared statements using Spring `JdbcTemplate`.

---

## 5. Getting Started & Running the Project

### Prerequisites
- **Node.js** (v20+ recommended)
- **Java** (JDK 21 or 23)
- **Maven** (included via `backend/mvnw.cmd` or portable Maven 3.9.9)

### Running the Frontend
```bash
cd "d:\Trade Verity\frontend"
npm install
npm run dev
```
The frontend will start at `http://localhost:5173`.

### Running the Backend
```bash
cd "d:\Trade Verity\backend"
.\mvnw.cmd spring-boot:run
```
The backend starts at `http://localhost:8080`.
By default, the backend operates in `dev` profile with embedded H2 PostgreSQL-compatible mode and executes all `V1__init_schema.sql` and `V2__seed_demo_data.sql` Flyway migrations automatically.

To run with local PostgreSQL:
```bash
# Set environment variables or activate postgres profile:
$env:SPRING_PROFILES_ACTIVE="postgres"
.\mvnw.cmd spring-boot:run
```

### Running with Docker Compose
```bash
docker-compose up --build
```

---

## 6. Demonstration Credentials & Test Accounts

You can test any role immediately:

| Account | Email | Password | Role | Description |
|---|---|---|---|---|
| **Arjun Mehta** | `arjun.mehta@tradeverity.internal` | `TradeVerity2026!` | `REVIEWER` | Senior RedTeam Security Analyst |
| **Priya Sharma** | `priya.investor@example.com` | `TradeVerity2026!` | `INVESTOR` | Standard retail investor |
| **Chief Security Officer** | `admin@tradeverity.internal` | `TradeVerity2026!` | `ADMIN` | System and source administrator |

*A demo role switcher is also available in the bottom-left sidebar to instantly test privileged routes in development.*
