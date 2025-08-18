-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Urls" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "OriginalUrl" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL,
    "customeUrl" TEXT,
    "user_Id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Urls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clicks" (
    "id" TEXT NOT NULL,
    "url_Id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Clicks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Urls" ADD CONSTRAINT "Urls_user_Id_fkey" FOREIGN KEY ("user_Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clicks" ADD CONSTRAINT "Clicks_url_Id_fkey" FOREIGN KEY ("url_Id") REFERENCES "Urls"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
