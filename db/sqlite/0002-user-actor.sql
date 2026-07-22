-- =============================================================================
-- BETTER AUTH ACTOR PLUGIN — user-flow actors
-- Adds the `actor` boolean the Better Auth `actor()` plugin declares so its
-- schema is covered by an explicit migration and the db drift check passes.
-- Actor rows are synthetic users signed in by pikkuUserFlow via
-- POST /api/auth/sign-in/actor with the server-held USER_FLOW_ACTOR_SECRET;
-- the flag rides into the pikku core session so audits/analytics can address
-- synthetic traffic. A non-actor user can never be signed in this way.
-- =============================================================================

ALTER TABLE "user" ADD COLUMN "actor" integer NOT NULL DEFAULT 0;
