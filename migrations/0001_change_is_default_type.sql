-- Change is_default column from json to boolean with default false
ALTER TABLE templates
  ALTER COLUMN is_default TYPE boolean USING (is_default::boolean);
ALTER TABLE templates
  ALTER COLUMN is_default SET DEFAULT false;
ALTER TABLE templates
  ALTER COLUMN is_default SET NOT NULL;
