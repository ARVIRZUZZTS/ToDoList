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
	task_id varchar(128) NOT NULL,
	name varchar(64),
	description text,
	completed bool,
	"createdAt" timestamp,
	priority smallint,
	CONSTRAINT "Task_pk" PRIMARY KEY (task_id)
);
-- ddl-end --
ALTER TABLE public."Task" OWNER TO postgres;
-- ddl-end --

-- object: public."FIle" | type: TABLE --
-- DROP TABLE IF EXISTS public."FIle" CASCADE;
CREATE TABLE public."FIle" (
	id_file serial NOT NULL,
	name varchar(48),
	path text,
	uploaded_at timestamp,
	last_download_at timestamp,
	task_id varchar(128),
	CONSTRAINT "FIle_pk" PRIMARY KEY (id_file)
);
-- ddl-end --
ALTER TABLE public."FIle" OWNER TO postgres;
-- ddl-end --

-- object: "fk-task_id(File)-task_id(Task)" | type: CONSTRAINT --
-- ALTER TABLE public."FIle" DROP CONSTRAINT IF EXISTS "fk-task_id(File)-task_id(Task)" CASCADE;
ALTER TABLE public."FIle" ADD CONSTRAINT "fk-task_id(File)-task_id(Task)" FOREIGN KEY (task_id)
REFERENCES public."Task" (task_id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --


