---
# The model local law for council.opensource.nyc/bill.
#
# ⚠ MODEL LANGUAGE, NOT A COUNCIL BILL. It was not drafted by the Council's
# Legislative Drafting division and has no Intro number. Section numbers are
# placeholders ("§ 23-X01") because the chapter a sponsor's office would use is
# theirs to assign. Owner/counsel review is REQUIRED before COUNCIL_LIVE flips
# (src/lib/seo.js) — every fact a reader could check is listed under `checks`.
#
# Structure: `provisions` are the plain-English summaries the homepage shows;
# each `anchor` must match a `### ` block in the body below (rendered as the
# bill's sections), so the summary and the text it summarises cannot drift.
meta:
  title: "The Model Bill — Open by Default NYC"
  description: "Model local-law text for an open-source-by-default New York City: publish the code the City pays for, and look for open source before renewing a licence."
  ogTitle: "A Model Open Source by Default Law for New York City"
  ogDescription: "Publish the code New York pays for. Check for an open alternative before renewing a licence. Report every year."
kicker: "Model local law"
title: "Open Source by Default"
billTitle: "A Local Law to amend the administrative code of the city of New York, in relation to open source software by default"
status: "Model language for discussion. Not introduced; not drafted by the Council's Legislative Drafting division. Section numbers are placeholders."
provisions:
  - anchor: "definitions"
    title: "Says what counts"
    summary: "Defines custom software (code the City pays to have written), open source licences (those the Open Source Initiative approves), and the public repository the code goes in."
  - anchor: "publication"
    title: "Publish the code the City pays for"
    summary: "New custom software is released under an open source licence and published within 90 days of going into use. Contracts must give the City the rights to do it."
  - anchor: "exceptions"
    title: "Exceptions in writing, in public"
    summary: "Code can be withheld only on stated grounds — security, privacy, third-party rights, law enforcement — and every exception is written down, published and reviewed each year."
  - anchor: "procurement"
    title: "Look for an open alternative first"
    summary: "Before buying or renewing a proprietary licence above the small-purchase limit, an agency records whether an open source option would meet the need, and why not."
  - anchor: "office"
    title: "Give it an owner"
    summary: "The Office of Technology and Innovation runs an open source program office: standards, the public repository index, and help for agencies."
  - anchor: "reporting"
    title: "Report every year"
    summary: "An annual public report to the Mayor and the Speaker, also published as open data: what was released, what was withheld and why, and what was bought instead."
checks:
  - "Admin Code Title 23 is the right home (the Open Data Law, LL 11/2012, sits in Title 23, Chapter 5) — sponsor's office assigns the chapter."
  - "OSI-approved licence list as the definition of open source — or name a list the City maintains."
  - "90-day publication window and 180-day effective date — both judgement calls."
  - "Small-purchase threshold as the review trigger — check the current PPB figure."
  - "Exceptions track Public Officers Law § 87(2) (FOIL) grounds; counsel to confirm."
  - "\"Agency\" borrows the definition in Charter § 1150 — confirm it is the one wanted (the Open Data Law uses its own)."
---

## preamble

Be it enacted by the Council as follows:

**Section 1.** Title 23 of the administrative code of the city of New York is amended by adding a new chapter X to read as follows:

**CHAPTER X — OPEN SOURCE SOFTWARE BY DEFAULT**

### definitions

**§ 23-X01 Definitions.** For the purposes of this chapter, the following terms have the following meanings:

*Agency.* The term "agency" has the meaning set forth in section 1150 of the charter.

*Custom software.* The term "custom software" means computer software, including its source code and documentation, that is developed or substantially modified for an agency, whether by agency employees or by a contractor, and that is paid for in whole or in part with city funds. It does not include software that is licensed to an agency without modification for the city.

*Open source license.* The term "open source license" means a license approved by the Open Source Initiative, or by such other body as the department may designate by rule, that permits any person to use, study, modify and redistribute software.

*Public code repository.* The term "public code repository" means a publicly accessible online system, designated by the department, in which source code is published together with its license and documentation.

*Department.* The term "department" means the office of technology and innovation, or any successor agency.

### publication

**§ 23-X02 Publication of custom software.** a. Within 90 days after custom software is first put into use, the agency for which it was developed shall publish its source code in a public code repository under an open source license, unless an exception has been determined pursuant to section 23-X03.

b. Every contract entered into or renewed on or after the effective date of this chapter for the development of custom software shall grant the city rights sufficient to publish that software under an open source license.

c. An agency may contribute modifications of open source software back to the project from which that software came, in accordance with standards issued by the department.

### exceptions

**§ 23-X03 Exceptions.** a. An agency may withhold all or part of the source code of custom software only where publication would:

1. disclose information exempt from disclosure under section 87 of the public officers law;
2. create a specific, documented risk to the security of a city system, beyond the general risk of making source code public;
3. infringe the rights of a third party that the city could not reasonably have obtained; or
4. interfere with a law enforcement investigation or judicial proceeding.

b. Each exception shall be determined in writing by the agency head, shall state which part of the software is withheld and on what ground, and shall be published in the public code repository index within 30 days of the determination.

c. Each exception shall be reviewed annually, and the withheld code published once the ground for withholding it no longer applies.

### procurement

**§ 23-X04 Open source review in procurement.** a. Before entering into or renewing a contract for the license of proprietary software with a value above the small purchase limit established by the procurement policy board, an agency shall evaluate whether open source software would meet the agency's needs.

b. The evaluation shall be in writing, shall consider total cost of ownership over the expected life of the software, interoperability, security and the availability of support, and shall be included in the public record of the procurement.

c. Nothing in this section requires an agency to select open source software where its evaluation finds that proprietary software better meets the agency's needs.

### office

**§ 23-X05 Open source program office.** The department shall establish an open source program office, which shall:

1. issue standards for the publication, licensing, documentation and security review of custom software;
2. maintain the public code repository and a public index of all custom software published or withheld under this chapter;
3. assist agencies with the evaluations required by section 23-X04; and
4. coordinate the city's contributions to open source projects on which city systems depend.

### reporting

**§ 23-X06 Annual report.** No later than December 1 of each year, the department shall submit to the mayor and the speaker of the council, publish on its website and publish on the open data portal a report for the preceding fiscal year that includes:

1. each item of custom software published under section 23-X02, by agency;
2. each exception determined under section 23-X03, with its ground, and each exception lifted;
3. each evaluation under section 23-X04, with its outcome and the value of the contract; and
4. the total amount spent by agencies on licenses for proprietary software.

## enactment

**§ 2.** This local law takes effect 180 days after it becomes law, except that the department shall take such measures as are necessary for its implementation, including the promulgation of rules, before such date.
