-- CreateTable
CREATE TABLE "aluraflix_videos" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(40) NOT NULL,
    "descricao" TEXT NOT NULL,
    "url" VARCHAR(100) NOT NULL,

    CONSTRAINT "aluraflix_videos_pkey" PRIMARY KEY ("id")
);

