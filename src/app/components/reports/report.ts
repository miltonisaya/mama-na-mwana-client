export interface Report {
  id: string;
  name: string;
  url: string;
  children?: Report[];
}
