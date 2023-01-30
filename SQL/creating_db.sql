CREATE TABLE IF NOT EXISTS aluraflix_videos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(40) NOT NULL,
    descricao TEXT NOT NULL,
    url VARCHAR(100) NOT NULL
)

CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(30) UNIQUE NOT NULL,
    cor VARCHAR(6) NOT NULL
);

INSERT INTO categorias VALUES(1, 'LIVRE', '64f25a');

ALTER TABLE aluraflix_videos
    ADD categoria_id INT DEFAULT 1 REFERENCES categorias(id) ON DELETE SET DEFAULT ON UPDATE CASCADE;


CREATE TABLE IF NOT EXISTS usuarios (
    nome VARCHAR(20) PRIMARY KEY,
    senha TEXT NOT NULL
);

ALTER TABLE aluraflix_videos
    ADD author VARCHAR(20);

UPDATE aluraflix_videos SET author = 'Chufretalas';

ALTER TABLE aluraflix_videos
    ALTER COLUMN author SET NOT NULL;

ALTER TABLE aluraflix_videos
    ADD CONSTRAINT authorForeign FOREIGN KEY (author) REFERENCES usuarios(nome);


ALTER TABLE categorias
    ADD author VARCHAR(20);

UPDATE categorias SET author = 'Chufretalas';

ALTER TABLE categorias
    ALTER COLUMN author SET NOT NULL;

ALTER TABLE categorias
    ADD CONSTRAINT authorForeign FOREIGN KEY (author) REFERENCES usuarios(nome);

ALTER TABLE aluraflix_videos
    DROP CONSTRAINT authorForeign;

ALTER TABLE aluraflix_videos
    ADD CONSTRAINT authorForeign FOREIGN KEY (author) REFERENCES usuarios(nome) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE categorias
    DROP CONSTRAINT authorForeign;

ALTER TABLE categorias
    ADD CONSTRAINT authorForeign FOREIGN KEY (author) REFERENCES usuarios(nome) ON DELETE CASCADE ON UPDATE CASCADE;
