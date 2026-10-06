---
# Research brief: Munich — the first of the per-city OSPO briefs (Paris, CMS,
# the European Commission and the UN to follow in the same shape). Rendered
# by src/components/unnyc/primer/UnnycCaseBrief.js UNDER the Munich case on
# /success: the Abstract is always visible, the rest of the paper opens from
# a "Read the full brief" disclosure, and the Bibliography is a second
# disclosure nested inside it. Loaded by getBrief('munich') in
# src/lib/content.js, which looks for content/briefs/<case id>.md and returns
# null when a case has no brief yet.
#
# ⚠ SOURCE OF TRUTH SPLIT, per the handoff README: this file is canonical for
# the PROSE; content/ospo-catalogue/munich.json is canonical for the
# CATALOGUE. The handoff's "Catalogue" table is therefore NOT reproduced
# here — the Bibliography ends with a link to the catalogue on
# /ospo-strategy instead (`catalogHref`).
#
# ⚠ §8's "Gaps to close" are UNVERIFIED (handoff README: "Do not present them
# as settled in the UI"). They render as an "Open questions" list with an
# explicit unverified marker, so a reader can see what is still being checked.
# The same items are in the JSON's `case.gaps[]`.
#
# Author-date citations in the text match the Bibliography entries.
case: munich
title: "Munich OSPO Brief"
subtitle: "How Munich built the best-authorized city OSPO in Europe, and what New York can add to it"
# Just the date on the card's small line — the kicker already says what the
# document is, and the owner's rule for web text is less is more.
date: "October 2026"
catalogHref: /ospo-strategy#playbooks-munich
---

## Abstract

Munich shows that a city can create an Open Source Program Office by ordinary legislation, with a budget and staff, inside its IT department. Council motions in October 2020 asked for it; a council decision in February 2023 created it with €500,000 and two permanent posts; a second decision added €85,000 a year to sponsor the open source projects the city depends on. Since January 2024 the office has published over a hundred city code repositories, built a community of ninety contributing staff, funded outside developers through a sabbatical, and been written into procurement governance as an adviser. Its limits are specific: it advises on purchases rather than reviewing them, the city's justification rule covers only code the city writes, and there is no public record of exceptions. A 2026 coalition agreement made open source the procurement default. We think Munich's founding act is the blueprint for New York, and that an OSPO built on the UN Open Source Principles can start where Munich is arriving: with a seat in the procurement decision and a public record of the reasons.

## 1. Introduction

We chose Munich because it answers the top questions regarding an OSPO: who creates it, with what authority, and what it does all day. The office exists because elected members asked for it, the IT department designed it, and the council funded it, and its functions are published on a page it maintains itself.

Munich is also the city that ran open source Linux on 15,000 desktops and then returned to Windows. Section 5 covers that history for what it teaches: a city's open source policy survives in the institution that owns it, not in the operating system on its desktops. The council created the OSPO so that the commitment would no longer depend on who holds the majority.

## 2. Reasoning and benefits

Munich's first decision was a cost decision. When Microsoft ended support for Windows NT 4.0, the city had to replace the software on about 15,000 workstations. Consultants put a Windows XP migration at €34.2 million and a migration to Linux, the open source operating system, with OpenOffice at €31.3 million. In May 2003 the council voted for Linux, and the city built its own version for municipal desktops, named LiMux from Linux and München; the name came to stand for the whole project (OSOR 2024; LWN 2017). Microsoft's chief executive interrupted a ski holiday to lobby the mayor in person, and the city went ahead anyways (LWN 2017). LibreOffice, forked from OpenOffice in 2010, replaced it on the LiMux desktops along the way; by 2013 the city had built 18,000 LibreOffice document templates (LWN 2017). The migration was completed in December 2013. The city's accounting put the saving at €11.7 million, and the EC's observatory credits the project with having "boosted the city's technological independence and the local IT industry" through the local vendors it used (OSOR 2024; Wikipedia n.d.). Munich bought two things with open source: money it did not send to a licensor, and a local market that could maintain what the city ran.

The city has since written its reasons down. Its published principles give seven: vendor independence, so that "by being able to switch vendors and solutions, we can avoid unilateral dictation"; reuse, because "code that is made open source can be easily reused by other agencies"; cooperation with other public bodies; security, because "publicly accessible code can be easily checked"; transparency, which "creates trust in the population towards the administration"; citizen participation; and recruitment, since public code "contributes to recruitment marketing for IT professionals" (Stadt München n.d.-d). The head of the office puts it in one sentence: "Open source isn't a short-term cost-saving measure, but a strategic investment in digital sovereignty and future viability" (Zammad 2025). It is also now the law: the Bavarian Digital Act says authorities "shall use open software and open exchange standards," and the federal Online Access Act gives open source priority in public IT (Stadt München n.d.-d).

