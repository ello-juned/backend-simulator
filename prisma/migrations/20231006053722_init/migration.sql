-- CreateTable
CREATE TABLE `Patient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_Name` VARCHAR(191) NOT NULL,
    `last_Name` VARCHAR(191) NOT NULL,
    `Age` INTEGER NOT NULL,
    `Email` VARCHAR(191) NOT NULL,
    `Phone` INTEGER NOT NULL,
    `Date_of_Birth` INTEGER NOT NULL,
    `Address` VARCHAR(191) NOT NULL,
    `City` VARCHAR(191) NOT NULL,
    `Country` VARCHAR(191) NOT NULL,
    `Zip_Code` INTEGER NOT NULL,
    `NHS_Number` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
