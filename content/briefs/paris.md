---
# Research brief: Paris — second of the per-city OSPO briefs, same shape as
# content/briefs/munich.md (read that file's header for how these render:
# UnnycCaseBrief under the Paris case on /success, abstract visible, the
# paper and its bibliography behind disclosures, "See catalog" pointing at
# the Paris block on /ospo-strategy). Loaded by getBrief('paris').
#
# ⚠ SOURCE OF TRUTH SPLIT, per the handoff README: this file is canonical for
# the PROSE; content/ospo-catalogue/paris.json for the CATALOGUE. The
# handoff's "Catalogue" table is therefore NOT reproduced here.
#
# ⚠ §8's open questions are UNVERIFIED (handoff README) — in particular, no
# founding act for the office was found, so the JSON's authorizing_act says
# so rather than inventing one. Author-date citations match the Bibliography.
case: paris
title: "Paris OSPO Brief"
subtitle: "How Paris turned one open platform into two decades of shared city services, and what an office could add"
date: "October 2026"
catalogHref: /ospo-strategy#playbooks-paris
---

## Abstract

Paris has the longest open source record of any city we studied. In 2002 the Council of Paris voted to open the code of Lutece, the web platform the city had built the year before. Lutece now runs 200-plus city services, is used by more than fifty French public bodies and by cities as far as Accra, and in 2022 was repackaged as CiteLibre so that another city can deploy it in a day. The office that tends it, an Open Source Program Office inside the IT department, took shape in 2022 and 2023 around one officer and the Lutece engineering team. Its job is to professionalize the city's use and production of open source, grow the community, and help other authorities adopt. It has no role in what the city buys. We think Paris is the model for how New York should package and share what its PIT Crews build, and the clearest argument for chartering the office in law: an office nobody chartered has no mandate beyond the platform it grew around, and a New York OSPO built on the UN Open Source Principles would add the procurement review, the options analysis and the public record of exceptions that Paris's office was never asked to hold.

## 1. Introduction

We chose Paris because it answers the question that follows "should the city write its own software": what happens to that software over twenty years? Paris kept one platform alive, shared it with dozens of other public bodies, and built a small institution around it. The reasoning is the city's own, the results are measurable, and the office is a direct precedent for the body New York would create to carry PIT Crew's work beyond the first agency that uses it.

## 2. Reasoning and benefits

Paris built Lutece in 2001 as the platform for its own web services, and in September 2002 the council voted to publish its code (Acteurs publics 2023). The reasoning was practical. A platform the city owned could be reused for every new service instead of procured again, and a platform published under a permissive license could be improved by anyone who used it. Lutece is BSD 3-Clause, "a licence chosen to make it easy to reuse and hack, not to protect our codebase" (Paris 2021). Its funding "stems exclusively from the city budget" (OSOR 2020), and the city's position is that pooling, "mutualisation" in the French public-sector vocabulary, is what justifies the spend: software paid for once by Paris is maintained by a community and deployed by others at no license cost (Acteurs publics 2023).

The benefits are measurable in reach. By the city's current count Lutece runs "200+ city services" with "more than 500 modules" and "200+ contributors"; the city claimed 300-plus services in 2021 and 2022 (Paris n.d.; Lutece n.d.; Paris 2021; Worth 2022). Outside Paris it runs in Lyon, Marseille and Mont-de-Marsan and "in over 50 medium and large French organisations" (OSOR 2020); Météo-France adopted it in 2008; Budapest reused and contributed to the participatory budgeting module; Accra deployed its own version of the DansMaRue reporting app (Lutece n.d.). In 2019 the St. Francis Neighborhood Center in West Baltimore deployed Lutece for appointment booking with help from Johns Hopkins University's OSPO and Paris staff (Technical.ly 2019; Worth 2022). By 2015, 60% of the city's servers ran GNU/Linux (Ville de Paris 2015). The project won OW2's "Mature Project" award in 2016 and "Best Community" in 2020, a "Best Open Source Strategy" award in 2018, and the top level of France's "Territoire Numérique Libre" label (Lutece n.d.). None of that required a mandate from the national government; it required a council vote, a license and a team.

## 3. The OSPO

The office took shape administratively. The two dates on record are self-reported: the FLOSS-PSO directory, which organizations fill in themselves, lists "OSPO de la Ville de Paris, created 2022-06-01," and the city's 2025 conference talk refers to "the creation of its open source program office in 2022" (FLOSS-PSO n.d.; FOSS Backstage 2025). In July 2023 the public-sector press reported that "work is under way to define an organization as a true Open Source Programme Office," and the EC called it "the newly created OSPO" that September (Acteurs publics 2023; OSOR 2023). No council deliberation, charter or strategy creating it was found.

