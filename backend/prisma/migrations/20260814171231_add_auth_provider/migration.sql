-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('credentials', 'google', 'github');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "provider" "AuthProvider" NOT NULL DEFAULT 'credentials';
