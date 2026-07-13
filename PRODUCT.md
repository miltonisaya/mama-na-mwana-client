# Product

## Register

product

## Platform

web

## Users

Two groups share this portal. The **primary** audience is program operators and officers at Tanzania's Ministry of Health and implementing partners — largely non-technical, desk-based staff who monitor pregnant-mother and child health data as it moves through the RapidPro → DHIS2 pipeline: checking dashboards, managing contacts, and configuring flows and data-element mappings. The **secondary** audience is technical/IT support staff, who care less about program-level stats and more about transaction and error monitoring — retrying failed transactions and keeping the integration healthy day to day.

## Product Purpose

An admin portal for the Mama na Mwana health integration middleware, giving both groups a working surface over an otherwise invisible backend pipeline: dashboards, contact management, flow and data-element configuration, and transaction monitoring. Success is an operator catching and resolving a pipeline failure (a stuck contact, a failed transaction, a bad mapping) without needing an engineer.

## Positioning

The portal gives staff **operational control, not just visibility** — the ability to actively reconfigure flows and data mappings and retry failed transactions, not merely observe that something went wrong.

## Brand Personality

Trustworthy and clinical: precise and dependable, the way health-sector software should feel, with no ambiguity in what a status or number means. Calm and low-friction: failure states (failed transactions, stuck contacts) should read clearly without alarming the operator past what the severity warrants. Efficient and dense: this is used daily by people who need to scan fast and act in few clicks, not a leisurely browse.

## Anti-references

None specified by the user; no particular product or style to avoid imitating. Default to sober, restrained admin-tool conventions rather than marketing flourish.

## Design Principles

- **Control over observation** — every view that shows a problem (a failed transaction, a misconfigured mapping) should carry a clear path to fix it, not just report it.
- **Calm under failure** — reserve alarm-red and heavy visual weight for states that actually warrant urgency; routine operational noise (pending, retrying) should read as normal, not emergency.
- **Dense but scannable** — favor information density suited to daily, expert use, but keep hierarchy strong enough that operators find the one number or row they need quickly.
- **Precision reads as trust** — exact states, exact counts, exact timestamps; no vague labels or ambiguous icons in a system tracking health data.
- **Two audiences, one shell** — program officers and technical staff share the same navigation and layout; don't fork the UI, but let each section's density and vocabulary suit whichever audience it primarily serves (dashboards/contacts for operators, transactions/outbox for technical staff).

## Accessibility & Inclusion

Standard WCAG 2.1 AA: sufficient color contrast (including on status/badge colors), full keyboard navigation, and no information conveyed by color alone (pair status colors with icons/labels).
