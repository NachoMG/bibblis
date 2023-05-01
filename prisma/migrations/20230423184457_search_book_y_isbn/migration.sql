-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL,
    "olid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,
    "birthDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthorAlias" (
    "id" SERIAL NOT NULL,
    "authorId" TEXT NOT NULL,
    "alias" TEXT NOT NULL,

    CONSTRAINT "AuthorAlias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Work" (
    "id" TEXT NOT NULL,
    "olid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Work_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "publisher" TEXT,
    "publishedAt" TEXT,
    "description" TEXT,
    "cover" TEXT,
    "pages" INTEGER,
    "workId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookIdentifier" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "identifierTypeId" INTEGER NOT NULL,
    "bookId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookIdentifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookIdentifierType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "BookIdentifierType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AuthorToWork" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Author_olid_key" ON "Author"("olid");

-- CreateIndex
CREATE UNIQUE INDEX "Work_olid_key" ON "Work"("olid");

-- CreateIndex
CREATE UNIQUE INDEX "BookIdentifierType_name_key" ON "BookIdentifierType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_AuthorToWork_AB_unique" ON "_AuthorToWork"("A", "B");

-- CreateIndex
CREATE INDEX "_AuthorToWork_B_index" ON "_AuthorToWork"("B");

-- AddForeignKey
ALTER TABLE "AuthorAlias" ADD CONSTRAINT "AuthorAlias_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookIdentifier" ADD CONSTRAINT "BookIdentifier_identifierTypeId_fkey" FOREIGN KEY ("identifierTypeId") REFERENCES "BookIdentifierType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookIdentifier" ADD CONSTRAINT "BookIdentifier_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorToWork" ADD CONSTRAINT "_AuthorToWork_A_fkey" FOREIGN KEY ("A") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AuthorToWork" ADD CONSTRAINT "_AuthorToWork_B_fkey" FOREIGN KEY ("B") REFERENCES "Work"("id") ON DELETE CASCADE ON UPDATE CASCADE;
