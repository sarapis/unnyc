---
# Research brief: the European Commission — fourth of the per-case OSPO
# briefs, same shape as content/briefs/munich.md (read that file's header for
# how these render). Loaded by getBrief('ec'); the matching case on /success
# is `ec` in content/success.md — supranational, and like CMS without a
# banner photo yet.
#
# ⚠ SOURCE OF TRUTH SPLIT, per the handoff README: this file is canonical for
# the PROSE; content/ospo-catalogue/ec.json for the CATALOGUE. The handoff's
# "Catalogue" table is therefore NOT reproduced here.
#
# ⚠ §8's open questions are UNVERIFIED (handoff README). Note the first one:
# an earlier draft of the campaign's materials cited the 2021 Decision as
# "2021/2228", which is wrong — it is C(2021) 8759, OJ 2021/C 495 I/01.
case: ec
title: "European Commission OSPO Brief"
subtitle: "How the Commission built Europe's public code commons and its OSPO network, and what a city office should add to the preference clause"
date: "October 2026"
catalogHref: /ospo-strategy#playbooks-ec
---

## Abstract

The European Commission's Open Source Programme Office was called for by the Commission's 2020 open source strategy as "the pivotal point" of that strategy, given a legal basis for publishing code by a Commission Decision of December 2021, and placed in the Directorate-General for Digital Services. It runs code.europa.eu, the EU Open Source Solutions Catalogue, an inner-source program and an engagement calendar, and it is the secretariat of the EU OSPO Network, which connects public-sector OSPOs across the member states and which Paris co-founded. In four years it has put 737 repositories on a shared code platform, raised the share of open internal repositories from about 10% to more than 30%, and federated nine national catalogues into one. Its procurement rule is a conditional preference: "open-source solutions will be preferred when equivalent in functionalities, total cost and cybersecurity." No source shows the office reviewing procurements, running options analyses or keeping a register of exceptions, and the Commission stayed on Microsoft 365 through a 2024 data-protection enforcement it resolved by remediation. We think the EC is the model for publication and reuse at scale, the host of the network a city OSPO wants to be near, and the clearest case that a preference clause needs an owner.

## 1. Introduction

We chose the Commission because it is the largest public-sector OSPO in our set by reach and the one with the most explicit founding documents: a strategy that names the office, a Decision that gives its work a legal basis, and a network that it runs for everyone else. If New York wants to know what an office looks like when publishing and reuse are done at scale, this is the case.

It is also the case where the limit is easiest to see. The strategy's procurement rule is a preference, the office is its custodian, and when the Commission's own dependence on Microsoft was tested by a regulator, the office had no part in the answer. Section 5 covers that, and Section 7 what a New York office should write into its founding act so that the preference has someone to apply it.

## 2. Reasoning and benefits

The Commission's reasons are in its *Open Source Software Strategy 2020-2023, "Think Open,"* Communication C(2020) 7149, adopted October 21, 2020. The strategy treats open source as a route to digital autonomy, as a way to save money by sharing and reusing code across institutions and member states, and as a way to get more secure software by making it open to inspection; it commits the Commission to "think open" by default, to share and reuse its own code, to contribute to the projects it depends on, and to use open source to stay in control of its own technology (European Commission 2020a). It says "the pivotal point will be an Open Source Programme Office that enjoys genuine political and organisational support, involving all directorates-general," and that DG DIGIT "will make an annual budget request for the Programme Office and the action plan" (European Commission 2020a).

The benefits are measurable in what the office built. Code.europa.eu, launched in September 2022 on a GitLab Ultimate instance obtained at "€0 cost license," held "214 main projects" and "737 code repositories" by December 2024 (EC OSPO 2024). The share of internal repositories open to other Commission services rose from about 10% in 2021 to "more than 30%," with a target to "increase 5% every year until we get to 90%" (OSOR 2026). The EU Open Source Solutions Catalogue, launched March 31, 2025 with the Interoperable Europe programme, started with "over 640 solutions" federated from five national catalogues and drew on nine by January 2026, so that a solution built in one member state is findable in all of them (European Commission 2025; OSOR 2026). The office runs open source labs for tools such as Jitsi, CryptPad and Discourse, bug bounties and hackathons, and has worked on "integrating open source into IT governance tools via PM² guidelines," the Commission's project management method (OSOR 2026; OSPO Alliance 2025a). And it gave Europe's public-sector offices a place to meet: the EU OSPO Network, 28 members strong, which did not exist before 2022.

