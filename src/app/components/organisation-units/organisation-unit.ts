export interface OrganisationUnit {
  id: string;
  name: string;
  code: string;
  otherNames: string | null; // Updated to allow null as per response
  parentId: string | null; // Added to reflect parent reference
  children?: OrganisationUnit[]; // Optional, as children are lazy-loaded
  hasChildren: boolean; // Added to indicate if node is expandable
}
