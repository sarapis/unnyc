---
# Research brief: CMS — the Centers for Medicare & Medicaid Services, the first
# U.S. federal OSPO. Third of the per-city briefs, same shape as
# content/briefs/munich.md (read that file's header for how these render).
# Loaded by getBrief('cms'); the matching case on /success is `cms` in
# content/success.md — the one case there that is a federal agency rather
# than a city, and the one with no banner photo yet.
#
# ⚠ SOURCE OF TRUTH SPLIT, per the handoff README: this file is canonical for
# the PROSE; content/ospo-catalogue/cms.json for the CATALOGUE. The handoff's
# "Catalogue" table is therefore NOT reproduced here.
#
# ⚠ §8's open questions are UNVERIFIED (handoff README). The savings figures
# in §2 are the office's own projections, as the text says.
case: cms
title: "CMS OSPO Brief"
subtitle: "How the first federal OSPO turned a ten-year-old memo into a public-domain toolkit, and what a chartered city office would add"
date: "October 2026"
catalogHref: /ospo-strategy#playbooks-cms
---

## Abstract

The Open Source Program Office at the Centers for Medicare & Medicaid Services is the first in the U.S. federal government and the only American public-sector OSPO on the international directory. Stood up in August 2023 inside the Digital Service at CMS and launched in January 2024, it took a federal policy that had been "sitting there" since 2016 and built the machinery to act on it: a tiered maturity model, release checklists, a repository scaffolder, a metrics dashboard and a full stack for complying with the SHARE IT Act, all published in the public domain. In June 2026 a Federal Register reorganization gave it a legal basis for the first time, as the Open Source Program Group inside a new Office of Health Technology and Products, with a mandate that at least 20% of newly developed custom code be released as open source. Its limits are specific: it owns the outbound work and none of the inbound. Licensing, release sign-off and the agency's own inbound review belong to other bodies. We think CMS is the best source of ready-made process for a New York office, and the clearest case for writing the procurement role into the founding act instead of leaving it to a functional statement.

## 1. Introduction

We chose CMS because it is American. It operates under the federal source code policy that any U.S. public body can borrow, it publishes everything it makes under CC0, and its lead has spoken at the UN's OSPOs for Good in New York. Nothing in the European cases can be lifted as directly.

It is also a case about durability. The office was created inside the U.S. Digital Service, held on through that agency's conversion into the "United States DOGE Service" and the firing of a third of its staff in 2025, and in June 2026 was reorganized into a group under a new parent office. Its tooling came through intact because it was public. Section 5 covers what the exposure cost, and Section 7 what New York can do so that a city office does not depend on the same luck.

## 2. Reasoning and benefits

The federal reasoning is written into OMB memorandum M-16-21, the 2016 Federal Source Code Policy. It requires agencies to run a three-step analysis before buying custom software, "intended to leverage existing solutions, consistent with principles of category management and shared services, and suitable commercial solutions, while mitigating unnecessary spending on custom-developed software solutions," and to release at least 20% of new custom code as open source (OMB 2016; CMS OSPO n.d.-f). The SHARE IT Act added an inventory of custom code and annual exemption reporting to Congress. CMS's own open source policy is pegged to the memo (CMS 2016). The case for open source at CMS is the federal case: taxpayers should not pay twice for the same code, and code paid for once should be available to every agency that needs it.

CMS turned that into working practice. Fletcher's framing at the launch was that "the policy has been sitting there" and the office existed to act on it (GovConWire 2023). What it produced is a complete kit in the public domain. The maturity model defines five tiers for a repository: private; one-time release; close collaboration; working in public; community governance (CMS OSPO n.d.-g). The repo-scaffolder provides cookiecutter templates, a tier-determiner script, repolinter rulesets and a release checklist per tier (DSACMS n.d.-a). The metrics dashboard pulls weekly from GitHub, integrates the CHAOSS project's Augur, and reports COCOMO cost estimates and "libyears" of dependency age as a technical-debt measure (DSACMS n.d.-b). The SHARE IT Act stack includes a web-form code.json generator, a GitHub Action that automates it, a command-line index generator, a savings calculator and repository archival tooling (CMS OSPO n.d.-c; DSACMS n.d.-c).

