/*
  Warnings:

  - You are about to drop the column `Address` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `Age` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `City` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `Country` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `Date_of_Birth` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `Email` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `NHS_Number` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `Phone` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `Zip_Code` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `first_Name` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `last_Name` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `address` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `age` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_of_birth` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nhs_number` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip_Code` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Patient` DROP COLUMN `Address`,
    DROP COLUMN `Age`,
    DROP COLUMN `City`,
    DROP COLUMN `Country`,
    DROP COLUMN `Date_of_Birth`,
    DROP COLUMN `Email`,
    DROP COLUMN `NHS_Number`,
    DROP COLUMN `Phone`,
    DROP COLUMN `Zip_Code`,
    DROP COLUMN `first_Name`,
    DROP COLUMN `last_Name`,
    ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `age` INTEGER NOT NULL,
    ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `country` VARCHAR(191) NOT NULL,
    ADD COLUMN `date_of_birth` INTEGER NOT NULL,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `first_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `last_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `nhs_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone` INTEGER NOT NULL,
    ADD COLUMN `zip_Code` INTEGER NOT NULL;
