export interface OrganisationUnit {
  id: string;
  name: string;
  code: string;
  otherNames: string;
  children?: OrganisationUnit[];
}
