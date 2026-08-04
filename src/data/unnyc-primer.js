/**
 * Content for the UNNYC hub (/) — the education-first "primer" framing.
 * Audience: NYC government technology staff. Goal: explain the key concepts the UN system has
 * united around (unopensource.org/agenda) and how the world is advancing
 * them, funneling to the endorse-the-Principles campaign.
 *
 * Sourced/verified against: unite.un.org (UN OS Principles + the 16
 * endorsing organizations, 25 Mar 2025), unopensource.org/agenda (OSW 2026
 * themes), OSOR/Interoperable Europe (Barcelona, Paris, Munich OSPOs),
 * sovereign.tech (funding figures), x-road.global / NIIS (Estonia).
 * Static-first (like data/unnyc.js); move into the CMS later if needed.
 */

export const primerHero = {
    titleParts: [
        'The UN’s New York City office organizes the world’s open source government movement.',
        'New York City Government Should Join It.',
    ],
    subtitle:
        'The UN system has united around eight Open Source Principles. Barcelona became the first city to endorse them. New York — which hosts the movement every June — still hasn’t. Start wherever you are:',
    ctas: [
        { text: 'Show Your Support', href: '/campaign', style: 'primary', internal: true },
    ],
    stats: [
        { number: '8', label: 'UN Open Source Principles' },
        { number: '17+', label: 'Endorsing Organizations' },
        { number: '120+', label: 'Countries at UN OSW 2026' },
        { number: '1', label: 'City Endorsed — NYC Next?' },
    ],
};

export const movement = {
    title: 'How the UN Came to Champion Open Source',
    lede:
        '',
    timeline: [
        {
            year: '2019',
            title: 'Digital Public Goods Alliance founded',
            desc: 'A multi-stakeholder initiative (endorsed in the Secretary-General’s digital cooperation agenda) begins vetting and promoting open source solutions that advance the SDGs.',
        },
        {
            year: '2020',
            title: 'SG’s Roadmap for Digital Cooperation',
            desc: 'The Secretary-General names digital public goods — open source software, open data, open standards — as essential to an inclusive digital future.',
        },
        {
            year: '2023–24',
            title: '"OSPOs for Good" at UN Headquarters',
            desc: 'The UN convenes governments and foundations in New York around Open Source Programme Offices as the institutional home for public-sector open source.',
        },
        {
            year: 'Sept 2024',
            title: 'Global Digital Compact adopted',
            desc: 'At the Summit of the Future, member states commit to shared principles for an open, safe digital future — including explicit support for digital public goods and infrastructure.',
        },
        {
            year: 'March 2025',
            title: 'UN Open Source Principles adopted',
            desc: 'The UN CEB’s Digital and Technology Network adopts eight principles — "open by default," "contribute back," and more. The Open Source Initiative endorses first; sixteen more organizations follow, from the Linux Foundation to Germany’s Sovereign Tech Agency.',
        },
        {
            year: 'June 2025',
            title: 'First UN Open Source Week',
            desc: 'OSPOs for Good grows into a full week at UN Headquarters spanning AI, digital public infrastructure, and community-led events.',
        },
        {
            year: 'Nov 2025',
            title: 'Barcelona endorses — a city first',
            desc: 'Barcelona becomes the first city in the world to formally endorse the Principles, pairing the signature with an OSPO, a citizen agreement, and a municipal open source fund.',
        },
        {
            year: 'June 2026',
            title: 'UN OSW draws 2,600+ from 120+ countries',
            desc: 'Themed days — UN Tech Over, Open Source × AI, DPI Day, OSPOs for Good — plus the launch of the Public Code Observatory mapping public-sector open source worldwide.',
        },
    ],
};

