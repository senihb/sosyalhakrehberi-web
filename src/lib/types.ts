export type EligibilityStatus = "ELIGIBLE" | "NOT_ELIGIBLE" | "NEEDS_INFO";

export type EligibilityBenefitCode =
  | "TR_HOME_CARE_ALLOWANCE"
  | "TR_GSS"
  | "TR_OLD_AGE_PENSION"
  | "TR_BIRTH_GRANT";

export type EligibilityFacts = {
  age?: number | null;
  disability_rate?: number | null;
  care_recipient_disability_rate?: number | null;
  household_income?: number | null;
  household_total_income?: number | null;
  gross_household_income?: number | null;
  household_size?: number | null;
  is_turkish_citizen?: boolean;
  is_resident_in_tr?: boolean;
  has_valid_foreigner_identity_number?: boolean;
  has_valid_residence_permit?: boolean;
  has_valid_health_report?: boolean;
  is_fully_dependent?: boolean;
  care_dependency_status?: string | null;
  care_need_confirmed_by_board?: boolean;
  caregiver_same_residence?: boolean;
  has_additional_income_or_assets?: boolean;
  has_social_security?: boolean;
  has_active_insurance?: boolean;
  is_covered_as_dependent?: boolean;
  has_spouse?: boolean;
  self_monthly_income?: number | null;
  spouse_monthly_income?: number | null;
  receives_pension?: boolean;
  child_birth_date?: string | null;
  child_is_live_birth?: boolean;
  child_is_kps_registered?: boolean;
  child_is_alive?: boolean;
  applicant_is_turkish_citizen?: boolean;
  applicant_resides_in_tr?: boolean;
  child_resides_in_tr?: boolean;
  previous_live_children_count?: number | null;
};

export type EligibilityCheckContext = {
  jurisdiction?: "TR";
  evaluation_date?: string;
  request_id?: string;
  policy_version?: string;
};

export type EligibilityCheckRequest = {
  benefit_code: EligibilityBenefitCode;
  facts: EligibilityFacts;
  context?: EligibilityCheckContext;
};

export type DecisionReason = {
  code: string;
  message: string;
  severity: "INFO" | "WARNING" | "ERROR" | string;
};

export type MissingFact = {
  key: string;
  message: string;
  priority?: number;
  fact_group?: string;
  how_to_obtain_url?: string;
};

export type RuleResult = {
  rule_code: string;
  passed: boolean;
  value?: number | string | boolean | null;
  threshold?: number | string | null;
  message: string;
  input_mode?: string;
};

export type EligibilityMetadata = {
  engine_version: string;
  evaluation_mode: string;
  policy_code: string;
  policy_version: string;
  jurisdiction: string;
  evaluation_date: string | null;
  benefit_family?: string;
  requires_income_test?: boolean;
  visible_test_name?: string;
  policy_jurisdiction?: string;
  policy_effective_from?: string;
  policy_source_effective_date?: string;
  policy_snapshot_hash?: string;
  application_guidance?: {
    application_state?: string | null;
    primary_channel?: string | null;
    description?: string | null;
  } | null;
};

export type GuidanceItem = {
  title: string;
  url: string;
};

export type BirthGrantBenefitDetails = {
  child_order: number;
  payment_type: "ONE_TIME" | "MONTHLY" | string;
  payment_amount: number;
  total_estimated_amount?: number | null;
  remaining_months?: number | null;
  calculation_profile?: string | null;
};

export type EligibilityCheckResponse = {
  decision_id: string;
  request_id: string;
  status: EligibilityStatus;
  benefit_id: EligibilityBenefitCode | string;
  reasons: DecisionReason[];
  missing_facts: MissingFact[];
  rule_results: Record<string, RuleResult> | RuleResult[];
  metadata: EligibilityMetadata;
  user_message?: string | null;
  disclaimer?: string | null;
  guidance_items?: GuidanceItem[];
  benefit_details?: BirthGrantBenefitDetails | null;
};

export type IncomeEvaluationRequest = {
  household_size: number | null;
  total_income: number | null;
};

export type IncomeEvaluationUiHints = {
  guidance_text?: string | null;
  next_steps?: string[] | null;
};

export type IncomeNextStepDetails = {
  description?: string | null;
};

export type IncomeEligibleBenefit = {
  name?: string | null;
  reason?: string | null;
  confidence?: "high" | "medium" | "low" | string | null;
  priority?: number | null;
  next_step_details?: IncomeNextStepDetails | null;
};

export type IncomeEvaluationResponse = {
  status: EligibilityStatus;
  message?: string | null;
  per_capita_income?: number | null;
  threshold?: number | null;
  reasons?: DecisionReason[] | null;
  ui_hints?: IncomeEvaluationUiHints | null;
  decision?: string | null;
  rule_trace?: Record<string, unknown> | string[] | null;
  eligible_benefits?: IncomeEligibleBenefit[] | null;
  routing_context?: Record<string, unknown> | null;
};

export type LeadCreateRequest = {
  source: "income_test";
  result_status: EligibilityStatus;
  name?: string;
  contact?: string;
};

export type LeadCreateResponse = {
  message?: string;
};

export type ApiErrorResponse = {
  message: string;
  error: string;
  status: number;
  correlation_id: string;
  error_code?: string;
  errors?: Record<string, string[]>;
};

