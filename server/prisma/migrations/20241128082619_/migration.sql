/*
  Warnings:

  - You are about to drop the column `destination_id` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the `destinations` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `address` to the `activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location_name` to the `activities` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_destination_id_fkey";

-- DropForeignKey
ALTER TABLE "destinations" DROP CONSTRAINT "destinations_itinerary_id_fkey";

-- AlterTable
ALTER TABLE "activities" DROP COLUMN "destination_id",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "location_name" TEXT NOT NULL;

-- DropTable
DROP TABLE "destinations";
