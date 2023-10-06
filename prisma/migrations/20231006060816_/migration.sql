/*
  Warnings:

  - You are about to drop the column `zip_Code` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `zip_code` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Patient` DROP COLUMN `zip_Code`,
    ADD COLUMN `zip_code` INTEGER NOT NULL;