export const concepts = {
    title: 'The Vocabulary of the Movement',
    lede:
        'Terms that recur across UN Open Source Week, the Global Digital Compact, and  government open source programs.',
    terms: [
        {
            slug: 'open-source-foss',
            term: 'Open Source (FOSS)',
            def: 'Software whose source code anyone can inspect, use, modify, and share. "Free and open source software" is about freedom and public auditability, not price.',
            nyc: 'A handful of NYC agencies already publish code on GitHub on their own initiative. Endorsement would turn that scattered habit into a citywide standard.',
            link: { url: 'https://en.wikipedia.org/wiki/Free_and_open-source_software', label: 'Wikipedia' },
        },
        {
            slug: 'un-principles',
            term: 'UN Open Source Principles',
            def: 'Eight commitments adopted by the UN’s Digital and Technology Network in 2025 defining how the UN system approaches software.',
            nyc: 'Endorsement is a signature plus a roadmap, not a procurement overhaul. It’s the entry ticket to a global community of practice.',
            link: { url: 'https://unite.un.org/en/news/sixteen-organizations-endorse-un-open-source-principles', label: 'unite.un.org' },
        },
        {
            slug: 'ospo',
            term: 'OSPO — Open Source Programme Office',
            def: 'A dedicated team that coordinates an institution’s open source strategy: what to use, what to publish, how to contribute, and how to stay secure and compliant.',
            nyc: 'Paris, Munich, and the UN itself run OSPOs. NYC’s Office of Technology & Innovation is the natural home for one.',
            link: { url: 'https://en.wikipedia.org/wiki/Open_Source_Program_Office', label: 'Wikipedia' },
        },
        {
            slug: 'dpgs',
            term: 'Digital Public Goods (DPGs)',
            def: 'Open source software, open data, open AI models, standards, and content that adhere to privacy and best practices and help attain the SDGs — vetted via the DPG Standard and listed in the DPGA registry.',
            nyc: 'Tools NYC builds could qualify as DPGs — and tools in the registry are free for NYC to adopt instead of procuring proprietary equivalents.',
            link: { url: 'https://www.digitalpublicgoods.net/', label: 'DPG Alliance' },
        },
        {
            slug: 'dpi',
            term: 'Digital Public Infrastructure (DPI)',
            def: 'The shared digital rails a society runs on — identity, payments, data exchange. Like roads or the power grid, DPI works best as interoperable public infrastructure rather than a set of walled gardens.',
            nyc: 'Cities everywhere face the same needs — benefits access, permits, identity, participation. Increasingly they solve them once and share: platforms like Decidim and X-Road are built by one government and reused by dozens. NYC can join that exchange instead of buying its own silo.',
            link: { url: 'https://en.wikipedia.org/wiki/Digital_public_infrastructure', label: 'Wikipedia' },
        },
        {
            slug: 'digital-sovereignty',
            term: 'Digital Sovereignty',
            def: 'A government’s ability to control its own digital destiny — to understand, run, audit, and change the systems it depends on, rather than being locked into any single vendor.',
            nyc: 'Every proprietary contract renewal NYC can’t walk away from is a sovereignty question. Open source is the strongest structural answer.',
            link: { url: 'https://en.wikipedia.org/wiki/Digital_sovereignty', label: 'Wikipedia' },
        },
        {
            slug: 'gdc',
            term: 'Global Digital Compact (GDC)',
            def: 'The framework adopted by UN member states in September 2024 committing to an inclusive, open, safe and secure digital future — with digital public goods and infrastructure named as shared priorities.',
            nyc: 'The GDC is the diplomatic umbrella. When NYC aligns local tech policy with it, the city speaks a language 193 member states have already agreed to.',
            link: { url: 'https://www.un.org/global-digital-compact', label: 'un.org' },
        },
        {
            slug: 'open-standards',
            term: 'Open Standards & Interoperability',
            def: 'Publicly documented formats and protocols that let systems from different makers work together — the difference between an ecosystem and a lock-in.',
            nyc: 'Writing open standards into procurement is the single highest-leverage clause NYC’s buyers control.',
            link: { url: 'https://en.wikipedia.org/wiki/Open_standard', label: 'Wikipedia' },
        },
        {
            slug: 'dpi-safeguards',
            term: 'Universal DPI Safeguards Framework',
            def: 'A UN-backed framework for building digital public infrastructure that protects rights by design — privacy, security, inclusion, and accountability baked in from the start.',
            nyc: 'A ready-made rights checklist NYC can apply to every resident-facing system it builds or buys — no need to invent one.',
            link: { url: 'https://www.dpi-safeguards.org/', label: 'dpi-safeguards.org' },
        },
        {
            slug: 'public-money-public-code',
            term: '"Public Money, Public Code"',
            def: 'The principle that software paid for by the public should be available to the public as open source — popularized in Europe and adopted as policy by cities like Munich.',
            nyc: 'A slogan NYC’s civic tech community already believes in; endorsement would make it official posture.',
            link: { url: 'https://publiccode.eu/', label: 'FSFE' },
        },
    ],
};

