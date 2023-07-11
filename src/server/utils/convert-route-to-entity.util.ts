const mapping: Record<string, string> = {
  organizations: 'organization',
  reports: 'report',
  users: 'user',
  voters: 'voter',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
