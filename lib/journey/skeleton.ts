/* The is the STRUCTURE of Medical Journey — phases, ordering, the milestone graph.
   Hand-written, versioned, and not generated and touched by LLM. 
   LLMs can hallucinate and give different answers to same questions, so we are 
   controlling How the structure will look like */

export const SKELETON_VERSION = 1;

export type Course = 'MBBS' | 'MD';

// Phase: represents a stage in the medical journey
export interface Phase {
  id: string;
  name: string;
  order: number;
  icon: string; // Icon name; will be handled dynamically in the frontend
  duration_weeks: number;
  difficulty: number; // 1–5
  milestones: Milestone[];
}

// Milestone: represents a specific step or checkpoint within a phase.
export interface Milestone {
  id: string;
  name: string;
  order: number; // 0-based, contiguous within its phase
  phase_id: string;
  prerequisite_ids: string[];
  tier: 'free' | 'paid';
  retrieval_query: string;
}

// ---------------------------------------------------------------------------
// Phase 0 — Pre-Application (free tier — the freemium hook, spec §10)
// Freemium for future, the whole thing is free for now
// ---------------------------------------------------------------------------

const PHASE_0: Phase = {
  id: 'phase_0',
  name: 'Pre-Application',
  order: 0,
  icon: 'graduationcap.fill',
  duration_weeks: 26,
  difficulty: 2,
  milestones: [
    {
      id: 'm0_1',
      name: 'High School Science Prerequisites',
      order: 0,
      phase_id: 'phase_0',
      prerequisite_ids: [],
      tier: 'free',
      retrieval_query:
        'high school subjects required for MBBS admission UAE biology chemistry physics grades 10-12 secondary school certificate',
    },
    {
      id: 'm0_2',
      name: 'EmSAT Achieve — Science',
      order: 1,
      phase_id: 'phase_0',
      prerequisite_ids: ['m0_1'],
      tier: 'free',
      retrieval_query:
        'EmSAT Achieve science exam biology chemistry physics minimum score 900 medical university admission requirement UAE',
    },
    {
      id: 'm0_3',
      name: 'English & Arabic Proficiency',
      order: 2,
      phase_id: 'phase_0',
      prerequisite_ids: ['m0_1'],
      tier: 'free',
      retrieval_query:
        'English proficiency EmSAT English IELTS TOEFL minimum score and EmSAT Arabic requirement medicine admission GMU MBRU Sharjah',
    },
    {
      id: 'm0_4',
      name: "Meet Your Curriculum's Grade Threshold",
      order: 3,
      phase_id: 'phase_0',
      prerequisite_ids: ['m0_1'],
      tier: 'free',
      retrieval_query:
        'MBBS admission minimum grade percentage by curriculum UAE advanced track CBSE ICSE IB A-levels American diploma Pakistan eligibility',
    },
    {
      id: 'm0_5',
      name: 'Shortlist & Apply to Universities',
      order: 4,
      phase_id: 'phase_0',
      prerequisite_ids: ['m0_2', 'm0_3', 'm0_4'],
      tier: 'free',
      retrieval_query:
        'how to apply MBBS program UAE application process GMU MBRU University of Sharjah RAK admissions committee interview application fee age requirement',
    },
  ],
};

// ------------------------------------------------------------------------------
// Phase 1 — Medical School. MBBS is 5 years; MD is the 6-year variant (2022+
// cohorts at GMU/MBRU) — differs only in Phase III duration/name. m1_1/m1_2/m1_4
// are shared between the two so a query edit can't drift between courses.
// ------------------------------------------------------------------------------

const M1_1: Milestone = {
  id: 'm1_1',
  name: 'Phase I — Pre-clinical Foundation',
  order: 0,
  phase_id: 'phase_1',
  prerequisite_ids: ['m0_5'],
  tier: 'paid',
  retrieval_query:
    'MBBS Phase I first year pre-clinical curriculum anatomy physiology biochemistry gate examination medical school UAE',
};

const M1_2: Milestone = {
  id: 'm1_2',
  name: 'Phase II — Pre-clerkship',
  order: 1,
  phase_id: 'phase_1',
  prerequisite_ids: ['m1_1'],
  tier: 'paid',
  retrieval_query:
    'MBBS Phase II pre-clerkship years 2-3 organ-system integrated curriculum research project IFOM progress test gate examination',
};

const M1_4: Milestone = {
  id: 'm1_4',
  name: 'Graduation Requirements',
  order: 3,
  phase_id: 'phase_1',
  prerequisite_ids: ['m1_3'],
  tier: 'paid',
  retrieval_query:
    'MBBS graduation requirements exit examination aggregate score continuous enrolment maximum period to complete degree GMU',
};

const M1_3_MBBS: Milestone = {
  id: 'm1_3',
  name: 'Phase III — Clerkship',
  order: 2,
  phase_id: 'phase_1',
  prerequisite_ids: ['m1_2'],
  tier: 'paid',
  retrieval_query:
    'MBBS Phase III clinical clerkship rotations medicine surgery pediatrics obstetrics gynaecology psychiatry exit examination years 4-5',
};

const M1_3_MD: Milestone = {
  ...M1_3_MBBS,
  name: 'Phase III — Clerkship (Years 4–6)',
  retrieval_query:
    'MD six-year program Phase III clinical clerkship rotations medicine surgery pediatrics obstetrics gynaecology psychiatry exit examination years 4-6',
};

const PHASE_1_MBBS: Phase = {
  id: 'phase_1',
  name: 'Medical School',
  order: 1,
  icon: 'stethoscope',
  duration_weeks: 260,
  difficulty: 4,
  milestones: [M1_1, M1_2, M1_3_MBBS, M1_4],
};

const PHASE_1_MD: Phase = {
  ...PHASE_1_MBBS,
  duration_weeks: 312,
  milestones: [M1_1, M1_2, M1_3_MD, M1_4],
};

// ---------------------------------------------------------------------------
// Phase 2 — Internship (House Officer Year)
// ---------------------------------------------------------------------------

const PHASE_2: Phase = {
  id: 'phase_2',
  name: 'Internship',
  order: 2,
  icon: 'cross.case.fill',
  duration_weeks: 52,
  difficulty: 3,
  milestones: [
    {
      id: 'm2_1',
      name: 'Complete the 1-Year Internship',
      order: 0,
      phase_id: 'phase_2',
      prerequisite_ids: ['m1_4'],
      tier: 'paid',
      retrieval_query:
        'one-year internship house officer mandatory post-graduation physician UAE must begin within 24 months of graduation DHA',
    },
    {
      id: 'm2_2',
      name: 'Internship Certificate & the 2-Year Alternative',
      order: 1,
      phase_id: 'phase_2',
      prerequisite_ids: ['m2_1'],
      tier: 'paid',
      retrieval_query:
        'internship completion certificate evidence licensing requirement without internship two additional years clinical experience DHA',
    },
  ],
};

// ---------------------------------------------------------------------------
// Phase 3 — Licensing. DataFlow is universal (one step for everyone); the exam
// is a single milestone whose retrieval pulls DHA + DOH + MOHAP together and
// whose requirements are authority-prefixed (spec §5, §8.4).
// ---------------------------------------------------------------------------

const PHASE_3: Phase = {
  id: 'phase_3',
  name: 'Licensing',
  order: 3,
  icon: 'checkmark.seal.fill',
  duration_weeks: 26,
  difficulty: 3,
  milestones: [
    {
      id: 'm3_1',
      name: 'DataFlow Primary Source Verification',
      order: 0,
      phase_id: 'phase_3',
      prerequisite_ids: ['m2_1'],
      tier: 'paid',
      retrieval_query:
        'DataFlow primary source verification PSV mandatory credential verification medical licence UAE degree certificate attestation timeline',
    },
    {
      id: 'm3_2',
      name: 'Get Licensed to Practise',
      order: 1,
      phase_id: 'phase_3',
      prerequisite_ids: ['m3_1'],
      tier: 'paid',
      retrieval_query:
        'DHA Prometric licensing exam Dubai 60% pass mark; DOH Abu Dhabi assessment TAMM good standing certificate; MOHAP Northern Emirates licensing exam physician clinical experience',
    },
  ],
};

// ---------------------------------------------------------------------------
// Phase 4 — Residency
// ---------------------------------------------------------------------------

