-- =============================================================================
-- BETTER AUTH FABRIC PLUGIN — Fabric operator admin sessions
-- Adds the `fabric` boolean the Better Auth `fabric()` plugin declares so its
-- schema is covered by an explicit migration and the db drift check passes.
-- Fabric rows are synthetic operator users minted by POST /api/auth/sign-in/fabric
-- after verifying a short-lived RS256 token the Fabric control plane signed
-- (checked against FABRIC_AUTH_PUBLIC_KEY). They are created with role 'admin' so
-- the console Users tab can list/impersonate real end-users WITHOUT the operator
-- being one of them; these rows are filtered out of any end-user listing. A real
-- user can never be signed in this way.
-- =============================================================================

ALTER TABLE "user" ADD COLUMN "fabric" integer NOT NULL DEFAULT 0;
