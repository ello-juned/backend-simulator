/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nhs_number]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Patient_email_key` ON `Patient`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Patient_phone_key` ON `Patient`(`phone`);

-- CreateIndex
CREATE UNIQUE INDEX `Patient_nhs_number_key` ON `Patient`(`nhs_number`);