export const cases = {
    title: 'Governments Doing This Now',
    lede:
        'None of this is theoretical. Cities and nations have run open source government programs for years — and increasingly build them together, sharing one codebase across dozens of governments instead of each buying its own. Results NYC can learn from, and networks it can join.',
    items: [
        {
            place: 'Munich',
            image: 'https://assets.muenchen.de/logos/lhm/logo-lhm-muenchen-500.png',
            headline: '"Public money, public code" as council policy',
            body:
                'After a decade of hard-won lessons on desktop Linux, Munich came back smarter: a 2023 City Council motion created an OSPO inside its IT department with a dual mandate — use open source where it’s strong, and publish the city’s own software under "public money, public code."',
            lesson: 'The mature posture isn’t all-or-nothing migration — it’s an institutional office with a publish-by-default rule.',
            link: 'https://opensource.muenchen.de/ospo.html',
        },
        {
            place: 'Estonia',
            image: 'https://static1.squarespace.com/static/5a4f79d6aeb625d6f842c5d5/t/68f9ebdf485c9619c722cd2e/1761209311305/image2.jpg?format=1500w',
            headline: 'Open sourcing the national data backbone',
            body:
                'X-Road, the data exchange layer connecting Estonia’s entire digital state, was open sourced under the MIT license in 2016. Estonia and Finland founded a joint institute (NIIS) to steward it; their national systems federated in 2018, Iceland followed, and roughly 20 more countries now run it.',
            lesson: 'Opening core infrastructure didn’t weaken it — it turned one country’s backbone into a shared international standard with pooled maintenance.',
            link: 'https://x-road.global/',
        },
        {
            place: 'Germany',
            image: 'https://www.sovereign.tech/public/_1200x630_crop_center-center_82_none_ns/STA-Opengraph-Image.png?mtime=1730664693',
            headline: 'Funding the open source that everything runs on',
            body:
                'Germany’s Sovereign Tech Agency (launched 2022) has invested over €24 million in 60+ critical open source components — the libraries, protocols, and tools every government and company silently depends on. Demand tells the story: nearly 500 applications seeking €114M+.',
            lesson: 'Open source infrastructure needs maintenance money, and a public fund for it is now a proven, exportable model.',
            link: 'https://www.sovereign.tech/',
        },
        {
            place: 'India',
            image: 'https://mosip.io/images/mosipn-logo.png',
            headline: 'DPI at population scale',
            body:
                'India’s digital public infrastructure — open APIs and platforms for identity and payments — shows what shared rails do at scale: UPI processes billions of transactions a month across hundreds of competing apps. The open source ID platform MOSIP, born of the same thinking, is now adopted by countries across Asia and Africa.',
            lesson: 'When the rails are open and interoperable, the private sector competes on top of them instead of owning them.',
            link: 'https://www.mosip.io/',
        },
        {
            place: 'DHIS2',
            image: 'https://dhis2.org/wp-content/uploads/Homepage_Cover_02.png',
            headline: 'Health data for 80+ countries, one codebase',
            body:
                'DHIS2, stewarded by the University of Oslo with a global network of regional support groups, is the government health-information system of record in more than 80 countries — reaching roughly 3.2 billion people. National ministries co-fund and shape a single shared open source platform instead of buying 80 separate ones.',
            lesson: 'A public institution can steward critical government software as a shared good for decades. Pooled maintenance beats duplicated procurement.',
            link: 'https://dhis2.org/',
        },
        {
            place: 'OpenCRVS',
            image: 'https://open-crvs.transforms.svdcdn.com/production/images/home.png?w=1200&h=630&q=82&auto=format&fit=crop&dm=1655725042&s=f306d335af06d70774e6fd02e8e4dee1',
            headline: 'Civil registration, configured per country',
            body:
                'OpenCRVS is an open source birth-, death-, and marriage-registration platform built for multi-country adoption: configurable workflows adapt to each nation’s laws, and it interoperates with identity (MOSIP), payments, and health (DHIS2) systems. A digital public good governments deploy and extend together.',
            lesson: 'Foundational government systems can be built once as open standards and localized per jurisdiction — exactly the reusability NYC procurement could ask for.',
            link: 'https://www.opencrvs.org/',
        },
    ],
};

/* Global map — governments and institutions advancing public-sector open source. */
export const primerMapMarkers = [
    { type: 'ask', lat: 40.7489, lng: -73.968, label: 'New York City — next?', desc: 'Host of UN Open Source Week. The campaign: make NYC the first city in the Americas to endorse the UN Open Source Principles.' },
    { type: 'city', lat: 41.3874, lng: 2.1686, label: 'Barcelona', desc: 'First city in the world to endorse the UN Open Source Principles (Nov 2025) — with an OSPO, citizen agreement, and municipal open source fund.' },
    { type: 'city', lat: 48.8566, lng: 2.3522, label: 'Paris', desc: 'Pioneer city OSPO (est. 2019); its open source Lutèce platform runs 300+ city services and has been redeployed abroad.' },
    { type: 'city', lat: 48.1351, lng: 11.582, label: 'Munich', desc: 'City Council–mandated OSPO (2023) operating under "public money, public code."' },
    { type: 'nation', lat: 59.437, lng: 24.7536, label: 'Estonia (Tallinn)', desc: 'Open sourced X-Road, the data exchange layer of its digital state, under MIT (2016); co-founded NIIS to steward it.' },
    { type: 'nation', lat: 60.1699, lng: 24.9384, label: 'Finland (Helsinki)', desc: 'Co-founder of NIIS; federated its national data exchange with Estonia’s in 2018.' },
    { type: 'nation', lat: 64.1466, lng: -21.9426, label: 'Iceland (Reykjavík)', desc: 'Runs Straumurinn, its national X-Road environment — open infrastructure crossing borders.' },
    { type: 'nation', lat: 52.52, lng: 13.405, label: 'Germany (Berlin)', desc: 'Sovereign Tech Agency: €24M+ invested in maintaining critical open source; ZenDiS builds openDesk for public administration. Both endorsed the UN Principles.' },
    { type: 'nation', lat: 12.9716, lng: 77.5946, label: 'India (Bengaluru)', desc: 'DPI at population scale (identity, payments) and home of MOSIP, the open source ID platform adopted internationally.' },
    { type: 'nation', lat: 8.4657, lng: -13.2317, label: 'Sierra Leone (Freetown)', desc: 'Ministerial voice at UN OSW 2026 — part of a wide Global South presence shaping the agenda.' },
    { type: 'nation', lat: 17.9714, lng: -76.7931, label: 'Jamaica (Kingston)', desc: 'At the ministerial table at UN OSW 2026 as the Caribbean engages DPI and open source.' },
    { type: 'un', lat: 46.2044, lng: 6.1432, label: 'Geneva — UN system', desc: 'ITU, UNICC and the wider UN digital ecosystem driving open standards and shared platforms.' },
    { type: 'un', lat: 40.7505, lng: -73.9682, label: 'UN Headquarters, NYC', desc: 'Where the UN CEB Digital & Technology Network adopted the eight Principles — and where the world’s open source movement meets every June.' },
];

export const primerMapLegend = [
    { type: 'city', label: 'Cities leading' },
    { type: 'nation', label: 'National programs' },
    { type: 'un', label: 'UN system' },
    { type: 'ask', label: 'NYC — the ask' },
];

