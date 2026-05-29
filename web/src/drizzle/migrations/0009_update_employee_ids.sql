UPDATE "users"
SET "employee_id" = CASE
  WHEN "employee_id" ILIKE 'P-%' THEN 'AD' || SUBSTRING("employee_id" FROM 3)
  WHEN "employee_id" ILIKE 'EL-2026-%' THEN 'AD' || SUBSTRING("employee_id" FROM 9)
  WHEN "employee_id" NOT ILIKE 'AD%' THEN 'AD' || "employee_id"
  ELSE "employee_id"
END
WHERE "role" = 'admin';
--> statement-breakpoint
UPDATE "users"
SET "employee_id" = CASE
  WHEN "employee_id" ILIKE 'P-%' THEN 'AC' || SUBSTRING("employee_id" FROM 3)
  WHEN "employee_id" ILIKE 'EL-2026-%' THEN 'AC' || SUBSTRING("employee_id" FROM 9)
  WHEN "employee_id" NOT ILIKE 'AC%' THEN 'AC' || "employee_id"
  ELSE "employee_id"
END
WHERE "role" <> 'admin';
