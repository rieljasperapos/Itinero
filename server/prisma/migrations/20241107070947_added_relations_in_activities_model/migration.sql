/*
  Warnings:

  - Added the required column `destination_id` to the `activities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itinerary_id` to the `activities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "activities" ADD COLUMN     "destination_id" INTEGER NOT NULL,
ADD COLUMN     "itinerary_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "itineraries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_destination_id_fkey" FOREIGN KEY ("destination_id") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
