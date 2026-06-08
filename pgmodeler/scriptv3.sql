-- ** Database generated with pgModeler (PostgreSQL Database Modeler).
-- ** pgModeler version: 1.2.3
-- ** PostgreSQL version: 17.0
-- ** Project Site: pgmodeler.io
-- ** Model Author: ---

-- ** Database creation must be performed outside a multi lined SQL file. 
-- ** These commands were put in this file only as a convenience.

-- object: "TaskFile" | type: DATABASE --
-- DROP DATABASE IF EXISTS "TaskFile";
CREATE DATABASE "TaskFile";
-- ddl-end --


SET search_path TO pg_catalog,public;
-- ddl-end --

-- object: public."Task" | type: TABLE --
-- DROP TABLE IF EXISTS public."Task" CASCADE;
CREATE TABLE public."Task" (
	task_id uuid NOT NULL,
	name varchar(64),
	description text,
	completed bool,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	priority smallint,
	user_id varchar(40),
	CONSTRAINT "Task_pk" PRIMARY KEY (task_id)
);
-- ddl-end --
ALTER TABLE public."Task" OWNER TO postgres;
-- ddl-end --

-- object: public."File" | type: TABLE --
-- DROP TABLE IF EXISTS public."File" CASCADE;
CREATE TABLE public."File" (
	file_id uuid NOT NULL,
	name varchar(48),
	path text,
	uploaded_at timestamp,
	last_download_at timestamp,
	task_id varchar(128),
	CONSTRAINT "FIle_pk" PRIMARY KEY (file_id)
);
-- ddl-end --
ALTER TABLE public."File" OWNER TO postgres;
-- ddl-end --

-- object: public."User" | type: TABLE --
-- DROP TABLE IF EXISTS public."User" CASCADE;
CREATE TABLE public."User" (
	user_id uuid NOT NULL,
	name varchar(256),
	email varchar(256),
	password_hash varchar(256),
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
	active boolean,
	CONSTRAINT "User_pk" PRIMARY KEY (user_id)
);
-- ddl-end --
ALTER TABLE public."User" OWNER TO postgres;
-- ddl-end --

-- object: "fk_id_usuario(User-Task)" | type: CONSTRAINT --
-- ALTER TABLE public."Task" DROP CONSTRAINT IF EXISTS "fk_id_usuario(User-Task)" CASCADE;
ALTER TABLE public."Task" ADD CONSTRAINT "fk_id_usuario(User-Task)" FOREIGN KEY (user_id)
REFERENCES public."User" (user_id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: "fk-task_id(File)-task_id(Task)" | type: CONSTRAINT --
-- ALTER TABLE public."File" DROP CONSTRAINT IF EXISTS "fk-task_id(File)-task_id(Task)" CASCADE;
ALTER TABLE public."File" ADD CONSTRAINT "fk-task_id(File)-task_id(Task)" FOREIGN KEY (task_id)
REFERENCES public."Task" (task_id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --


