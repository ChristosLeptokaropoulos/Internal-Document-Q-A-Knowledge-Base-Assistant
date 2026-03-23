export const sampleDocuments = [
  {
    title: "digital-campaign-launch-process",
    fileType: "md",
    content: `# Digital Campaign Launch Process

## Standard Operating Procedure (SOP)

### 1. Overview
This document outlines the end-to-end process for launching digital marketing campaigns across all therapeutic areas. All campaigns must follow this process to ensure brand consistency, regulatory compliance, and proper tracking implementation.

### 2. Campaign Types
- **HCP (Healthcare Professional) Campaigns**: Targeting physicians, pharmacists, and other licensed healthcare providers
- **DTC (Direct-to-Consumer) Campaigns**: Patient-facing awareness and education campaigns
- **Medical Education**: CME-accredited content and clinical data dissemination
- **Disease Awareness**: Unbranded educational content about therapeutic areas

### 3. Pre-Launch Requirements

#### 3.1 Creative Brief
All campaigns require a completed creative brief submitted to the Brand Team at least 30 business days before the target launch date. The brief must include:
- Campaign objectives and KPIs
- Target audience segmentation
- Key messages (consistent with approved brand messaging)
- Channel selection rationale
- Budget allocation by channel
- Proposed timeline

#### 3.2 Content Development
Content must be developed in alignment with the approved Product Label and ISI (Important Safety Information). All promotional materials must include:
- Fair balance between efficacy and safety information
- ISI placement according to regulatory guidelines
- Proper trademark usage and brand identity elements
- References to clinical data with proper citations

### 4. Review and Approval Process

#### 4.1 Review Cycle Timeline
- **Round 1**: Internal brand team review (3 business days)
- **Round 2**: Medical/Legal/Regulatory (MLR) review (5 business days)
- **Round 3**: Final approval with all stakeholder sign-off (2 business days)
- **Total minimum timeline**: 10 business days from content submission to approval

#### 4.2 MLR Review Requirements
All promotional materials must go through MLR review. The following must be submitted:
- Final creative assets in all formats
- Copy deck with all claims annotated
- Source documentation for all clinical claims
- Digital mockups showing ISI placement
- Audience targeting criteria for review

#### 4.3 Expedited Review
Expedited review (48 hours) is available for:
- Safety communications
- Product recall communications
- Competitive response materials (requires VP approval)

### 5. Technical Implementation

#### 5.1 Tracking Setup
All digital campaigns must implement:
- UTM parameters following the corporate taxonomy
- Conversion pixels on all landing pages
- Call tracking numbers for phone-based CTAs
- Custom event tracking for engagement metrics

#### 5.2 Landing Page Requirements
- HTTPS required on all pages
- ADA/WCAG 2.1 AA compliance
- Mobile-responsive design
- Page load time under 3 seconds
- Cookie consent management implementation
- ISI must be accessible without scrolling on desktop

### 6. Post-Launch Monitoring
- Daily performance monitoring for the first 5 business days
- Weekly performance reports distributed to stakeholders
- Monthly optimization reviews with agency partners
- Quarterly business reviews with brand team leadership

### 7. Budget and Reporting
Campaign budgets are tracked through the Marketing Resource Management (MRM) system. All spend must be:
- Pre-approved through the annual brand planning process
- Coded to the correct cost center and therapeutic area
- Reconciled monthly with agency invoices
- Reported in the quarterly marketing effectiveness dashboard
`,
  },
  {
    title: "ai-governance-framework",
    fileType: "md",
    content: `# AI Governance Framework

## Enterprise AI Development and Deployment Guidelines

### 1. Purpose
This framework establishes guidelines for the responsible development, deployment, and monitoring of artificial intelligence and machine learning systems across the organization. It ensures that AI initiatives align with our corporate values, regulatory obligations, and ethical commitments.

### 2. Scope
This framework applies to:
- All internally developed AI/ML models
- Third-party AI tools and platforms
- AI-powered features in commercial products
- Research and development AI applications
- Generative AI usage by employees

### 3. Risk Classification

#### 3.1 Low Risk
- Internal process automation (document classification, data entry)
- Business intelligence dashboards with ML-powered insights
- Predictive maintenance for IT infrastructure
- Approval requirement: Team Lead + AI Governance Board notification

#### 3.2 Medium Risk
- Customer-facing chatbots and virtual assistants
- HCP engagement scoring and segmentation models
- Predictive analytics for commercial operations
- Claims processing automation
- Approval requirement: AI Governance Board review + approval

#### 3.3 High Risk
- Patient-facing AI applications
- Clinical decision support tools
- AI systems that influence drug safety assessments
- Models that process Protected Health Information (PHI)
- Approval requirement: AI Governance Board + Legal + Compliance + Executive Sponsor

### 4. Development Standards

#### 4.1 Data Requirements
- All training data must be documented in the Data Catalog
- Data lineage must be traceable and auditable
- PII and PHI must be de-identified before use in model training
- Synthetic data should be considered when real data poses privacy risks
- Data bias assessments must be completed before model training

#### 4.2 Model Development
- All models must be version-controlled in the enterprise ML platform
- Model cards must be completed documenting purpose, training data, performance metrics, and known limitations
- Bias testing must be performed across relevant demographic categories
- Explainability requirements must be defined based on risk level

#### 4.3 Testing and Validation
- Unit tests for all data preprocessing pipelines
- A/B testing protocols for customer-facing models
- Performance benchmarking against established baselines
- Adversarial testing for high-risk applications
- Human-in-the-loop validation for medium and high-risk deployments

### 5. Approved AI Tools and Platforms

#### 5.1 Approved for General Use
- Microsoft Copilot (with enterprise data protection)
- Tableau AI for business analytics
- Internal ML platform (custom models)
- Grammarly Business (non-confidential content only)

#### 5.2 Approved with Restrictions
- OpenAI API (server-side only, no PHI/PII, approved use cases only)
- AWS Bedrock (approved models only, VPC-deployed)
- Google Cloud Vertex AI (specific projects with security review)

#### 5.3 Prohibited
- Consumer-grade AI tools for business data (ChatGPT free, Bard, etc.)
- AI tools that store/train on company data without DPA
- Open-source models deployed without security review
- AI-generated content in regulatory submissions without human review

### 6. Monitoring and Compliance

#### 6.1 Model Monitoring
- Performance drift detection must be implemented for all production models
- Monthly model performance reports to the AI Governance Board
- Automated alerts for performance degradation beyond defined thresholds
- Quarterly model retraining assessments

#### 6.2 Audit Trail
- All AI model decisions must be logged with timestamps and input features
- Model versions must be immutably recorded
- Access to AI systems must follow role-based access control (RBAC)
- Annual audit of all AI systems by Internal Audit team

### 7. Incident Response
- AI-related incidents must be reported within 2 hours of discovery
- Incident severity classification follows the enterprise incident management framework
- Post-incident review required for all medium and high-severity incidents
- Lessons learned must be shared with the AI Governance Board
`,
  },
  {
    title: "vendor-agency-onboarding-procedure",
    fileType: "md",
    content: `# Vendor & Agency Onboarding Procedure

## Third-Party Partner Management Process

### 1. Overview
This procedure defines the requirements and steps for onboarding new vendors and agency partners. It ensures that all third parties meet our security, compliance, and operational standards before engaging in business activities.

### 2. Vendor Categories

#### 2.1 Strategic Partners
Long-term engagements exceeding $500K annually or involving access to sensitive data:
- Creative agencies of record
- Media buying agencies
- CRM and marketing technology platforms
- Data analytics providers

#### 2.2 Tactical Vendors
Project-based or specialized engagements:
- Freelance designers and copywriters
- Event management companies
- Market research firms
- Translation and localization services

#### 2.3 Technology Vendors
Software and technology service providers:
- SaaS platforms
- Cloud infrastructure providers
- API and integration partners
- Managed service providers

### 3. Onboarding Process

#### 3.1 Step 1: Business Case and Procurement Request (5 business days)
- Submit vendor request through the Procurement Portal
- Include business justification and estimated contract value
- Identify budget owner and cost center
- Obtain line manager approval for engagements under $100K
- Obtain VP approval for engagements over $100K

#### 3.2 Step 2: Security Assessment (10 business days)
All vendors must complete the security assessment questionnaire covering:
- Information security policies and certifications (SOC 2, ISO 27001)
- Data handling and encryption practices
- Employee background check procedures
- Incident response capabilities
- Business continuity and disaster recovery plans
- Sub-processor management

For vendors with access to PHI: HIPAA Business Associate Agreement (BAA) required.
For vendors with access to EU data: Data Processing Agreement (DPA) with Standard Contractual Clauses.

#### 3.3 Step 3: Legal Review (7 business days)
- Master Services Agreement (MSA) review and negotiation
- Statement of Work (SOW) finalization
- Insurance requirements verification:
  - General liability: $2M minimum
  - Professional liability: $5M minimum
  - Cyber liability: $10M minimum for technology vendors
- IP ownership and work-for-hire clauses
- Termination and transition provisions
- Non-disclosure agreement execution

#### 3.4 Step 4: Compliance Review (5 business days)
- Anti-bribery and corruption due diligence
- Sanctions screening (OFAC, EU sanctions lists)
- Conflict of interest disclosure
- Code of conduct acknowledgment
- For HCP-facing vendors: Transparency reporting requirements (Sunshine Act)

#### 3.5 Step 5: Technical Integration (variable)
- Access provisioning through Identity Management system
- VPN setup for vendors requiring network access
- API credentials and sandbox environment setup
- Training on internal systems and workflows
- Documentation of all access points and data flows

### 4. Ongoing Management

#### 4.1 Performance Reviews
- Quarterly business reviews for strategic partners
- Annual performance scorecards
- SLA compliance tracking
- Issue escalation procedures

#### 4.2 Annual Renewal Requirements
- Updated security assessment
- Insurance certificate renewal
- Contract review and amendment as needed
- Performance evaluation summary

### 5. Offboarding
When a vendor relationship ends:
- All access credentials must be revoked within 24 hours
- Company data must be returned or certified as destroyed within 30 days
- Final invoice reconciliation within 60 days
- Post-engagement review and lessons learned documentation
- Update vendor registry status to "Inactive"
`,
  },
  {
    title: "data-analytics-standards",
    fileType: "md",
    content: `# Data & Analytics Standards

## Enterprise Marketing Analytics Framework

### 1. Purpose
This document establishes the standards for data collection, analysis, and reporting across all marketing channels. It ensures consistency in measurement, enables cross-channel attribution, and supports data-driven decision making.

### 2. Tracking Taxonomy

#### 2.1 UTM Parameter Standards
All digital campaign URLs must follow this UTM structure:
- utm_source: Platform name (google, meta, linkedin, email, programmatic)
- utm_medium: Channel type (cpc, display, social, email, video)
- utm_campaign: Campaign identifier format: [brand]-[therapeutic-area]-[campaign-name]-[quarter]-[year]
- utm_content: Creative variant identifier
- utm_term: Keyword or targeting criteria (paid search only)

Example: ?utm_source=meta&utm_medium=social&utm_campaign=brandx-oncology-awareness-q1-2024&utm_content=video-30s-v2

#### 2.2 Internal Event Taxonomy
Custom events must follow the naming convention: [category]_[action]_[label]
- page_view_landing: Landing page view
- content_download_whitepaper: Whitepaper download
- video_play_start: Video playback initiated
- video_play_complete: Video watched to completion
- form_submit_contact: Contact form submission
- hcp_engage_sample_request: HCP sample request
- hcp_engage_rep_connect: HCP request to connect with sales rep

### 3. KPI Definitions by Channel

#### 3.1 Paid Search
- **Impressions**: Number of times ad was displayed
- **Clicks**: Number of clicks on ad (excluding invalid clicks)
- **CTR**: Click-through rate = Clicks / Impressions
- **CPC**: Cost per click = Total Spend / Clicks
- **Conversions**: Defined actions completed (downloads, sign-ups, HCP registrations)
- **CPA**: Cost per acquisition = Total Spend / Conversions
- **ROAS**: Return on ad spend = Revenue attributed / Total Spend

#### 3.2 Programmatic Display
- **Viewable Impressions**: Impressions meeting MRC viewability standard (50% of pixels in view for 1 second)
- **Viewability Rate**: Viewable Impressions / Total Impressions
- **Frequency**: Average number of times a unique user sees the ad
- **Reach**: Unique users exposed to the campaign
- **Brand Lift**: Incremental change in brand awareness/consideration (survey-based)

#### 3.3 Email Marketing
- **Delivery Rate**: Emails Delivered / Emails Sent
- **Open Rate**: Unique Opens / Emails Delivered
- **Click Rate**: Unique Clicks / Emails Delivered
- **CTOR**: Click-to-open rate = Unique Clicks / Unique Opens
- **Unsubscribe Rate**: Unsubscribes / Emails Delivered (alert threshold: >0.5%)
- **List Growth Rate**: (New Subscribers - Unsubscribes) / Total List Size

#### 3.4 Social Media
- **Engagement Rate**: (Likes + Comments + Shares) / Impressions
- **Share of Voice**: Brand Mentions / Total Category Mentions
- **Sentiment Score**: Positive mentions / Total mentions (target: >70%)
- **Follower Growth Rate**: Net new followers / Total followers

### 4. HCP Engagement Scoring Model

#### 4.1 Scoring Criteria
HCP engagement is scored on a 0-100 scale based on digital interactions:

| Activity | Points | Decay Period |
|----------|--------|-------------|
| Website visit (authenticated) | 5 | 30 days |
| Resource download | 10 | 60 days |
| Webinar registration | 15 | 90 days |
| Webinar attendance | 25 | 90 days |
| Sample request | 30 | 120 days |
| Rep meeting request | 35 | 120 days |
| Conference booth scan | 20 | 90 days |
| Email click | 5 | 30 days |
| Portal login | 3 | 14 days |

#### 4.2 Engagement Tiers
- **Highly Engaged** (75-100): Priority for personalized outreach
- **Engaged** (50-74): Target for nurture campaigns
- **Passive** (25-49): Include in awareness campaigns
- **Inactive** (0-24): Re-engagement or suppression candidates

#### 4.3 Score Decay
Engagement scores decay over time to reflect recency:
- Scores older than the decay period are reduced by 50%
- Scores older than 2x the decay period are removed
- Minimum score is always 0

### 5. Dashboard Requirements

#### 5.1 Executive Dashboard (Monthly)
- Total marketing spend vs. budget
- Channel-level ROI comparison
- Top-performing campaigns by therapeutic area
- HCP engagement trend (rolling 12 months)
- Pipeline influence attribution

#### 5.2 Campaign Performance Dashboard (Weekly)
- Impressions, clicks, conversions by channel
- Spend pacing vs. budget
- Creative performance comparison
- Audience performance by segment
- Geographic performance heatmap

#### 5.3 HCP Engagement Dashboard (Real-time)
- Total HCPs by engagement tier
- Engagement score distribution
- Top-engaged HCPs by therapeutic area
- Channel contribution to engagement score
- Rep activity correlation with digital engagement

### 6. Data Governance

#### 6.1 Data Retention
- Campaign performance data: 3 years
- Individual-level tracking data: 18 months
- HCP engagement scores: Rolling 24 months
- Aggregated analytics: Indefinite

#### 6.2 Privacy Compliance
- All tracking must comply with applicable privacy regulations (GDPR, CCPA, HIPAA)
- Cookie consent must be obtained before non-essential tracking
- Data Subject Access Requests (DSARs) must be fulfilled within 30 days
- Annual Privacy Impact Assessment for marketing data systems
`,
  },
];