The office's calculator estimates a "94% reduction in processing time" for code.json compliance, "$752K saved in year one" and "$56,000,000" a year across government at 10% reuse (CMS OSPO n.d.-i). Those are projections, not audits, but the direction is the point: compliance got cheaper because the office built tools instead of writing memos. And because everything is CC0, a city can adopt the maturity model, the checklists and the metrics pipeline on day one and change only the names.

## 3. The OSPO

The founding date depends on who is counting. The FLOSS-PSO directory records August 1, 2023. In October 2023 Andrea Fletcher, CMS's Chief Digital Strategy Officer and director of the Digital Service at CMS, said "CMS is standing up this OSPO, Open Source Program Office. It's the first in the government" (GovConWire 2023). Federal News Network reports that CMS "officially launched its Open Source Program Office in January 2024" (Federal News Network 2024). We treat it as stood up in August 2023 and launched in January 2024.

For its first phase the office had no charter. It sat inside the Digital Service at CMS under Fletcher, and its basis was a functional statement: it "establishes and maintains guidance, policies, practices, and talent pipelines that advance equity, build trust, and amplify impact across CMS, HHS, and Federal Open Source Ecosystems by working and sharing openly" (CMS OSPO n.d.-a). Remy DeCausemaker leads it, titled "Open Source Lead, Digital Service at CMS.gov," with a team of about five: DeCausemaker, Dinne Kopelevich, Sachin Panayil, Natalia Luzuriaga and Isaac Milarsky, the last two originally U.S. Digital Corps fellows (Beeck Center 2025).

The second phase has a charter. A Statement of Organization, Functions, and Delegations of Authority published in the Federal Register on June 11, 2026 (91 FR 35478, signed by the HHS Secretary) creates an Office of Health Technology and Products with four components: the Open Source Program Group, the Standards and Interoperability Group, the Product Development Group, and the Digital Service at CMS. The group "coordinates the best-in-class private sector practices, talent, and technology to transform the way to openly share new technologies and deliver within and across CMS and the Department of Health and Human Services," and, "consistent with OMB Memorandum M-16-21, ensures that a minimum of 20% of newly developed custom code is released as open source software" (CMS 2026). Headcount after the reorganization is unverified.

The office's work divides into outbound and inbound, and it owns the first. Outbound is code release and inventory. Four tiers of release checklist require teams to "populate metadata in a code.json file per federal requirements" and to obtain sign-off from technical, business and security stakeholders before a repository goes public (CMS OSPO n.d.-b). The office built the agency's SHARE IT Act landing page and the code.json tooling that HHS and CMS use to inventory custom code (CMS OSPO n.d.-c). Its "Risk Acceptance and Exemption Criteria" page lists the categories under which code stays closed, personal and health information, national security and export control among them, and names the deciders: the information system security officer, the infrastructure group and business owners (CMS OSPO n.d.-d).

Inbound is where procurement lives. The office maintains an Inbound Review Checklist, "a review process to approve open source software to be used in the agency," which imports M-16-21's three-step analysis and the agency's rules that products already in use are preferred and that total cost of ownership governs (CMS OSPO n.d.-f; CMS 2026b). The sign-offs on that checklist are a code reviewer, the security officer, the infrastructure group and the business owner. The OSPO is not among them. Licensing is approved by the Technical Review Board, legal review belongs to the Office of General Counsel, and the Technical Reference Architecture "leads the open source software policy at CMS" (CMS 2016; CMS OSPO n.d.-e). Contract rights over code come from clauses written by the acquisitions office.

## 4. What worked

The metrics site tracks "249+ repositories"; the DSACMS GitHub organization itself holds 98 (DSACMS n.d.-b; n.d.-d). U.S. Digital Response reports that "at least four CMS open-source repositories have been released using this infrastructure" (USDR n.d.). DeCausemaker has said "we've already seen contributions coming in from the outside world" (GovConWire 2023) and was named a FedScoop 50 "Most Inspiring Up & Comer" in 2025 (FedScoop 2025). The ospo-guide site, with its inbound, outbound and growing sections and a page titled "Want to Start an OSPO," is a manual other offices can follow (CMS OSPO n.d.-h). The tooling held through a change of administration, the loss of a third of the parent agency's staff and a reorganization, because it was published in the public domain and lives on GitHub. And the reorganization that could have ended the office instead wrote the 20% release rule into its charter.

