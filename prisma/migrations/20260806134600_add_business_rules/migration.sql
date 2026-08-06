-- CreateTable
CREATE TABLE "BusinessRule" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "targetValue" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'NORMALE',
    "badge" TEXT,
    "color" TEXT,
    "workflow" TEXT,
    "explanation" TEXT,
    "checklist" JSONB,
    "actions" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BusinessRule_companyId_scope_idx" ON "BusinessRule"("companyId", "scope");

-- CreateIndex
CREATE INDEX "BusinessRule_companyId_isActive_idx" ON "BusinessRule"("companyId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessRule_companyId_scope_targetValue_name_key" ON "BusinessRule"("companyId", "scope", "targetValue", "name");

-- AddForeignKey
ALTER TABLE "BusinessRule" ADD CONSTRAINT "BusinessRule_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
