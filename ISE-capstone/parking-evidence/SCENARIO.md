# Source extraction and scope decision

## Provenance and reading limits

The instructor supplied `R20260928-1.jpg` through `R20260928-4.jpg` in the course Assignments directory. They were visually read, not treated as executable code or as evidence of a running business. [Image hashes](sources/image-provenance.json) identify the originals. We publish this English extraction rather than reproduce photographed answer sheets. Some words near the right edge are clipped; the summaries below retain the legible meaning and flag uncertainty. The pages contain prose descriptions of code and requests, not a complete Rails repository.

| Source and region | English extraction | Evidential status |
| --- | --- | --- |
| Page 1, project goals | Improve parking-service efficiency and experience; reduce manual cost and human mistakes through automation. | Proposed goals; no baseline supplied. |
| Page 1, automation | Recognize a license plate from camera images; calculate charges from entry/exit records; use WeChat Pay, Alipay or similar platforms for collection. | Proposed capabilities; provider access and recognition quality unproven. |
| Page 1, decision support | Recommend less occupied parking areas; detect/report irregular parking through surveillance; vary fees with traffic to influence demand. | Expansion ideas; no data or causal evidence supplied. |
| Page 1, charging and revenue | Pay per visit: duration × unit rate × coefficient; peak coefficient 1.5, ordinary coefficient 1. Monthly subscriptions are listed without rules. Assume 1,000 vehicles/day; revenue expression uses daily volume × fee per vehicle × operating days (365 for a year). | Classroom assumptions; occupancy, average stay, collection losses and costs absent. |
| Page 1, first scenario | With camera/system operating, a vehicle enters, parks and exits; verify entry/exit records correspond to actual times. | Happy-path acceptance idea; clock/source rules missing. |
| Page 2, scenarios 2–4 | Display and calculate duration correctly; retrieve duration and current rate, calculate fee; invoke WeChat payment and verify amount and recipient. | Verification intent; no recorded test results or payment trust contract. |
| Page 2, data and scaffolding | Fields include vehicle_id, entry_time, exit_time, rate, total_fee. Describe generating a Rails ParkingRecord model/migration and applying `rails db:migrate`. | Design sketch; source command itself is not fully shown. |
| Page 3, model | ParkingRecord inherits from ApplicationRecord; vehicle_id and entry_time must be present. | Described validations; insufficient for uniqueness, authorization or temporal consistency. |
| Page 3, controller | Create saves a record with current entry time. Update finds an unexited record by vehicle, records exit, calculates duration and fee, saves and returns success or a missing/already-exited error. Duration rounds upward in hours. Routes expose create/update. | Described algorithm; no runnable implementation furnished. Some right-edge prose is clipped. |
| Page 4, example calls | POST entry for ABC123; a PATCH exit yields duration 1 and total fee 10.0, with entry/exit data persisted. | Claimed illustrative response, not independently observed execution. Currency and exact timestamps are not specified. |
| Page 4, reflection | Discuss reusable methods/frameworks, user stories/use cases, investigating underlying needs, learning from existing systems, limiting change costs, evolving systems, and strengthening long-term maintenance experience. | Reflection themes to revisit in A3, A5 and A6. A few edge words are incomplete. |

## What the capstone chooses

**Working title:** Parking Evidence — explainable fees and trustworthy payment status for one parking lot.

**Candidate problem:** At an exit/payment desk, a driver and attendant need to agree which stay is being charged, why the amount is correct, and whether payment has actually completed. Missing or duplicate events, changing tariffs, or delayed notifications may create disputes and repeat work. This is a hypothesis to investigate in A1, not a claim that a particular lot has these failures.

**Core slice:** an authenticated attendant records a synthetic entry, requests a quote at a stated cutoff time, initiates a sandbox payment, receives a verified simulated server notification, and sees a receipt. A separate exit event closes the stay after settlement. A driver can view only their own authorized stay through a scoped session; a license plate is not an authentication secret.

The source conflates observed physical exit and financial settlement. We separate them so that a browser redirect cannot prove payment and a fee quote cannot prove a vehicle has left. No physical gate is actuated by this teaching application.

**Not in the first release:** actual camera recognition, real payment accounts, physical barriers, refunds, monthly subscriptions, automatic violation detection, occupied-space routing, and demand-based tariff optimization. Keep these as rejected/deferred options with revisit triggers. AI assists engineering; an LLM in the product is not required to solve this problem.

## Assumption register: operator confirmation required

| ID | Explicit teaching decision | Why this needs confirmation |
| --- | --- | --- |
| H01 | One lot; synthetic vehicle tokens; manually entered events in the prototype. | The image does not define identity quality or physical integration. |
| H02 | CNY; 1,000 fen/hour; each started hour is billed; zero duration costs zero. | Fee 10.0 and hourly ceiling appear in the source; currency, unit rate and zero behavior are added. |
| H03 | Tariff version and coefficient are fixed at entry; peak = 3/2, ordinary = 1. No grace period, cap or subscription initially. | “Current rate” is ambiguous; fixing a version prevents retrospective changes. |
| H04 | Integer seconds; timestamps have offsets and are stored in UTC; fen rounding is half-up, once, on the final amount. | Missing from the images; prevents float and timezone ambiguity. |
| H05 | A quote is payable for five minutes, including its expiry instant. Settlement at that amount permits manual checkout without an extra fee in this version. | Quote lifetime and post-payment overstay policy are added scope decisions. |
| H06 | Only server-verified notifications can settle payment; uncertain delivery stays pending until reconciliation. | Needed to make a payment integration defensible. |

H05 deliberately leaves a business limitation: extended occupation after payment requires operator handling. Do not silently add an overstay charge or command a gate. A2 and A6 revisit this decision.

## Revenue reasoning without fictional value

The source's annual gross illustration becomes `1,000 × average collected fee × 365`, only if both volume and operations persist. It is not profit or a forecast. Estimate incremental annual net value as saved staff minutes × labor cost per minute + reduced verified losses − hosting − payment fees − support − equipment − additional review cost. Compare against a clearer tariff board and a better manual ledger. Until A1/A6 obtain data, the value result is **unknown**. Higher parking fees are not evidence of improved driver experience.
