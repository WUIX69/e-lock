ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TYPE "public"."user_role" RENAME TO "user_role_old";
CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "public"."user_role" USING "role"::text::"public"."user_role";
DROP TYPE "public"."user_role_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user';