## 3. The OSPO

On October 22, 2020, the SPD/Volt and Green groups on the City Council filed motions asking the IT department to create an "Open Source Hub" with "firmly assigned personnel and financial resources," plus a funded sabbatical for outside programmers, because open source "no longer has the priority now demanded in the coalition agreement" (Stadt München 2020; FSFE 2020). The council members wanted an institution to hold the commitment.

The decision that created it, Sitzungsvorlage 20-26 / V 08681 of February 15, 2023, commissions "a newly created and permanently established team within it@M," the city's IT provider, covering both "giving and taking" under "public money, public code." It set four staff at launch and two permanently, €500,000 in start-up funding, and a start in the third quarter of 2023 (Stadt München 2023a). A second decision on November 15, 2023 added €85,000 a year to sponsor the open source libraries the city relies on and placed the Hub in the Competence Center for Software Engineering (Stadt München 2023b). The office opened in January 2024 under Klaus Mueller, with Dr. Dirk Gernhardt as Open Source Representative and IT commissioner Dr. Laura Dornheim as its political owner (Stadt München 2024; n.d.-a).

The council gave it four jobs: license questions, evaluating and prioritizing initiatives, managing the city's presence on public code platforms, and running the sabbatical (Stadt München 2023a). In practice the office sets MIT as the default license, runs a biweekly municipal open source community, manages the city's GitHub organization, co-founded the Municipal Open Source Board with ZenDiS, KGSt and Dortmund, and funds outside developers for three or six months on projects the city needs (Stadt München n.d.-a; n.d.-b; heise 2025).

On procurement, the office offers "advice on new software solutions," market research on open alternatives, and "cooperation if there is no practicable open source solution," and it draws its own line: "The OSPO only offers advisory assistance, not tender implementation or make-buy-use-compose analyses" (Stadt München n.d.-a). In April 2024 the commissioner reported that "our OSPO has now been integrated into the governance processes for procurement" and that open source options are "checked with priority wherever technically and financially sensible" (Stadt München 2024). A council rule from May 5, 2021 requires that any in-house development not done as open source "be justified in every council decision on IT project approval" (Stadt München 2021). In May 2026 a new coalition agreement made open source the procurement default (WinFuture 2026).

## 4. What worked

By April 2024 it@M had "published 110 code repositories, on which over 90 employees work" (Stadt München 2024). Sponsorship went to Vue.js, Vuetify and Robot Framework (Stadt München 2024). The EC's observatory counted 32 open source applications in the city's catalogue (OSOR 2024). Munich adopted an appointment-booking system built by Berlin rather than buying or writing its own (OSOR 2024). The first sabbatical, on the Integreat chat project, completed in 2025, and a second is scheduled for late 2026 (heise 2025; Stadt München n.d.-c). The office has already outlasted one change of governing coalition, and the 2026 agreement extended its mandate rather than reversing it.

## 5. What did not

The desktop migration did not hold. A new mayor took office in 2014 and preferred Microsoft. On February 15, 2017 the council voted to return to a Windows client, and on November 23, 2017 it approved a Windows architecture for about 29,000 computers at about €89 million (vergabeblog 2017; LWN 2017). The consultants' study before the vote found the city's problems with Linux were "organizational rather than technical": fifteen operating system versions were in use, including an old version of Windows, because each department controlled its own upgrades, and the desktop project was blamed for failures that had nothing to do with it (LWN 2017).

The office's gaps today are narrower. It advises on procurement and does not review it. The justification rule covers code the city writes, not software it buys, and the justifications are not collected anywhere public. No savings figure or count of procurements advised on has been published. The city's workforce remains on Windows and Office 365 (Stadt München 2020b).

## 6. Analysis

Open source did not fail in Munich. LiMux ran for a decade and saved money by the city's own figures. What failed was how the policy was held: it lived in a mayor's preference and a council majority, so it changed when they did. The 2020 coalition understood this and asked for a permanent team instead of another migration.

Since then the city has added authority to its OSPO decision by decision: a commitment in 2020, a justification rule in 2021, an office in 2023, a seat in procurement governance in 2024, a default in 2026. What it has not yet done is make the office the body that decides when a purchase may depart from the default and keeps a record of why. Dornheim's working rule, "use as much open source as possible, and where that is not possible, we should use good commercial products" (Sustain 2024), is the UN's Open by Default principle in practice. Open by Default needs someone to decide what the default means in each case. That is the piece Munich is still building.

## 7. Implications for New York City

Munich gives New York a founding act to copy: a council decision that names the team, the host department, the headcount and the money, a second decision for sponsorship, and an office inside the IT organization. New York's version adds three lines that Munich is still writing: required review of technology contracts above a threshold, ownership of the options analysis that justifies a proprietary choice, and a public register of exceptions. Munich is taking that step by coalition agreement; New York can take it in legislation.

