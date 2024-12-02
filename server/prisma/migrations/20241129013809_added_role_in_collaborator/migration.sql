-- CreateEnum
CREATE TYPE "Role" AS ENUM ('VIEWER', 'EDITOR');

-- AlterTable
ALTER TABLE "collaborators" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'VIEWER';