export const endorsers = {
    title: 'Who Has Already Signed On',
    lede:
        'The Open Source Initiative was first to endorse the UN Open Source Principles; sixteen more organizations — foundations, industry, and public agencies — joined in  March 2025.',
    orgs: [
        { name: 'Open Source Initiative (first endorser)', url: 'https://opensource.org/' },
        { name: 'The Linux Foundation', url: 'https://www.linuxfoundation.org/' },
        { name: 'Eclipse Foundation', url: 'https://www.eclipse.org/' },
        { name: 'GNOME Foundation', url: 'https://foundation.gnome.org/' },
        { name: 'The Document Foundation', url: 'https://www.documentfoundation.org/' },
        { name: 'Open Knowledge Foundation', url: 'https://okfn.org/' },
        { name: 'Open Forum Europe', url: 'https://openforumeurope.org/' },
        { name: 'OpenInfra Foundation', url: 'https://openinfra.dev/' },
        { name: 'Matrix.org Foundation', url: 'https://matrix.org/' },
        { name: 'Sovereign Tech Agency', url: 'https://www.sovereign.tech/' },
        { name: 'ZenDiS — Centre for Digital Sovereignty', url: 'https://zendis.de/' },
        { name: 'Nextcloud', url: 'https://nextcloud.com/' },
        { name: 'Rocket.Chat', url: 'https://www.rocket.chat/' },
        { name: 'Linagora', url: 'https://www.linagora.com/' },
        { name: 'RTE (Réseau de Transport d’Électricité)', url: 'https://www.rte-france.com/' },
        { name: 'Linux Professional Institute', url: 'https://www.lpi.org/' },
        { name: 'European Open Source Academy', url: 'https://opensource.academy/' },
    ],
};

export const primerResources = {
    title: 'Primary Sources',
    lede: 'Read the frameworks, browse the registries, join the communities.',
    groups: [
        {
            title: 'Start Here',
            links: [
                { text: 'UN Open Source Week', url: 'https://www.unopensource.org/', desc: 'The annual convening at UN HQ — agenda, recordings, and community.' },
                { text: 'The UN Open Source Principles', url: 'https://unite.un.org/en/news/sixteen-organizations-endorse-un-open-source-principles', desc: 'The eight principles and the launch announcement.' },
                { text: 'Global Digital Compact', url: 'https://www.un.org/global-digital-compact', desc: 'The member-state framework naming DPGs and DPI as shared priorities.' },
            ],
        },
        {
            title: 'Directories & Registries',
            links: [
                { text: 'DPI Map (UCL IIPP)', url: 'https://dpimap.org/', desc: 'Interactive world map — click any country to see the digital ID, payment, and data-exchange systems it uses. 210 countries; 2025 State of DPI report.' },
                { text: 'DPG Standard & Registry (DPGA)', url: 'https://www.digitalpublicgoods.net/registry', desc: 'The vetted registry of digital public goods, filterable by SDG and searchable by deployment.' },
                { text: 'Universal DPI Safeguards', url: 'https://www.dpi-safeguards.org/', desc: 'The rights-by-design framework for public digital infrastructure.' },
                { text: 'GovStack', url: 'https://www.govstack.global/', desc: 'Building-block specifications for government digital services.' },
                { text: 'X-Road', url: 'https://x-road.global/', desc: 'The open source data exchange layer run by 20+ countries.' },
            ],
        },
        {
            title: 'Communities of Practice',
            links: [
                { text: 'TODO Group', url: 'https://todogroup.org/', desc: 'The practitioner community for running an OSPO — guides and templates.' },
                { text: 'OSPO Alliance', url: 'https://ospo-alliance.org/', desc: 'European-rooted alliance with an OSPO onboarding handbook.' },
                { text: 'EU Open Source Observatory (OSOR)', url: 'https://interoperable-europe.ec.europa.eu/collection/open-source-observatory-osor', desc: 'Case studies and news on public-sector open source across Europe.' },
                { text: 'Code for America', url: 'https://codeforamerica.org/', desc: 'The US civic tech network — the domestic ally ecosystem.' },
            ],
        },
        {
            title: 'Money & Maintenance',
            links: [
                { text: 'Sovereign Tech Agency', url: 'https://www.sovereign.tech/', desc: 'Germany’s public fund for maintaining critical open source infrastructure.' },
                { text: 'Digital Public Goods Alliance', url: 'https://www.digitalpublicgoods.net/', desc: 'Pathways to fund, certify, and scale DPGs.' },
                { text: 'MOSIP', url: 'https://www.mosip.io/', desc: 'The open source ID platform — a study in sustainably governed DPI.' },
            ],
        },
    ],
};

