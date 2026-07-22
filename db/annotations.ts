// Column annotations. `fabric db` is a coworker, not a codegen: it fills in the derived
// `kind` for your typed columns here — but this file is yours to edit too.
//
// Give a column a SEMANTIC type in your migration and `fabric db` derives its `kind`,
// so it is typed + coerced end-to-end:
//   - BOOLEAN column            -> kind 'bool' -> types as `boolean` (write true/false)
//   - TIMESTAMP/DATETIME/DATE    -> kind 'date' -> types as `Date` (write a Date)
//   - JSON column                -> kind 'json' -> parsed/serialized (write an object)
// A plain INTEGER flag or TEXT date is fine too — it just types as number/string; use
// a semantic type when you want a real boolean/Date/object. Never write 0/1 or ISO
// strings for a typed column, and never fight the generated type with casts.
//
// Add your own security/classification annotations by hand (the data-classification
// flow) and `fabric db` steps aside — once this file carries manual fields it won't
// overwrite them.
export const classifications = {}