## 5. What did not

The office has never held a procurement decision. It wrote the agency's inbound checklist and does not sign it. The checklist also says "Initially, CMS will only consider OSS that has third-party vendor support for productization," and the June 2026 reorganization assigns the new parent office "acquisition oversight, including preference for commercial off-the-shelf and common contract solutions" (CMS OSPO n.d.-f; CMS 2026). There is no public log of exemptions: justifications go to OMB under M-16-21 and to Congress under the SHARE IT Act, and the code.json inventory marks each repository's usage type but publishes no register. No count of inbound reviews, procurement decisions influenced or proprietary purchases avoided has been published.

The political exposure was real. The parent U.S. Digital Service was renamed the "United States DOGE Service" on January 20, 2025, and "one-third of USDS employees were terminated via email on February 14" (Fortune 2025). DeCausemaker has noted the "limited four-year term for digital service members" (CHAOSS 2024). An office founded on a functional statement had nothing to hold it in place but its usefulness. Two and a half years passed before a charter arrived, and it arrived under a parent with the opposite procurement instinct, with the word "Office" changed to "Group."

## 6. Analysis

Open source did not fail at CMS. The office took a ten-year-old policy and made compliance cheap, published its work under terms anyone can reuse, and saw its mandate survive, written into a Federal Register notice, when the office itself was folded. What was missing was authority over the inbound side. CMS has an options analysis for software decisions, built on the federal policy; its OSPO does not sign it. The body that knows the open alternatives best is not in the room when the alternatives are weighed.

That is the pattern across our set, and CMS shows its American form. The UN's Open by Default principle needs someone to decide, case by case, what the default means and to keep the reasons. Munich is reaching that seat by coalition agreement. CMS shows what happens when the seat is never assigned: the checklist exists, the preference for commercial software is written into the parent's mandate, and no one keeps the record.

## 7. Implications for New York City

CMS gives New York three things. First, a domestic legal basis: M-16-21's three-step analysis and 20% release rule, and the SHARE IT Act's inventory and exemption reporting, are federal, but their structure translates directly into a city rule. Second, a complete process kit in the public domain: the maturity model, the tiered checklists, the exemption criteria, the metrics pipeline and the code.json tooling could be adopted by a NYC office in its first month, which is the Design for Reusability and Provide Documentation principles already done for us. Third, a demonstration of what an options analysis looks like when nobody owns it.

New York's version adds what CMS's charter leaves out. Put the inbound review in the office's hands: required review of technology contracts above a threshold, ownership of the options analysis that justifies a proprietary choice, and a public register of exceptions, so that Open by Default has an owner and a record. Create the office by legislation rather than functional statement, so that its mandate cannot be dissolved by memo; CMS's code outlived its office because it was public, and a city office should make its mandate as public as its code. And borrow the metrics discipline: an annual report on contracts reviewed, exceptions granted and code released would give New York the figures CMS has not published, and the PIT Crews supply the capacity a review role needs.

## 8. Limitations and open questions

The office's functions are from its own guide site, the agency's open source policy on GitHub and the Technical Reference Architecture. The June 2026 charter is the Federal Register notice as filed. Team composition is from a Beeck Center profile; press accounts supply the launch dates and quotations. The savings figures are the office's own calculator, not an audit.

### Open questions

- Launch date: August 2023 (directory) versus January 2024 (Federal News Network). State both.
- Headcount after the June 2026 reorganization, and whether DeCausemaker still leads the group.
- Whether the Office of Health Technology and Products is led by Amy Gleason; reported by a blog citing Healthcare Dive, not in the Federal Register notice.
- The "249+ repositories" metric versus 98 in the DSACMS organization; the larger figure likely spans CMSgov and other organizations. Confirm scope.
- The savings calculator figures are projections. Label them as such wherever used.
- The Federal News Network article's headline and author were not visible in the fetched page.
- Whether CMS presented at OSPOs for Good 2024; the UN agenda does not name it, only a GWU recap.
- No contract value for CMS's commercial software was sought; the brief makes no claim about it.