Two Munich practices should be adopted as they are. Sponsoring the open source projects the city depends on is the Contribute Back principle in practice, at a modest cost. The sabbatical and the biweekly community are the RISE and inclusive participation principles made concrete, and New York's civic technology community is ready for them. The PIT Crews supply the capacity a procurement role needs, and an annual report on contracts reviewed, exceptions granted and code released would give the office the metrics Munich has not published.

Munich also answers the Linux question before it is asked. The city that reversed its desktop migration under a new mayor responded by building an institution, and the institution has held through the next change of government.

## 8. Limitations and open questions

The founding documents are the city's own council papers, read in German. The office's functions are from its own page and the IT commissioner's written answers to councillors. Repository counts, sponsorship amounts and the LiMux figures each trace to a named source.

### Open questions

- Current OSPO headcount. The council planned two permanent posts; nothing confirms the number today.
- Sponsorship budget: €85,000 in the November 2023 decision versus €75,000 in heise's October 2024 report. Use the council figure and note the discrepancy.
- No recent Microsoft or Windows contract value for the city was found. The 2020 council answer confirms Office 365 ProPlus; the €89 million figure is the 2017 migration decision, not a licence contract.
- The May 2026 coalition agreement is reported by WinFuture and Cybernews; open the agreement text itself before quoting "standardmäßig auf Open Source."
- heise article dates were not visible in the fetched text; confirm before citing by date.
- The "110 repositories, 90 employees" figure is from the IT commissioner's April 2024 answer; the city's own repositories page may now show a different count.

## Bibliography

FSFE. 2020. "Munich Commits to 'Public Money? Public Code!'" May 6, 2020. https://fsfe.org/news/2020/news-20200506-01.html

heise online. 2024. "After LiMux Shutdown: How Munich Is Slowly Getting Closer to Open Source Again." October 2024. https://heise.de/-9981006

heise online. 2025. "After LiMux Shutdown: Munich Launches First Open Source Sabbatical." 2025. https://heise.de/-10266612

LWN. 2017. Jake Edge, "The Rise and Fall of Limux." November 8, 2017. https://lwn.net/Articles/737818/

OSOR. 2024. Ola Adach, "Munich's Long History with Open Source in Public Administration." European Commission, January 31, 2024. https://interoperable-europe.ec.europa.eu/node/707462

Stadt München. 2020. Anträge "Open-Source-Hub" and "Munich Open Source Sabbatical," SPD/Volt and Grüne–Rosa Liste, October 22, 2020. https://muenchen-transparent.de/dokumente/7546869/datei

Stadt München. 2020b. Anfrage 14-20 / F 00115, answer on software in use, October 2020. https://risi.muenchen.de/risi/dokument/v/6352008

Stadt München. 2021. Beschluss TOP A 23, Vollversammlung, May 5, 2021. https://risi.muenchen.de/risi/dokument/v/6596679

Stadt München. 2023a. Sitzungsvorlage 20-26 / V 08681, "Open Source Hub und Open Source Sabbatical," IT-Ausschuss, February 15, 2023. https://risi.muenchen.de/risi/dokument/v/7546873

Stadt München. 2023b. Sitzungsvorlage 20-26 / V 11273, "Strategie zur Finanzierung von Open-Source-Bibliotheken," November 15, 2023. https://muenchen-transparent.de/dokumente/8063319/datei

Stadt München. 2024. Anfrage 20-26 / F 00892, answer by Dr. Laura Dornheim, April 19, 2024. https://muenchen-transparent.de/dokumente/8390624/datei

Stadt München. n.d.-a. "OSPO." opensource.muenchen.de. https://opensource.muenchen.de/ospo.html

Stadt München. n.d.-b. "Licenses." https://opensource.muenchen.de/licenses.html

Stadt München. n.d.-c. "Sabbatical." https://opensource.muenchen.de/sabbatical.html

Stadt München. n.d.-d. "Principles." https://opensource.muenchen.de/principles.html

Sustain. 2024. "Episode 214: Dr. Laura Dornheim on Munich's Open Source Journey." January 5, 2024. https://podcast.sustainoss.org/214

vergabeblog. 2017. "München: LiMux-Aus endgültig besiegelt." December 12, 2017. https://vergabeblog.de/2017-12-12/muenchen-limux-aus-endgueltig-besiegelt/

Wikipedia. n.d. "LiMux." https://en.wikipedia.org/wiki/LiMux

WinFuture. 2026. Felix Krauth, "Nach LiMux: München wagt zweiten Anlauf mit Open-Source-Software." May 14, 2026. https://winfuture.de/news,158694.html

Zammad. 2025. "Interview with Klaus Mueller: Seven Questions on Open Source in Munich's City Administration." June 23, 2025. https://zammad.com/en/blog/open-source-public-services
