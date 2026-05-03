/**
 * data/requiredDocs.js
 * List of required documents for MTV application
 */

export const REQUIRED_DOCS = [
  {
    id: "ghp_cert",
    name: "GHP Certificate",
    description: "Valid GHP (Good Hauling Practices) Certificate",
    required: true,
  },
  {
    id: "or_cr",
    name: "OR/CR",
    description: "Official Receipt and Certificate of Registration",
    required: true,
  },
  {
    id: "bill_of_lading",
    name: "Bill of Lading",
    description: "Sample bill of lading for reference",
    required: true,
  },
  {
    id: "inspection_cert",
    name: "Inspection Certificate",
    description: "LTO Vehicle Inspection Certificate",
    required: true,
  },
  {
    id: "company_permit",
    name: "Company/Business Permit",
    description: "Valid business/company permit",
    required: true,
  },
  {
    id: "identification",
    name: "Valid ID",
    description: "Government-issued identification (Driver's License, etc.)",
    required: true,
  },
];

export const REQUIRED_DOCS_MAP = REQUIRED_DOCS.reduce((acc, doc) => {
  acc[doc.id] = doc;
  return acc;
}, {});

export function getRequiredDocsForApplication() {
  return REQUIRED_DOCS;
}

export function validateDocuments(uploadedDocs) {
  const requiredIds = REQUIRED_DOCS.filter((d) => d.required).map((d) => d.id);
  const uploadedIds = Object.keys(uploadedDocs);

  const missing = requiredIds.filter((id) => !uploadedIds.includes(id));
  return {
    valid: missing.length === 0,
    missing: missing.map((id) => REQUIRED_DOCS_MAP[id]),
  };
}