## 3. The OSPO

The legal basis for publishing code is the *Commission Decision of 8 December 2021 on the open source licensing and reuse of Commission software*, C(2021) 8759, published in the Official Journal as 2021/C 495 I/01 (European Commission 2021a; 2021b). Article 3: Commission services "may choose" to make software available for reuse. Article 5: the license "shall be the EUPL," with exceptions. Article 6: a single repository as point of access. Article 9: services "shall be allowed to take part in and contribute to external open source projects deemed to be in the interests of the Union." Article 10 permits proprietary licensing "by exception." Article 11 creates an inter-service group chaired by the Director-General responsible for intellectual property. Article 4 lists the grounds for not publishing: third-party rights, security, confidentiality, the access-to-documents regulation, unpublished research. The Decision governs outbound licensing of the Commission's own code; it names no office as decider and says nothing about what the Commission buys.

The office sits in DG DIGIT. Its head is Miguel Díez Blanco; Gijs Hillenius is its most visible presenter; contact is DIGIT-OSPO@ec.europa.eu (OSOR 2025a; EC OSPO n.d.). Staffing and budget are not published anywhere we found. The office describes its purpose as to "enable and scale the use of open source across the European Commission" and to "act as custodians of the EC Open Source Strategy" (OSOR 2026). Its documented functions are outbound and cultural: the code platform, the EUPL default, the inner-source program, the labs, the events, the catalogue, and the network secretariat.

The network is the office's most consequential product for a city. "The EU OSPO Network is a community connecting Open Source Programme Offices and similar initiatives across EU public services." It was founded through "a joint initiative of the City of Paris and the European Commission's Directorate-General for Digital Services," held its first meeting in May 2022, and "the European Commission's OSPO is the secretariat" (EU OSPO Network n.d.-a). Its 28 members include Belgium's FPS BOSA, the Czech national OSPO, Denmark's OS2, Paris, France's DINUM, Germany's ZenDiS, Munich and Schleswig-Holstein, Italy's PagoPA, seven Dutch public bodies, Sweden's NOSAD and Digg, CERN and the EC itself (EU OSPO Network n.d.-b). It meets monthly online and once a year in person, has no published commitments, and is open to "all OSPOs and similar organisations from public services in the European Union Member States."

On procurement, the strategy's only rule is the conditional preference: "Open-source solutions will be preferred when equivalent in functionalities, total cost and cybersecurity" (European Commission 2020a). The office has no documented role in applying it.

## 4. What worked

Publication at scale worked. A single platform with a default license took the Commission from a few scattered repositories to 737 in two years, and the inner-source target turned openness into a number that rises every year (EC OSPO 2024; OSOR 2026). Federation worked: the catalogue made nine national collections searchable as one within ten months of launch (OSOR 2026). The network worked: it grew from a Paris–Commission initiative into the standing forum for Europe's public-sector OSPOs, and Barcelona announced on January 29, 2026 that it had been "officially invited to join the OSPO Network as an institutional member" (Canòdrom 2026). The office also showed that the start-up cost can be low; its code platform runs on a license it did not pay for.

## 5. What did not

