export const flowsKeys = {
  all: ["flows"] as const,
  list: () => [...flowsKeys.all, "list"] as const,
  byId: (id: string) => [...flowsKeys.all, "byId", id] as const,
};
