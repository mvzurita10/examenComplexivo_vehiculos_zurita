CREATE USER vehiculos_user WITH PASSWORD 'admin123';
CREATE DATABASE vehiculos_db OWNER vehiculos_user;

\c vehiculos_db

ALTER SCHEMA public OWNER TO vehiculos_user;
GRANT ALL ON SCHEMA public TO vehiculos_user;
GRANT CREATE ON SCHEMA public TO vehiculos_user;

ALTER DEFAULT PRIVILEGES FOR USER vehiculos_user IN SCHEMA public
GRANT ALL ON TABLES TO vehiculos_user;

ALTER DEFAULT PRIVILEGES FOR USER vehiculos_user IN SCHEMA public
GRANT ALL ON SEQUENCES TO vehiculos_user;

ALTER DEFAULT PRIVILEGES FOR USER vehiculos_user IN SCHEMA public
GRANT ALL ON FUNCTIONS TO vehiculos_user;