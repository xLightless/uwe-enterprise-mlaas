--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)
-- ml data base 
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Models; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Models" (
    model_id integer NOT NULL,
    model_name character varying(255) NOT NULL,
    model_description text NOT NULL,
    model_version numeric NOT NULL,
    uploaded_at timestamp without time zone NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    num_accepted_claims integer DEFAULT 0 NOT NULL,
    num_rejected_claims integer DEFAULT 0 NOT NULL,
    model_file text NOT NULL,
    label_encoder_file text NOT NULL
);


ALTER TABLE public."Models" OWNER TO postgres;

--
-- Name: Models_model_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Models_model_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Models_model_id_seq" OWNER TO postgres;

--
-- Name: Models_model_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Models_model_id_seq" OWNED BY public."Models".model_id;


--
-- Name: Models model_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Models" ALTER COLUMN model_id SET DEFAULT nextval('public."Models_model_id_seq"'::regclass);


--
-- Data for Name: Models; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Models" (model_id, model_name, model_description, model_version, uploaded_at, is_active, num_accepted_claims, num_rejected_claims, model_file) FROM stdin;
\.


--
-- Name: Models_model_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Models_model_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