export const contacts = {
    title: 'People to Call',
    lede:
        'Outward-facing organizations — with public contact channels — whose job is helping governments adopt open source, DPGs, and DPI.',
    note: 'All channels listed are the organizations’ own public contact points.',
    groups: [
        {
            title: 'UN System',
            items: [
                {
                    org: 'UN Office for Digital and Emerging Technologies (ODET)',
                    role: 'Stewards the Global Digital Compact follow-up; led by USG Amandeep Singh Gill, the UN’s top digital official.',
                    helps: 'Connecting city digital policy to UN processes and the GDC.',
                    url: 'https://www.un.org/digital-emerging-technologies/',
                },
                {
                    org: 'UN Open Source Week organizers (OICT)',
                    role: 'The team behind the annual convening at UN Headquarters.',
                    helps: 'Getting NYC officials into the room every June — the single easiest first step.',
                    url: 'https://www.unopensource.org/',
                },
            ],
        },
        {
            title: 'Global Institutions',
            items: [
                {
                    org: 'Digital Public Goods Alliance (DPGA)',
                    role: 'The multi-stakeholder body that maintains the DPG Standard and registry.',
                    helps: 'Certifying NYC-built tools as DPGs; finding vetted open solutions to adopt.',
                    url: 'https://www.digitalpublicgoods.net/',
                },
                {
                    org: 'Centre for Digital Public Infrastructure (CDPI)',
                    role: 'Advisory center (co-founded by India Stack architects) that runs a help desk for governments building DPI.',
                    helps: 'Free architectural guidance for any DPI effort NYC takes on.',
                    url: 'https://cdpi.dev/',
                },
                {
                    org: 'TODO Group',
                    role: 'The global community of OSPO practitioners, hosted at the Linux Foundation.',
                    helps: 'Playbooks, templates, and peer mentors for standing up an NYC OSPO.',
                    url: 'https://todogroup.org/',
                },
                {
                    org: 'Open Forum Europe',
                    role: 'Policy think tank on open technologies; among the sixteen endorsers of the UN Principles.',
                    helps: 'Policy language and precedent from European open source legislation.',
                    url: 'https://openforumeurope.org/',
                },
                {
                    org: 'Sovereign Tech Agency',
                    role: 'Germany’s public investor in open source maintenance — and an endorser of the UN Principles.',
                    helps: 'The blueprint for public funding of critical open infrastructure.',
                    url: 'https://www.sovereign.tech/',
                },
            ],
        },
        {
            title: 'New York City',
            items: [
                {
                    org: 'NYC Office of Technology & Innovation (OTI)',
                    role: 'The city’s central technology agency — the campaign’s primary addressee and the natural home of an NYC OSPO.',
                    helps: 'The decision. Endorsing the Principles starts here.',
                    url: 'https://www.nyc.gov/content/oti/pages/',
                },
                {
                    org: 'Mayor’s Office for International Affairs',
                    role: 'NYC’s bridge to the UN and diplomatic community; ran the first-ever Voluntary Local Review.',
                    helps: 'The city-to-UN channel — the office that makes an endorsement diplomatic reality.',
                    url: 'https://www.nyc.gov/site/international/index.page',
                },
                {
                    org: 'WeGovNYC / Sarapis',
                    role: 'The civic tech organizers behind this campaign.',
                    helps: 'Briefings, introductions, and the open letter itself — we’re the local convener.',
                    url: '/campaign',
                    internal: true,
                },
            ],
        },
    ],
};

/*
 * Find an OSPO — public-sector Open Source Program Offices already
 * running elsewhere, sourced from the FLOSS PSO Network's directory
 * (https://floss-pso.network/all_public_sector_ospos.yaml). Hand-transcribed
 * from that YAML on 2026-08-03; re-check the source before assuming this
 * list is current — the network adds new OSPOs regularly.
 */
