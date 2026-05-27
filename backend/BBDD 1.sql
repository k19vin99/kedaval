CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user'
);

select * from users;
-- Listar tablas --

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;


-- --

INSERT INTO users (email, password, role)
VALUES ('admin@kedaval.cl', '$2b$10$xJ/3pmVooiECkD3qbPqNnevboruCzruzL68taEah.fIaZbg9LmG4u', 'admin');


