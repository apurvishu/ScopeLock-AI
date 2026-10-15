// backend/src/types.ts
export enum Role {
  EMPLOYEE = "EMPLOYEE",
  MANAGER = "MANAGER",
  ADMIN = "ADMIN",
}

export interface Principal {
  id: string; // user ID (e.g., "alice")
  role: Role;
  department: string;
}

export type ResourceType = "employee";

export interface ActionRequest {
  action: string; // e.g., "read_salary"
  resourceType: ResourceType;
  resourceId: string; // e.g., "employee_102"
  arguments?: Record<string, unknown>;
}

export interface Decision {
  decisionId: string;
  decision: "ALLOW" | "DENY";
  principalId: string;
  action: string;
  resourceType: ResourceType;
  resourceId: string;
  reasonCode: string;
  policyVersion: string;
}