export const ospoDirectory = {
    title: 'Find an OSPO',
    lede: 'Public-sector Open Source Program Offices already running elsewhere.',
    sourceUrl: 'https://floss-pso.network/',
    groups: [
        {
            country: 'United States',
            items: [
                {
                    name: 'OSPO at Digital Service at the Centers for Medicare and Medicaid Services',
                    url: 'https://cms.gov/digital-service/open-source-program-office',
                    description: 'Establish and maintain guidance, policies, practices, and talent pipelines that advance equity, build trust, and amplify impact across CMS, HHS, and Federal Open Source Ecosystems by working and sharing openly.',
                    email: 'opensource@cms.hhs.gov',
                    flossPolicy: 'https://github.com/CMSgov/cms-open-source-policy',
                },
            ],
        },
        {
            country: 'International',
            items: [
                {
                    name: 'United Nations Development Programme (UNDP)',
                    url: 'https://undp.org/digital',
                    description: 'UNDP Open Source Ecosystem Enablement.',
                    email: 'opensource@undp.org',
                },
            ],
        },
        {
            country: 'Germany',
            items: [
                {
                    name: 'Open Source Program Office City of Munich',
                    url: 'https://opensource.muenchen.de/ospo.html',
                    description: 'Use – Improve – Publish: FOSS at the City of Munich.',
                    email: 'opensource@muenchen.de',
                    flossPolicy: 'https://opensource.muenchen.de/principles.html',
                },
                {
                    name: 'Open Source Program Office of the State of Schleswig-Holstein',
                    url: 'https://schleswig-holstein.de/open-source',
                    description: 'The state government’s central coordination office for the strategic use of open source software, aimed at ensuring digital sovereignty.',
                    email: 'ospo-sh@stk.landsh.de',
                    flossPolicy: 'https://gdi-sh.de/DE/landesregierung/themen/digitalisierung/linux-plus1/Projekt/open-source-strategie',
                },
            ],
        },
        {
            country: 'Denmark',
            items: [
                {
                    name: 'OS2 – Public Digitalization Network',
                    url: 'https://os2.eu',
                    description: 'An organisation of public bodies in Denmark that together develop, mature, and maintain public code.',
                    email: 'os2@os2.eu',
                    flossPolicy: 'https://github.com/OS2offdig/about',
                },
            ],
        },
        {
            country: 'Greece',
            items: [
                {
                    name: 'Open Technologies Centre at the Aristotle University of Thessaloniki',
                    url: 'https://opentech.auth.gr/',
                    description: 'Promotes and harnesses the transformative potential of open technologies — technologies defined by their openness to free use, analysis, modification, and redistribution by any user.',
                    email: 'opentech@auth.gr',
                },
            ],
        },
        {
            country: 'France',
            items: [
                {
                    name: 'Pôle Open Source et Communs Numériques de la DINUM',
                    url: 'https://code.gouv.fr',
                    description: 'A mission dedicated to the use, development, and promotion of Free Software and digital commons in public administration.',
                    email: 'floss@numerique.gouv.fr',
                    flossPolicy: 'https://code.gouv.fr/fr/mission/#politique-logiciels-libres',
                },
                {
                    name: 'ANSSI',
                    url: 'https://cyber.gouv.fr/enjeux-technologiques/open-source/',
                    description: 'The team handling open source topics at the French Cybersecurity Agency (ANSSI).',
                    email: 'opensource@ssi.gouv.fr',
                },
                {
                    name: 'OSPO de France Travail',
                    url: 'https://francetravail.io/opportunites-innovation/participer-initiatives-open-source',
                    description: 'France Travail’s (the French employment agency) Open Source Programme Office.',
                    email: 'oss.00619@francetravail.fr',
                },
                {
                    name: 'OSPO de la Ville de Paris',
                    url: 'https://opensource.paris.fr',
                    description: 'Open Source Program Office for the City of Paris.',
                    email: 'opensource@paris.fr',
                },
                {
                    name: 'Pôle de compétences Logiciels Libres de l’Éducation nationale',
                    url: 'https://pcll.ac-dijon.fr',
                    description: 'Develops open source software for the French national education system.',
                    email: 'eole@ac-dijon.fr',
                },
                {
                    name: 'Cellule Codes Données Grenoble Alpes',
                    url: 'https://scienceouverte.univ-grenoble-alpes.fr/a-propos/cellule-data-grenoble-alpes',
                    description: 'Supports the Grenoble area’s scientific communities on matters relating to research data and code.',
                    email: 'sos-codes-recherche@univ-grenoble-alpes.fr',
                },
                {
                    name: 'Direction de la stratégie et de la culture numériques (DSCN), Échirolles',
                    url: 'https://www.echirolles.fr/territoire-numerique',
                    description: 'Responsible for digital technology and strategy for the city of Échirolles.',
                    email: 'nicolas.vivant@echirolles.fr',
                    flossPolicy: 'https://www.echirolles.fr/sites/default/files/2022-09/Schema_directeur_numerique.pdf',
                },
                {
                    name: 'OSPO de l’IGN',
                    url: 'https://www.ign.fr/institut/des-donnees-et-logiciels-ouverts-au-service-de-la-nation',
                    description: 'The Open Source Programme Office of the French National Institute for Geographic and Forestry Information.',
                    email: 'opensource@ign.fr',
                },
                {
                    name: 'RECIA',
                    url: 'https://www.recia.fr',
                    description: 'A Public Interest Group providing shared IT services to French schools.',
                    email: 'contact@recia.fr',
                    flossPolicy: 'https://www.recia.fr/innovation-logiciels-libres',
                },
                {
                    name: 'OSPO de la Ville et l’Eurométropole de Strasbourg',
                    url: 'https://www.strasbourg.eu/strategie-logiciels-libres',
                    description: 'The "Free Software Strategy" unit of the city and Eurometropole of Strasbourg, promoting the use and development of Free Software within the territory.',
                    email: 'opensource@strasbourg.eu',
                },
            ],
        },
        {
            country: 'Netherlands',
            items: [
                {
                    name: 'OSPO National Government The Netherlands',
                    url: 'https://opensourcewerken.nl/',
                    description: 'The national OSPO of the Netherlands, currently housed at the Ministry of the Interior and Kingdom Relations (BZK).',
                    email: 'ospo@minbzk.nl',
                    flossPolicy: 'https://github.com/MinBZK/Open-Source-Program-Office',
                },
                {
                    name: 'Developer.overheid.nl',
                    url: 'https://developer.overheid.nl',
                    description: 'The developer portal of the Dutch government.',
                    email: 'developer.overheid@geonovum.nl',
                },
            ],
        },
    ],
};

