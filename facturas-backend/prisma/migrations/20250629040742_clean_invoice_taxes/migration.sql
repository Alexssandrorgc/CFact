/*
  Warnings:

  - You are about to drop the column `applyISR` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `applyIVA` on the `invoice` table. All the data in the column will be lost.
  - You are about to drop the column `pdfUrl` on the `invoice` table. All the data in the column will be lost.
  - Added the required column `isr` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iva` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `invoice` DROP COLUMN `applyISR`,
    DROP COLUMN `applyIVA`,
    DROP COLUMN `pdfUrl`,
    ADD COLUMN `isr` DOUBLE NOT NULL,
    ADD COLUMN `iva` DOUBLE NOT NULL,
    ADD COLUMN `subtotal` DOUBLE NOT NULL;
