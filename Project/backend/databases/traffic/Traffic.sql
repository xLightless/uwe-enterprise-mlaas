--
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
-- Name: ActivityLogs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ActivityLogs" (
    log_id integer NOT NULL,
    user_id integer NOT NULL,
    ip_address inet NOT NULL,
    description text NOT NULL,
    status_code character varying(3) NOT NULL,
    generated_at timestamp without time zone NOT NULL,
    event_type character varying(100) NOT NULL,
    device_info text
);


ALTER TABLE public."ActivityLogs" OWNER TO postgres;

--
-- Name: ActivityLogs_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ActivityLogs_audit_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ActivityLogs_audit_id_seq" OWNER TO postgres;

--
-- Name: ActivityLogs_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ActivityLogs_audit_id_seq" OWNED BY public."ActivityLogs".log_id;


--
-- Name: AuditLogs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AuditLogs" (
    audit_id integer NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    crud_action_type character varying(75) NOT NULL,
    table_name character varying(255) NOT NULL,
    table_column character varying(255) NOT NULL,
    table_record_id integer NOT NULL,
    action_details text NOT NULL
);


ALTER TABLE public."AuditLogs" OWNER TO postgres;

--
-- Name: AuditLogs_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."AuditLogs_audit_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AuditLogs_audit_id_seq" OWNER TO postgres;

--
-- Name: AuditLogs_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."AuditLogs_audit_id_seq" OWNED BY public."AuditLogs".audit_id;


--
-- Name: ModelUsageLogs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ModelUsageLogs" (
    usage_id integer NOT NULL,
    user_id integer NOT NULL,
    model_id integer NOT NULL,
    num_predictions integer NOT NULL,
    model_duration interval NOT NULL,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public."ModelUsageLogs" OWNER TO postgres;

--
-- Name: ModelUsageLogs_usage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."ModelUsageLogs_usage_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."ModelUsageLogs_usage_id_seq" OWNER TO postgres;

--
-- Name: ModelUsageLogs_usage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."ModelUsageLogs_usage_id_seq" OWNED BY public."ModelUsageLogs".usage_id;


--
-- Name: ActivityLogs log_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityLogs" ALTER COLUMN log_id SET DEFAULT nextval('public."ActivityLogs_audit_id_seq"'::regclass);


--
-- Name: AuditLogs audit_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLogs" ALTER COLUMN audit_id SET DEFAULT nextval('public."AuditLogs_audit_id_seq"'::regclass);


--
-- Name: ModelUsageLogs usage_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ModelUsageLogs" ALTER COLUMN usage_id SET DEFAULT nextval('public."ModelUsageLogs_usage_id_seq"'::regclass);


--
-- Data for Name: ActivityLogs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ActivityLogs" (log_id, user_id, ip_address, description, status_code, generated_at, event_type, device_info) FROM stdin;
\.


--
-- Data for Name: AuditLogs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AuditLogs" (audit_id, user_id, created_at, crud_action_type, table_name, table_column, table_record_id, action_details) FROM stdin;
\.


--
-- Data for Name: ModelUsageLogs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ModelUsageLogs" (usage_id, user_id, model_id, num_predictions, model_duration, created_at) FROM stdin;
\.


--
-- Name: ActivityLogs_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ActivityLogs_audit_id_seq"', 1, false);


--
-- Name: AuditLogs_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."AuditLogs_audit_id_seq"', 1, false);


--
-- Name: ModelUsageLogs_usage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."ModelUsageLogs_usage_id_seq"', 1, false);


--
-- Name: ActivityLogs ActivityLogs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ActivityLogs"
    ADD CONSTRAINT "ActivityLogs_pkey" PRIMARY KEY (log_id);


--
-- Name: AuditLogs AuditLogs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLogs"
    ADD CONSTRAINT "AuditLogs_pkey" PRIMARY KEY (audit_id);


--
-- Name: ModelUsageLogs ModelUsageLogs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ModelUsageLogs"
    ADD CONSTRAINT "ModelUsageLogs_pkey" PRIMARY KEY (usage_id);


--
-- PostgreSQL database dump complete
--

