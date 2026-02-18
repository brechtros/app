export type ServiceContext = {
  tenantId: string;
  userId: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
};
