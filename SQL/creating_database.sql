CREATE TABLE IF NOT EXISTS aluraflix_videos (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(40) NOT NULL,
    descricao TEXT NOT NULL,
    url VARCHAR(100) NOT NULL
)