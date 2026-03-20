-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "colorScheme" JSONB,
ADD COLUMN     "ctaContent" JSONB,
ADD COLUMN     "footerContent" JSONB,
ADD COLUMN     "heroContent" JSONB;
