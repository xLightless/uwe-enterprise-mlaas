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
-- Name: Invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Invoices" (
    invoice_id integer NOT NULL,
    user_id integer NOT NULL,
    total_amount numeric NOT NULL,
    due_date timestamp without time zone NOT NULL,
    status boolean NOT NULL,
    generated_at timestamp without time zone NOT NULL
);


ALTER TABLE public."Invoices" OWNER TO postgres;

--
-- Name: Invoices_invoice_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Invoices_invoice_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Invoices_invoice_id_seq" OWNER TO postgres;

--
-- Name: Invoices_invoice_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Invoices_invoice_id_seq" OWNED BY public."Invoices".invoice_id;


--
-- Name: Payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Payments" (
    payment_id integer NOT NULL,
    user_id integer NOT NULL,
    amount numeric NOT NULL,
    status boolean NOT NULL,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public."Payments" OWNER TO postgres;

--
-- Name: Payments_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Payments_payment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Payments_payment_id_seq" OWNER TO postgres;

--
-- Name: Payments_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Payments_payment_id_seq" OWNED BY public."Payments".payment_id;


--
-- Name: Invoices invoice_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoices" ALTER COLUMN invoice_id SET DEFAULT nextval('public."Invoices_invoice_id_seq"'::regclass);


--
-- Name: Payments payment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payments" ALTER COLUMN payment_id SET DEFAULT nextval('public."Payments_payment_id_seq"'::regclass);


--
-- Data for Name: Invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Invoices" (invoice_id, user_id, total_amount, due_date, status, generated_at) FROM stdin;
\.


--
-- Data for Name: Payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Payments" (payment_id, user_id, amount, status, created_at) FROM stdin;
\.


--
-- Name: Invoices_invoice_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Invoices_invoice_id_seq"', 1, false);


--
-- Name: Payments_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Payments_payment_id_seq"', 1, false);


--
-- Name: Invoices Invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoices"
    ADD CONSTRAINT "Invoices_pkey" PRIMARY KEY (invoice_id);


--
-- Name: Payments Payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payments"
    ADD CONSTRAINT "Payments_pkey" PRIMARY KEY (payment_id);


--
-- PostgreSQL database dump complete
--

