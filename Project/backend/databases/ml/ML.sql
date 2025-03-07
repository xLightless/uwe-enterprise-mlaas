-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 17.2

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
    num_rejected_claims integer DEFAULT 0 NOT NULL
);

ALTER TABLE public."Models" OWNER TO postgres;

CREATE SEQUENCE public."Models_model_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public."Models_model_id_seq" OWNED BY public."Models".model_id;

ALTER TABLE ONLY public."Models" ALTER COLUMN model_id SET DEFAULT nextval('public."Models_model_id_seq"'::regclass);

COPY public."Models" (model_id, model_name, model_description, model_version, uploaded_at, num_accepted_claims, num_rejected_claims) FROM stdin;
\. 

ALTER TABLE ONLY public."Models"
    ADD CONSTRAINT "Models_pkey" PRIMARY KEY (model_id);

--
-- Name: Predictions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Predictions" (
    prediction_id integer NOT NULL,
    user_claim_id integer NOT NULL
);

ALTER TABLE public."Predictions" OWNER TO postgres;

CREATE SEQUENCE public."Predictions_prediction_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public."Predictions_prediction_id_seq" OWNED BY public."Predictions".prediction_id;

ALTER TABLE ONLY public."Predictions" ALTER COLUMN prediction_id SET DEFAULT nextval('public."Predictions_prediction_id_seq"'::regclass);

COPY public."Predictions" (prediction_id, user_claim_id) FROM stdin;
\. 

ALTER TABLE ONLY public."Predictions"
    ADD CONSTRAINT "Predictions_pkey" PRIMARY KEY (prediction_id);

--
-- Name: UserModelFeedback; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserModelFeedback" (
    feedback_id integer NOT NULL,
    user_id integer NOT NULL,
    settlement_amount numeric DEFAULT 0 NOT NULL,
    expected_amount numeric DEFAULT 0 NOT NULL,
    feedback_rating smallint DEFAULT 0 NOT NULL,
    comments text
);

ALTER TABLE public."UserModelFeedback" OWNER TO postgres;

CREATE SEQUENCE public."UserModelFeedback_feedback_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public."UserModelFeedback_feedback_id_seq" OWNED BY public."UserModelFeedback".feedback_id;

ALTER TABLE ONLY public."UserModelFeedback" ALTER COLUMN feedback_id SET DEFAULT nextval('public."UserModelFeedback_feedback_id_seq"'::regclass);

COPY public."UserModelFeedback" (feedback_id, user_id, settlement_amount, expected_amount, feedback_rating, comments) FROM stdin;
\. 

ALTER TABLE ONLY public."UserModelFeedback"
    ADD CONSTRAINT "UserModelFeedback_pkey" PRIMARY KEY (feedback_id);

--
-- SEQUENCE SETS
--

SELECT pg_catalog.setval('public."Models_model_id_seq"', 1, false);
SELECT pg_catalog.setval('public."Predictions_prediction_id_seq"', 1, false);
SELECT pg_catalog.setval('public."UserModelFeedback_feedback_id_seq"', 1, false);

-- PostgreSQL database dump complete