## Bibliography

Beeck Center. 2025. Kate Queram, "Sharing Is Caring: How CMS Is Leading on Federal Open Source Requirements. A FormFest 2025 Profile." Digital Government Hub, October 29, 2025. https://digitalgovernmenthub.org/publications/sharing-is-caring-how-cms-is-leading-on-federal-open-source-requirements-a-formfest-2025-profile/

CHAOSS. 2024. "CHAOSScast Episode 81: Managing Federal CHAOSS at CMS.gov." March 12, 2024. https://podcast.chaoss.community/81?t=0

CMS. 2016. *CMS Open Source Policy.* GitHub, CMSgov. https://github.com/CMSgov/cms-open-source-policy

CMS. 2026. "Statement of Organization, Functions, and Delegations of Authority." FR Doc. 2026-11743, 91 FR 35478, June 11, 2026. https://public-inspection.federalregister.gov/2026-11743.pdf

CMS. 2026b. "AD 0230 Open Source Business Rules." Technical Reference Architecture, 2026 Release 1. https://www.cms.gov/tra/Application_Development/AD_0230_Open_Source_Business_Rules.htm

CMS OSPO. n.d.-a. "Functional Statement." OSPO Guide. https://dsacms.github.io/ospo-guide/about/functional-statement/

CMS OSPO. n.d.-b. "Outbound Checklists." https://dsacms.github.io/ospo-guide/outbound/outbound-checklists/

CMS OSPO. n.d.-c. "SHARE IT Act" landing page. https://dsacms.github.io/share-it-act-lp/

CMS OSPO. n.d.-d. "Risk Acceptance and Exemption Criteria of Open Sourcing." https://dsacms.github.io/ospo-guide/outbound/exemption-criteria/

CMS OSPO. n.d.-e. "TRA." https://dsacms.github.io/ospo-guide/about/tra/

CMS OSPO. n.d.-f. "Inbound Review Checklist." https://dsacms.github.io/ospo-guide/inbound/inbound-review-checklist/

CMS OSPO. n.d.-g. "Maturity Models." https://dsacms.github.io/ospo-guide/outbound/maturity-models/

CMS OSPO. n.d.-h. "Want to Start an OSPO." https://dsacms.github.io/ospo-guide/growing/want-to-start-an-ospo/

CMS OSPO. n.d.-i. "share-it-savings." https://dsacms.github.io/share-it-savings/

DSACMS. n.d.-a. repo-scaffolder. GitHub. https://github.com/DSACMS/repo-scaffolder

DSACMS. n.d.-b. "CMS Open Source Repository Metrics." https://dsacms.github.io/metrics/

DSACMS. n.d.-c. codejson-index-generator. GitHub. https://github.com/DSACMS/codejson-index-generator

DSACMS. n.d.-d. GitHub organization. https://github.com/DSACMS

Federal News Network. 2024. [Cloud Exchange 2024 article on the CMS OSPO.] https://federalnewsnetwork.com/?p=5031845

FedScoop. 2025. "Remy DeCausemaker." FedScoop 50, September 5, 2025. https://develop.fedscoop.com/?p=86705

Fortune. 2025. Sharon Goldman, "Elon Musk Overhauled the Obama-Era Digital Services Agency and Turned It into DOGE." February 28, 2025. https://fortune.com/2025/02/28/elon-musk-doge-us-digital-service-betrayal-ex-employees

GovConWire. 2023. Summer Myatt, "Inside CMS' Ground-Breaking Open Source Program Office." October 31, 2023. https://www.govconwire.com/2023/10/inside-cms-ground-breaking-open-source-program-office/

OMB. 2016. *M-16-21: Federal Source Code Policy.* August 8, 2016. https://obamawhitehouse.archives.gov/sites/default/files/omb/memoranda/2016/m_16_21.pdf

USDR. n.d. "CMS Open Source Software." U.S. Digital Response case study. https://www.usdigitalresponse.org/case-studies/cms-open-source-software
