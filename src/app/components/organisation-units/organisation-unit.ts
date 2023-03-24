export interface OrganisationUnit {
  id: string;
  name: string;
  code: string;
  children?: OrganisationUnit[];
}
