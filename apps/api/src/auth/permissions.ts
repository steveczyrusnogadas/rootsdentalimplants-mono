import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
} as const;

export const ac = createAccessControl(statement);

export const adminRole = ac.newRole({
  ...adminAc.statements,
});

export const managerRole = ac.newRole({
  user: [],
  session: [],
});

export const authRoles = {
  admin: adminRole,
  manager: managerRole,
};