Philippe Bareille is the office: "Open Source program officer at the City of Paris' CIO office," a project officer in the Direction des Systèmes d'Information et du Numérique "in charge of implementing the open source policy" (FOSS Backstage 2025; AlpOSS 2025). His manager appears to be Magali Lemaire, head of the software engineering bureau (Libre à vous 2024). Around him is the Lutece team, "an internal team of 15, completed with procurement of 60+ for departments' projects and maintenance" (Bareille 2023). The contact is opensource@paris.fr.

Bareille's September 2023 presentation to the EC is the nearest thing to a mission. The office exists to "professionalize our use and production of open source," "find a sustainable way to scale the Lutece community," and "acculturate the teams on OSS." Its activities: the opensource.paris.fr portal; CiteLibre, created to "scale Lutece and simplify adoption"; community events and webinars; support for local authorities that want to deploy; faster internal pull-request handling; "a complete inventory of OS bricks and their environment"; contributor guides; and "definition of shared governance rules" (Bareille 2023). The IT department, "supported by the OSPO, maintains a curated list tracking each OSS component, including its version, dependencies," and a review committee approves outside contributions (Linåker et al. 2026). The officer is "a single point of contact for teams, as a facilitator, within the department." On procurement the record is silent: no source describes a procurement review, an options analysis for proprietary purchases, or a register of exceptions.

CiteLibre, announced June 8, 2022, is Lutece "pre-assembled and containerized" into packs for appointment booking, forms, identity and contact (Lutece n.d.). Its site metadata names the author as the "Open Source Programme Office de la Ville de Paris," the only place the office's name appears on a city artifact. Paris joined April in 2015, co-founded the EU OSPO Network with the European Commission in 2022, and joined OW2, OSPO++ and, in November 2024, the OSPO Alliance (Ville de Paris 2015; OSPO Alliance 2024).

## 4. What worked

The platform and its reuse. One city-owned codebase has carried 200-plus services for two decades with an internal team of fifteen and contractors for the rest. The permissive license did what it was chosen to do: dozens of French public bodies and several foreign ones run Lutece without asking Paris. CiteLibre lowered the cost of adoption further; by July 2023 "a hospital group and one municipality" had deployed it and about ten authorities had expressed interest (Acteurs publics 2023). The office's community work is why Paris co-founded the EU OSPO Network and why a Paris officer helps maintain the global registry of public-sector OSPOs. Baltimore shows the reach: when the city government showed no interest in Lutece in 2019, a West Baltimore community center deployed it instead, with help from Johns Hopkins University's OSPO and Paris staff, the platform's first use outside France (Technical.ly 2019; Worth 2022).

## 5. What did not

The desktop. Paris studied a Munich-style migration in 2003 and 2004 for roughly 17,000 workstations. Consultants' cost scenarios ranged from €0.2 million to €57 million, Microsoft offered a 57.4% discount, the migration was shelved, and the city signed a Microsoft partnership in January 2008 (LinuxFr 2004; April 2008). Paris chose to put its open source effort into the services it builds rather than the software its staff type in, which is the same choice Barcelona and Munich arrived at.

The office's own limits are the ones it reports. Its 2023 self-assessment lists "a community that is challenging to bring together," "inconsistent efforts depending on the period," "a few contribution guides but a hard time merging PRs," and "contributions difficult to integrate" (Bareille 2023). It is one officer inside one department, with no founding act, no authority over purchasing, and no exceptions register. No savings figure has been published, and the open-by-default practice is a 2002 vote and twenty years of habit rather than a policy text anyone can cite.

## 6. Analysis

Paris is proof that a city can own a platform, keep it alive and export it with a small team and a permissive license. The lesson is in what the office was built to do. It was created to tend Lutece: grow its community, package it for others, keep the component inventory honest. Those are the UN principles of reusability, contribution and documentation in practice, and Paris does them well.

What the office does not do follows from how it began. Nobody chartered it, so nothing gives it a say in what the city buys. Open by Default in Paris is a culture, and cultures do not review contracts. An office created by a council act, with the procurement review written in, would have the mandate Paris's office has never been given, and would still be able to do everything Paris's office does.

## 7. Implications for New York City

CiteLibre is the model for PIT Crew. Every product the crews build should be packaged so the next agency, or the next city, can deploy it without the original team, under a license chosen for reuse. Paris shows the payoff: one platform, hundreds of services, dozens of adopters, and a city that is now the reference point for European public-sector open source networks.

The office is the caution. Paris's OSPO has no founding document, so its remit is whatever its officer and his bureau decide, and that has meant the platform and its community. New York should charter its office in legislation, with the three jobs Paris's was not given: required review of technology contracts above a threshold, ownership of the options analysis that justifies a proprietary choice, and a public register of exceptions. With those, an office built on the UN Open Source Principles would do what Paris does and what Paris cannot.

Paris also offers a network. Its officer co-founded the EU OSPO Network and helps maintain the global FLOSS-PSO registry, and Paris and New York already sit together in the Cities Coalition for Digital Rights. A New York office would have a counterpart to call on day one.

## 8. Limitations and open questions

