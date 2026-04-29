-- PikkuFabric schema
-- Add your tables here. Kysely codegen will auto-generate TypeScript types.

CREATE SCHEMA app;

-- ---------------------------------------------------------------------------
-- Utility: auto-update last_updated_at on row modification
-- ---------------------------------------------------------------------------

CREATE FUNCTION app.update_last_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.last_updated_at = now();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;
