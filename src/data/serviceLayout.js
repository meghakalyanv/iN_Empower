/**
 * What each section of a service is — shared by the website and the mobile app.
 * Edit here only; the app copies it with `npm run sync-data`.
 *
 *   'papers' — things the customer keeps ready (data and documents): a tick list
 *   'choose' — options the customer picks from (service models, kinds of work)
 *   'jobs'   — the service holds several separate jobs (e.g. Learner's licence /
 *              Permanent DL / Renewal); the customer picks one job, then sees only
 *              that job's papers
 *   'ask'    — a question with one answer (site size, budget, when to start);
 *              marked in servicesData with  pick: 'one'
 *              (typeHint: what the customer can type instead, e.g. "Ongole → Hyderabad")
 *   'info'   — read-only information (how it works, our promise)
 */

// Services whose sections are separate jobs, each with its own papers.
export const JOB_SERVICES = ['learners-driving-license', 'vehicle-registration-rc', 'permits-fitness', 'voter-id']

const PAPERS = /data required|documents required/i
const INFO = /good to know|please note|quality assurance|our assurance|process|how it works|vetting|coverage|features|how to book|conditions treated|where .* needed|what to share/i
const CHOOSE = /model|offering|offered|what we offer|what do you need|assistance|services provided|support offered|service types|service options|what to cover|deliverables|where|ceremonies/i

// Categories where every section is a kind of work to choose from.
const CHOOSE_CATEGORIES = ['electricity', 'ac-services']

export const SECTION_KINDS = ['papers', 'choose', 'ask', 'info']

export function sectionKind(service, section) {
  if (JOB_SERVICES.includes(service.id)) return 'jobs'
  // Sections edited in the admin portal say what they are
  if (SECTION_KINDS.includes(section.kind)) return section.kind
  if (section.pick === 'one') return 'ask'
  const h = section.heading || ''
  if (PAPERS.test(h)) return 'papers'
  if (INFO.test(h)) return 'info'
  if (CHOOSE_CATEGORIES.includes(service.category) || CHOOSE.test(h)) return 'choose'
  return 'info'
}

/** The service's sections grouped by kind, in their original order. */
export function serviceLayout(service) {
  const out = { papers: [], choose: [], jobs: [], ask: [], info: [] }
  for (const sec of service?.sections || []) out[sectionKind(service, sec)].push(sec)
  return out
}