const PHASE_4: Phase = {
  id: 'phase_4',
  name: 'Residency',
  order: 4,
  icon: 'person.2.fill',
  duration_weeks: 208,
  difficulty: 4,
  milestones: [
    {
      id: 'm4_1',
      name: 'Choose a Residency Pathway',
      order: 0,
      phase_id: 'phase_4',
      prerequisite_ids: ['m3_2'],
      tier: 'paid',
      retrieval_query:
        'medical residency programs UAE DOH MEAD matching Abu Dhabi, MBRU EMREE EDREE Dubai Health, EHS Northern Emirates specialties available',
    },
    {
      id: 'm4_2',
      name: 'Sit the Residency Entrance Exam',
      order: 1,
      phase_id: 'phase_4',
      prerequisite_ids: ['m4_1'],
      tier: 'paid',
      retrieval_query:
        'residency entrance examination EMREE EDREE MBRU written exam eligibility physician residency admission UAE',
    },
    {
      id: 'm4_3',
      name: 'Match & Enrol',
      order: 2,
      phase_id: 'phase_4',
      prerequisite_ids: ['m4_2'],
      tier: 'paid',
      retrieval_query:
        'residency matching application cycle MEAD February March, EHS registration opens March, age limit UAE national non-national physician residency',
    },
    {
      id: 'm4_4',
      name: 'Assemble Required Documents',
      order: 3,
      phase_id: 'phase_4',
      prerequisite_ids: ['m4_1'],
      tier: 'paid',
      retrieval_query:
        'residency application required documents attested MBBS certificate transcripts internship certificate English proficiency IELTS DataFlow report passport',
    },
  ],
};

// ---------------------------------------------------------------------------
// Phase 5 — Fellowship / Post-Graduation
// ---------------------------------------------------------------------------

const PHASE_5: Phase = {
  id: 'phase_5',
  name: 'Fellowship',
  order: 5,
  icon: 'rosette',
  duration_weeks: 104,
  difficulty: 5,
  milestones: [
    {
      id: 'm5_1',
      name: 'Complete Board Certification',
      order: 0,
      phase_id: 'phase_5',
      prerequisite_ids: ['m4_3'],
      tier: 'paid',
      retrieval_query:
        'fellowship eligibility primary board specialisation certificate Tier 1 Tier 2 board residency completion UAE',
    },
    {
      id: 'm5_2',
      name: 'Apply for Fellowship',
      order: 1,
      phase_id: 'phase_5',
      prerequisite_ids: ['m5_1'],
      tier: 'paid',
      retrieval_query:
        'fellowship application DOH MEAD Abu Dhabi subspecialty training time between residency completion and board certificate less than 5 years',
    },
    {
      id: 'm5_3',
      name: 'Meet Institution Thresholds',
      order: 2,
      phase_id: 'phase_5',
      prerequisite_ids: ['m5_1'],
      tier: 'paid',
      retrieval_query:
        'fellowship GPA requirement minimum 3.0 Cleveland Clinic Abu Dhabi institution-specific eligibility subspecialty',
    },
  ],
};

// Skeleton: record of courses, each is an array of phases
export const SKELETON: Record<Course, Phase[]> = {
  MBBS: [PHASE_0, PHASE_1_MBBS, PHASE_2, PHASE_3, PHASE_4, PHASE_5],
  MD: [PHASE_0, PHASE_1_MD, PHASE_2, PHASE_3, PHASE_4, PHASE_5],
};

// Shown in the "being gathered" state for a milestone with no usable content yet
// (spec §9.3) — one authoritative landing page per phase.
export const phaseFallbackUrl: Record<string, string> = {
  phase_0: 'https://gmu.ac.ae/policy-and-general-admission-requirements/',
  phase_1: 'https://gmu.ac.ae/college-medicine/bachelor-of-medicine-and-bachelor-of-surgery/',
  phase_2: 'https://www.dha.gov.ae/',
  phase_3: 'https://www.dha.gov.ae/',
  phase_4:
    'https://www.doh.gov.ae/en/programs-initiatives/meed/advance-training-program/medical-residency-program',
  phase_5:
    'https://www.doh.gov.ae/en/programs-initiatives/meed/advance-training-program/fellowship-program',
};