/*
 * The Eight UN Open Source Principles, structured to match the UN's own
 * "Open by Default" one-pager: the lead principle called out on its own,
 * the remaining seven grouped under the UN's own three headings. Shared
 * between the live section (PrincipleDefinitions.js on /start) and
 * its standalone printable version (/start/principles).
 *
 * principleIcon(n) maps to /principle-icons/princN.png, using the SAME
 * numbering as data/unnyc.js's `openSource.principles` array (Open by
 * default=1, Contribute back=2, Secure by design=3, Foster inclusion=4,
 * Design for reusability=5, Provide documentation=6, RISE=7, Sustain and
 * scale=8) and the crosswalk page — not the grouped order below.
 */
export const principleIcon = (n) => `/principle-icons/princ${n}.png`;

export const principlesDoc = {
    lead: {
        icon: principleIcon(1),
        title: 'Open by default',
        body: [
            'Making the use of open source software components to build city solutions the standard and default approach to creating software.',
            'There are very few scenarios when open source isn’t appropriate, and vendors ought to justify why their solutions should be closed, not the other way around.',
        ],
    },
    groups: [
        {
            title: 'Building Good Software that is…',
            items: [
                { icon: principleIcon(3), title: 'Secure by design', desc: 'Making security a priority in all software projects.' },
                { icon: principleIcon(5), title: 'Designed for reusability', desc: 'Designing projects to be interoperable across various platforms and ecosystems.' },
                { icon: principleIcon(6), title: 'Well documented', desc: 'Providing thorough documentation for end-users, integrators and developers.' },
            ],
        },
        {
            title: 'Cocreating our Solutions with our Users through…',
            items: [
                { icon: principleIcon(4), title: 'Fostering inclusive participation and community building', desc: 'Enabling and facilitating diverse and inclusive contributions.' },
                { icon: principleIcon(7), title: 'RISE (recognize, incentivize, support and empower)', desc: 'Empowering individuals and communities to actively participate.' },
            ],
        },
        {
            title: 'Collaborating Globally and Delivering Locally by…',
            items: [
                { icon: principleIcon(2), title: 'Contributing back', desc: 'Encouraging active participation in the Open Source ecosystem.' },
                { icon: principleIcon(8), title: 'Sustaining and scaling', desc: 'Supporting the development of solutions that meet the evolving needs of the UN system and beyond.' },
            ],
        },
    ],
};
