/*
  Warnings:

  - Added the required column `apellido` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `celular` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fecha_nacimiento` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `apellido` VARCHAR(255) NOT NULL,
    ADD COLUMN `celular` VARCHAR(50) NOT NULL,
    ADD COLUMN `ci` VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN `color_tema` VARCHAR(50) NULL,
    ADD COLUMN `contador_interaccion_correo` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `contador_interaccion_direccion` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `contador_interaccion_telefono` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `contador_interaccion_whatsapp` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `direccion` VARCHAR(255) NOT NULL DEFAULT '',
    ADD COLUMN `fecha_nacimiento` TIMESTAMP(6) NOT NULL,
    ADD COLUMN `foto_baner` VARCHAR(255) NULL,
    ADD COLUMN `foto_perfil` VARCHAR(255) NULL,
    ADD COLUMN `nombre` VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE `Enlace` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(1255) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL DEFAULT '',
    `icon` VARCHAR(191) NOT NULL DEFAULT 'MdLink',
    `contador_interacciones` INTEGER NULL DEFAULT 0,
    `usuario_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Carrera` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Carrera_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UsuarioCarrera` (
    `usuarioId` INTEGER NOT NULL,
    `carreraId` INTEGER NOT NULL,

    PRIMARY KEY (`usuarioId`, `carreraId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Enlace` ADD CONSTRAINT `Enlace_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `User`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `UsuarioCarrera` ADD CONSTRAINT `UsuarioCarrera_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UsuarioCarrera` ADD CONSTRAINT `UsuarioCarrera_carreraId_fkey` FOREIGN KEY (`carreraId`) REFERENCES `Carrera`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