The preference clause did not run itself. April, the French free software association, read the strategy in October 2020 as lacking "concrete, detailed actions regarding the procedures of public procurement, or regarding its dependence on Microsoft," noted that "no information regarding either its budget or manpower is given" for the office, and concluded that the equivalence test means "Microsoft still has a bright future on the Commission's desktops" (April 2020). Nothing since contradicts that reading. On March 8, 2024 the European Data Protection Supervisor found that the Commission "infringed Regulation (EU) 2018/1725" in its use of Microsoft 365 and ordered it to suspend non-EU data flows by December 9, 2024 (EDPS 2024). On July 28, 2025 the EDPS found "the infringements identified in the EDPS' 2024 Decision have been remedied" and closed the case; the Commission stayed on Microsoft 365 (EDPS 2025). An OSPO was in place throughout and had no role in that decision, because nothing gave it one.

The successor policy repeats the shape. The *Strategy for EU Open Digital Ecosystems*, adopted June 3, 2026, promises "updated procurement guidelines" and "a fair evaluation of open-source bids," and the Free Software Foundation Europe's response was that it "remains non-binding" (European Commission 2026; FSFE 2026). The office's budget and staffing remain unpublished, the 2021 Decision is permissive and outbound only, and no figure for money saved, procurements influenced or proprietary purchases avoided has been published.

## 6. Analysis

Open source did not fail at the Commission. The office did what it was created to do: publish, catalogue, connect, and it did those things at a scale no city has matched. What was never assigned was the inbound decision. The strategy said open source "will be preferred"; it did not say who would judge equivalence, who would write down why a proprietary product won, or where that record would live. So the Commission kept its proprietary workplace through a regulator's finding and fixed the contract instead of asking whether an alternative existed.

That is the UN's Open by Default principle without its second half. A default needs an owner who decides what it means in each case and keeps the reasons. Munich is giving that role to its OSPO step by step; CMS wrote an inbound checklist its OSPO does not sign; the Commission wrote a preference and left it to the directorates. The office that knows the open alternatives best is the natural owner, and in all three cases it is not yet in the room.

## 7. Implications for New York City

The EC is the model for the outbound side. A single repository with a default license, an inner-source target that rises every year, a federated catalogue so that solutions built anywhere are findable everywhere, and a secretariat so that offices learn from each other: those are the functions a New York office should copy, and the Commission's are the best documented. The 2021 Decision is a usable template for a city rule on publishing code, provided the city replaces "may choose" with "shall, unless" and routes the exceptions through the office, which is Open by Default with a record attached.

The EC also shows what to add. New York should write the review role, the options analysis and the exceptions register into the founding act and give the office a seat at the procurement decision rather than a line in a strategy, so that the equivalence test has a judge. It should publish the office's budget and headcount, which the Commission never has, and report annually on contracts reviewed and exceptions granted, so that the office's authority is as visible as its code.

Finally, the EC tells New York which network it can join. The EU OSPO Network is for EU public services; the venue open to a U.S. city is the global FLOSS-PSO registry under the OSPO Alliance, which already lists Munich, Paris and the CMS Digital Service and which a Paris officer helps maintain (FLOSS-PSO n.d.; OSPO Alliance 2025b). A New York OSPO would be the first U.S. city on it.

## 8. Limitations and open questions

The founding documents are the Commission's own strategy and Decision, the latter read from a mirror of the Official Journal because EUR-Lex rate-limited the fetch. Functions and figures are from the office's own pages and slide decks on the Interoperable Europe portal. The EDPS findings are the regulator's press releases. Criticism is from April and the FSFE.

### Open questions

- The 2021 Decision's number: it is C(2021) 8759, OJ 2021/C 495 I/01, CELEX 32021D1209(01). Confirm against EUR-Lex directly; an earlier draft of our materials cited "2021/2228," which is wrong.
- Office staffing and budget: none published. Do not estimate.
- Repository counts: 214 projects and 737 repositories (Dec 2024) versus "over 800 external projects" (June 2025). Cite the 2024 figure as primary.
- Catalogue size: 640-plus at launch versus 800 in June 2025; date whichever is used.
- Whether a new internal Commission open source strategy for 2024 onward exists; only the June 2026 EU-wide strategy was found.
- Barcelona's membership of the EU OSPO Network: invited per Barcelona (Jan 29, 2026), not on the members page. Re-check the page before publication.
- Whether the EU OSPO Network has any written membership commitments; none were found.

