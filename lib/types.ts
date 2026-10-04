export type Role = "SUPER_ADMIN" | "ORG_ADMIN" | "REVIEWER" | "INSPECTOR" | "CUSTOMER";
export type InspectionStatus = "DRAFT" | "IN_PROGRESS" | "SUBMITTED" | "IN_REVIEW" | "CHANGES_REQUESTED" | "APPROVED" | "COMPLETED" | "CANCELLED";
export type Severity = "Cosmetic" | "Minor" | "Moderate" | "Major" | "Critical";

export type Fault = {
  id?: string;
  code?: string;
  system: string;
  name: string;
  severity: Severity;
  default_description?: string;
  recommendation?: string;
  photo_required?: boolean;
};

export type InspectionDraft = {
  id?: string;
  inspectionNumber: string;
  inspectionType: string;
  inspectorName: string;
  customer: { name: string; phone: string; email: string; type: string };
  vehicle: {
    registration: string; vin: string; make: string; model: string; variant: string;
    year: string; fuel: string; transmission: string; color: string; odometer: string;
    engineNumber: string; ownership: string;
  };
  sections: Record<string, Record<string, { status: string; severity: Severity; notes: string }>>;
  findings: Fault[];
  photos: { name: string; url?: string; path?: string }[];
  signatureDataUrl?: string;
  recommendation: string;
  reviewerComments: string;
  testDrive: { distance: string; road: string; result: string; notes: string };
  updatedAt: string;
};

export type DemoInspection = {
  id: string;
  inspection_number: string;
  vehicle: string;
  registration: string;
  customer: string;
  type: string;
  inspector: string;
  status: InspectionStatus;
  score: number | null;
  generated: string;
};
