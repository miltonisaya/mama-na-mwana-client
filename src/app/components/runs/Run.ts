export interface Run {
  id: string;
  rapidProRunUuid: string;
  flow: { id: string; name: string } | null;
  contact: { id: string; name: string; urn: string } | null;
  status: string;
  responded: boolean;
  responseValues: string;
  startedOn: string;
  exitedOn: string | null;
  modifiedOn: string;
  isProcessed: boolean;
}
