--
-- PostgreSQL database dump
--

-- Dumped from database version 10.5
-- Dumped by pg_dump version 10.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: jst_datos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jst_datos (
    usuario character varying(20) NOT NULL,
    dui character(10),
    fecha_nacimiento date,
    jvs integer,
    nit character(17)
);


ALTER TABLE public.jst_datos OWNER TO postgres;

--
-- Name: jst_recuperacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jst_recuperacion (
    usuario character varying(20) NOT NULL,
    pregunta character varying(250),
    respuesta character varying(250)
);


ALTER TABLE public.jst_recuperacion OWNER TO postgres;

--
-- Name: jst_datos jst_datos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jst_datos
    ADD CONSTRAINT jst_datos_pkey PRIMARY KEY (usuario);


--
-- Name: jst_recuperacion jst_recuperacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jst_recuperacion
    ADD CONSTRAINT jst_recuperacion_pkey PRIMARY KEY (usuario);


--
-- PostgreSQL database dump complete
--

