/*
  Warnings:

  - You are about to drop the `taxconfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `taxconfig` DROP FOREIGN KEY `TaxConfig_userId_fkey`;

-- AlterTable
ALTER TABLE `invoice` ADD COLUMN `applyISR` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `applyIVA` BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE `taxconfig`;
