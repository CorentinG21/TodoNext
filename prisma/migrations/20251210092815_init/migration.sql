-- CreateEnum
CREATE TYPE "TodoStatus" AS ENUM ('CHECKED', 'NOT_CHECKED');

-- CreateEnum
CREATE TYPE "TodoPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "Todo" (
    "id" TEXT NOT NULL,
    "status" "TodoStatus" NOT NULL DEFAULT 'NOT_CHECKED',
    "priority" "TodoPriority" NOT NULL DEFAULT 'LOW',
    "deadline" TIMESTAMP(3),
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);