The office's functions are from Bareille's presentations and interviews and the city's portals; the founding date is self-reported to a volunteer directory and a conference abstract. Lutece's reach is from the city, the EC and the French public-sector press, with the counts dated above. The Baltimore and Accra deployments are from Technical.ly and the Lutece press page.

### Open questions

- No founding deliberation, charter or strategy for the OSPO was found. Ask Paris (opensource@paris.fr) whether one exists before describing the office as "created in 2022."
- OSPO headcount beyond the one officer is unverified. The 15-person figure is the Lutece engineering team, not the OSPO.
- Service counts conflict (300+, 200+, about 100, 80%). Use "200-plus" with the city portal as source and date it.
- Current Microsoft or other proprietary spend by the city was not found. Do not claim Paris has or has not reduced it.
- The "more than 40 cities" figure is the EC's; the "over 50 organisations" figure is from 2020. Neither is from the city.
- The 2003-2004 migration study figures are from contemporaneous French press and a 2008 political document; confirm the 57.4% discount figure in a second source before using it.

## Bibliography

Acteurs publics. 2023. Émile Marzolf, "Logiciels libres et mutualisation : quand Paris montre l'exemple." July 17, 2023. https://acteurspublics.fr/articles/logiciels-libres-et-mutualisation-quand-paris-montre-lexemple

AlpOSS. 2025. "De Lutece à CiteLibre, retour sur la politique open source de la Ville de Paris." February 20, 2025. https://pretalx.com/alposs-2025/talk/PKZXCZ/

April. 2008. "Les Parisiens sont les premiers bénéficiaires du partenariat Microsoft" [argumentaire], list archive, January 30, 2008. https://listes.april.org/wws/arc/candidatsfr-locaux/2008-02/msg00121/argumentaire.doc

Bareille, Philippe. 2023. "The City's Commitment to Open Source through Its OSPO." OSOR webinar slides, September 2023. https://interoperable-europe.ec.europa.eu/sites/default/files/news/2023-10/OSOR%20Webinar%20Philippe%20Bareille%20presentation.pdf

EC. n.d. "CiteLibre." Interoperable Europe. https://interoperable-europe.ec.europa.eu/node/707046

FLOSS-PSO Network. n.d. "List of Public Sector OSPOs." https://floss-pso.network/public-sector-ospos/

FOSS Backstage. 2025. "From Lutece to CiteLibre: The City of Paris' Journey in OS." March 11, 2025. https://25.foss-backstage.de/session/from-lutece-to-citelibre-the-city-of-paris-journey-in-os/index.html

Libre à vous. 2024. "Paris et logiciels libres," episode 228, April, December 3, 2024. https://libreavous.org/228

Linåker, Johan, Astor Nummelin Carlberg, and Ciarán O'Riordan. 2026. "Public Sector Open Source Program Offices." arXiv 2603.04891, June 2026. https://arxiv.org/abs/2603.04891

LinuxFr. 2004. "Linux à Paris mais à petite dose pour le moment." October 19, 2004. https://linuxfr.org/news/linux-a-paris-mais-a-petite-dose-pour-le-moment

Lutece. n.d. Project site, community and press pages. Ville de Paris. https://lutece.paris.fr/

OSOR. 2020. "Lutece: Case Studies on Sustainability of Public Sector Open Source Communities." European Commission, August 5, 2020. https://interoperable-europe.ec.europa.eu/node/702996

OSOR. 2023. "Presentations from the OSOR Webinar on Solutions for Public Sector." European Commission, September 27, 2023. https://interoperable-europe.ec.europa.eu/collection/open-source-observatory-osor/news/presentations-osor-webinar-solutions-public-sector

OSPO Alliance. 2024. "City of Paris Confirms Support to the OSPO Alliance." November 20, 2024. https://ospo-alliance.org/news/20241120_member_city_of_paris/

Paris. 2021. "How the City of Paris Committed to Open Source." OSOR webinar slides, June 2021. https://interoperable-europe.ec.europa.eu/sites/default/files/news/2021-07/PB_OSOR%20Webinar%20-%20OSS%20dev%20Culture_Final.pdf

Paris. n.d. Paris Open Source portal. Ville de Paris. https://opensource.paris.fr

Technical.ly. 2019. Stephen Babcock, "Paris' Open Source Platform for City Services Is Being Introduced at a West Baltimore Community Center." April 19, 2019. https://technical.ly/civic-news/paris-lutece-open-source-platform-city-services-west-baltimore-community-center-st-francis.md

Ville de Paris. 2015. "Paris renforce son engagement pour le logiciel libre." Press release, March 13, 2015. https://cdn.paris.fr/presse/2020/03/23/d541e951e6f0a72dedfd4fb864bbc60b.pdf

Worth. 2022. Steve Hamm, "How Open-Source Software Makes Cities More Livable." February 15, 2022. https://worth.com/how-open-source-software-makes-cities-more-livable/