## Bibliography

April. 2020. "Free Software Strategy of the European Commission: 'Think Open' But Not Too Big." October 26, 2020. https://april.org/en/free-software-strategy-european-commission-think-open-not-too-big

Canòdrom. 2026. "Barcelona, convidada oficialment a la xarxa europea d'OSPOs públiques." January 29, 2026. https://canodrom.barcelona/ca/noticies/barcelona-convidada-oficialment-a-la-xarxa-europea-dospos-publiques-1599668

EC OSPO. 2024. "Code.europa.eu: A Story of Sharing Code." December 17, 2024. https://interoperable-europe.ec.europa.eu/collection/ec-ospo/news/spotlight-projects

EC OSPO. n.d. EC OSPO collection. Interoperable Europe. https://interoperable-europe.ec.europa.eu/collection/ec-ospo

EDPS. 2024. "European Commission's Use of Microsoft 365 Infringes Data Protection Law for EU Institutions and Bodies." March 11, 2024. https://www.edps.europa.eu/press-publications/press-news/press-releases/2024/european-commissions-use-microsoft-365-infringes-data-protection-law-eu-institutions-and-bodies

EDPS. 2025. "European Commission Brings Use of Microsoft 365 into Compliance." July 28, 2025. https://www.edps.europa.eu/press-publications/press-news/press-releases/2025/european-commission-brings-use-microsoft-365-compliance-data-protection-rules-eu-institutions-and-bodies

EU OSPO Network. n.d.-a. Collection page. https://interoperable-europe.ec.europa.eu/collection/eu-ospo-network

EU OSPO Network. n.d.-b. "Network Members." https://interoperable-europe.ec.europa.eu/collection/eu-ospo-network/network-members

European Commission. 2020a. *Open Source Software Strategy 2020-2023: Think Open.* C(2020) 7149 final, October 21, 2020. https://interoperable-europe.ec.europa.eu/sites/default/files/inline-files/The-Commission-Open-Source-Strategy.pdf

European Commission. 2021a. *Commission Decision of 8 December 2021 on the Open Source Licensing and Reuse of Commission Software.* C(2021) 8759; OJ 2021/C 495 I/01. https://lexaris.de/book/version/documentflat/head/2121049

European Commission. 2021b. "Commission Adopts New Rules on Open Source Software Distribution." December 8, 2021. https://commission.europa.eu/news-and-media/news/commission-adopts-new-rules-open-source-software-distribution-2021-12-08_en

European Commission. 2025. "The EU Open Source Solutions Catalogue Is Now Live." March 31, 2025. https://interoperable-europe.ec.europa.eu/interoperable-europe/news/eu-open-source-solutions-catalogue-now-live

European Commission. 2026. "Commission Boosts Open and Interoperable Digital Ecosystems for Public Administrations." June 3, 2026. https://commission.europa.eu/news-and-media/news/commission-boosts-open-and-interoperable-digital-ecosystems-public-administrations-2026-06-03_en

FLOSS-PSO. n.d. "About This Initiative." https://floss-pso.network/about/

FSFE. 2026. "EU Tech Sovereignty: A Milestone for Public Code?" June 3, 2026. https://fsfe.org/news/2026/news-20260603-01.html

OSOR. 2025a. "The Role of OSPOs in Transforming Public Services with Open Source." June 19, 2025. https://interoperable-europe.ec.europa.eu/node/731054

OSOR. 2026. OSOR Community Meetup January 2026, master slide deck. January 28, 2026. https://interoperable-europe.ec.europa.eu/sites/default/files/news/2026-02/osor-community-meetup-jan-2026-master-slide-deck.pdf

OSPO Alliance. 2025a. "Open Source at the EC." OSPO OnRamp slides, May 16, 2025. https://ospo-alliance.org/resources/onramp/20250516_ospo_onramp_open_source_at_the_ec.pdf

OSPO Alliance. 2025b. News, September 15, 2025. https://ospo-alliance.org/news/20250915_floss_pso_support/
