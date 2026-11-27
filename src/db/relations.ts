import { defineRelations } from "drizzle-orm";

import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  user: {
    sessions: r.many.session({ from: r.user.id, to: r.session.userId }),
    accounts: r.many.account({ from: r.user.id, to: r.account.userId }),
    resumes: r.many.resume({ from: r.user.id, to: r.resume.userId }),
  },
  session: { user: r.one.user({ from: r.session.userId, to: r.user.id }) },
  account: { user: r.one.user({ from: r.account.userId, to: r.user.id }) },
  resume: { user: r.one.user({ from: r.resume.userId, to: r.user.id }) },
}));
