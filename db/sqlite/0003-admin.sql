-- =============================================================================
-- BETTER AUTH ADMIN PLUGIN — user administration
-- Adds the columns the Better Auth `admin()` plugin declares so its schema is
-- covered by an explicit migration and the db drift check passes. The plugin
-- exposes /api/auth/admin/* (listUsers, setRole, ban, impersonateUser, …);
-- `impersonated_by` marks a session created via "view as user" so it can be
-- reverted with admin.stopImpersonating. All fields are optional — a user with
-- `role` = 'admin' is an administrator; everyone else stays a normal user.
-- =============================================================================

ALTER TABLE "user" ADD COLUMN "role" text;
ALTER TABLE "user" ADD COLUMN "banned" integer DEFAULT 0;
ALTER TABLE "user" ADD COLUMN "ban_reason" text;
ALTER TABLE "user" ADD COLUMN "ban_expires" date;

ALTER TABLE "session" ADD COLUMN "impersonated_by" text;
