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
-- Name: Accidents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Accidents" (
    accident_id integer NOT NULL,
    accident_type character varying(75) NOT NULL
);


ALTER TABLE public."Accidents" OWNER TO postgres;

--
-- Name: Accidents_accident_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Accidents_accident_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Accidents_accident_id_seq" OWNER TO postgres;

--
-- Name: Accidents_accident_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Accidents_accident_id_seq" OWNED BY public."Accidents".accident_id;


--
-- Name: Claims; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Claims" (
    claim_id integer NOT NULL,
    injury_prognosis character varying(255) NOT NULL,
    injury_description text NOT NULL,
    police_report_filed boolean DEFAULT false NOT NULL,
    num_witnesses integer DEFAULT 0 NOT NULL,
    claim_date timestamp without time zone NOT NULL
);


ALTER TABLE public."Claims" OWNER TO postgres;

--
-- Name: Claims_claim_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Claims_claim_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Claims_claim_id_seq" OWNER TO postgres;

--
-- Name: Claims_claim_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Claims_claim_id_seq" OWNED BY public."Claims".claim_id;


--
-- Name: Drivers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Drivers" (
    driver_id integer NOT NULL,
    age integer NOT NULL,
    gender character varying(25) NOT NULL,
    passengers integer DEFAULT 0 NOT NULL,
    driver_first_name character varying(50),
    driver_last_name character varying(50)
);


ALTER TABLE public."Drivers" OWNER TO postgres;

--
-- Name: Drivers_driver_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Drivers_driver_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Drivers_driver_id_seq" OWNER TO postgres;

--
-- Name: Drivers_driver_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Drivers_driver_id_seq" OWNED BY public."Drivers".driver_id;


--
-- Name: UserAccident; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserAccident" (
    user_accident_id integer NOT NULL,
    accident_id integer NOT NULL,
    weather_id integer NOT NULL,
    user_vehicle_id integer NOT NULL,
    accident_description text NOT NULL,
    accident_date timestamp without time zone NOT NULL
);


ALTER TABLE public."UserAccident" OWNER TO postgres;

--
-- Name: UserAccident_user_accident_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UserAccident_user_accident_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserAccident_user_accident_id_seq" OWNER TO postgres;

--
-- Name: UserAccident_user_accident_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UserAccident_user_accident_id_seq" OWNED BY public."UserAccident".user_accident_id;


--
-- Name: UserClaims; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserClaims" (
    user_claim_id integer NOT NULL,
    user_accident_id integer NOT NULL,
    claim_id integer NOT NULL,
    expense_type character varying(75) NOT NULL,
    amount numeric NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public."UserClaims" OWNER TO postgres;

--
-- Name: UserClaims_user_claim_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UserClaims_user_claim_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserClaims_user_claim_id_seq" OWNER TO postgres;

--
-- Name: UserClaims_user_claim_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UserClaims_user_claim_id_seq" OWNED BY public."UserClaims".user_claim_id;


--
-- Name: UserVehicle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UserVehicle" (
    user_vehicle_id integer NOT NULL,
    user_id integer NOT NULL,
    vehicle_id integer NOT NULL,
    vehicle_age integer NOT NULL,
    driver_id integer NOT NULL
);


ALTER TABLE public."UserVehicle" OWNER TO postgres;

--
-- Name: UserVehicle_user_vehicle_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UserVehicle_user_vehicle_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UserVehicle_user_vehicle_id_seq" OWNER TO postgres;

--
-- Name: UserVehicle_user_vehicle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UserVehicle_user_vehicle_id_seq" OWNED BY public."UserVehicle".user_vehicle_id;


--
-- Name: Vehicles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Vehicles" (
    vehicle_id integer NOT NULL,
    vehicle_type character varying(50) NOT NULL
);


ALTER TABLE public."Vehicles" OWNER TO postgres;

--
-- Name: Vehicles_vehicle_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Vehicles_vehicle_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Vehicles_vehicle_id_seq" OWNER TO postgres;

--
-- Name: Vehicles_vehicle_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Vehicles_vehicle_id_seq" OWNED BY public."Vehicles".vehicle_id;


--
-- Name: Weather; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Weather" (
    weather_id integer NOT NULL,
    weather_type character varying(50) NOT NULL
);


ALTER TABLE public."Weather" OWNER TO postgres;

--
-- Name: Weather_weather_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Weather_weather_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Weather_weather_id_seq" OWNER TO postgres;

--
-- Name: Weather_weather_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Weather_weather_id_seq" OWNED BY public."Weather".weather_id;


--
-- Name: Accidents accident_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Accidents" ALTER COLUMN accident_id SET DEFAULT nextval('public."Accidents_accident_id_seq"'::regclass);


--
-- Name: Claims claim_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Claims" ALTER COLUMN claim_id SET DEFAULT nextval('public."Claims_claim_id_seq"'::regclass);


--
-- Name: Drivers driver_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Drivers" ALTER COLUMN driver_id SET DEFAULT nextval('public."Drivers_driver_id_seq"'::regclass);


--
-- Name: UserAccident user_accident_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserAccident" ALTER COLUMN user_accident_id SET DEFAULT nextval('public."UserAccident_user_accident_id_seq"'::regclass);


--
-- Name: UserClaims user_claim_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserClaims" ALTER COLUMN user_claim_id SET DEFAULT nextval('public."UserClaims_user_claim_id_seq"'::regclass);


--
-- Name: UserVehicle user_vehicle_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserVehicle" ALTER COLUMN user_vehicle_id SET DEFAULT nextval('public."UserVehicle_user_vehicle_id_seq"'::regclass);


--
-- Name: Vehicles vehicle_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vehicles" ALTER COLUMN vehicle_id SET DEFAULT nextval('public."Vehicles_vehicle_id_seq"'::regclass);


--
-- Name: Weather weather_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Weather" ALTER COLUMN weather_id SET DEFAULT nextval('public."Weather_weather_id_seq"'::regclass);


--
-- Data for Name: Accidents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Accidents" (accident_id, accident_type) FROM stdin;
\.


--
-- Data for Name: Claims; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Claims" (claim_id, injury_prognosis, injury_description, police_report_filed, num_witnesses, claim_date) FROM stdin;
\.


--
-- Data for Name: Drivers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Drivers" (driver_id, age, gender, passengers, driver_first_name, driver_last_name) FROM stdin;
\.


--
-- Data for Name: UserAccident; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserAccident" (user_accident_id, accident_id, weather_id, user_vehicle_id, accident_description, accident_date) FROM stdin;
\.


--
-- Data for Name: UserClaims; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserClaims" (user_claim_id, user_accident_id, claim_id, expense_type, amount, user_id) FROM stdin;
\.


--
-- Data for Name: UserVehicle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UserVehicle" (user_vehicle_id, user_id, vehicle_id, vehicle_age, driver_id) FROM stdin;
\.


--
-- Data for Name: Vehicles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Vehicles" (vehicle_id, vehicle_type) FROM stdin;
\.


--
-- Data for Name: Weather; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Weather" (weather_id, weather_type) FROM stdin;
\.


--
-- Name: Accidents_accident_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Accidents_accident_id_seq"', 1, false);


--
-- Name: Claims_claim_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Claims_claim_id_seq"', 1, false);


--
-- Name: Drivers_driver_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Drivers_driver_id_seq"', 1, false);


--
-- Name: UserAccident_user_accident_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UserAccident_user_accident_id_seq"', 1, false);


--
-- Name: UserClaims_user_claim_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UserClaims_user_claim_id_seq"', 1, false);


--
-- Name: UserVehicle_user_vehicle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UserVehicle_user_vehicle_id_seq"', 1, false);


--
-- Name: Vehicles_vehicle_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Vehicles_vehicle_id_seq"', 1, false);


--
-- Name: Weather_weather_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Weather_weather_id_seq"', 1, false);


--
-- Name: Accidents Accidents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Accidents"
    ADD CONSTRAINT "Accidents_pkey" PRIMARY KEY (accident_id);


--
-- Name: Claims Claims_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Claims"
    ADD CONSTRAINT "Claims_pkey" PRIMARY KEY (claim_id);


--
-- Name: Drivers Drivers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Drivers"
    ADD CONSTRAINT "Drivers_pkey" PRIMARY KEY (driver_id);


--
-- Name: UserAccident UserAccident_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserAccident"
    ADD CONSTRAINT "UserAccident_pkey" PRIMARY KEY (user_accident_id);


--
-- Name: UserClaims UserClaims_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserClaims"
    ADD CONSTRAINT "UserClaims_pkey" PRIMARY KEY (user_claim_id);


--
-- Name: UserVehicle UserVehicle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserVehicle"
    ADD CONSTRAINT "UserVehicle_pkey" PRIMARY KEY (user_vehicle_id);


--
-- Name: Vehicles Vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vehicles"
    ADD CONSTRAINT "Vehicles_pkey" PRIMARY KEY (vehicle_id);


--
-- Name: Weather Weather_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Weather"
    ADD CONSTRAINT "Weather_pkey" PRIMARY KEY (weather_id);


--
-- Name: UserAccident accident_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserAccident"
    ADD CONSTRAINT accident_id FOREIGN KEY (accident_id) REFERENCES public."Accidents"(accident_id) NOT VALID;


--
-- Name: UserClaims claim_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserClaims"
    ADD CONSTRAINT claim_id FOREIGN KEY (claim_id) REFERENCES public."Claims"(claim_id) NOT VALID;


--
-- Name: UserVehicle driver_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserVehicle"
    ADD CONSTRAINT driver_id FOREIGN KEY (driver_id) REFERENCES public."Drivers"(driver_id) NOT VALID;


--
-- Name: UserClaims user_accident_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserClaims"
    ADD CONSTRAINT user_accident_id FOREIGN KEY (user_accident_id) REFERENCES public."UserAccident"(user_accident_id) NOT VALID;


--
-- Name: UserAccident user_vehicle_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserAccident"
    ADD CONSTRAINT user_vehicle_id FOREIGN KEY (user_vehicle_id) REFERENCES public."UserVehicle"(user_vehicle_id) NOT VALID;


--
-- Name: UserVehicle vehicle_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserVehicle"
    ADD CONSTRAINT vehicle_id FOREIGN KEY (vehicle_id) REFERENCES public."Vehicles"(vehicle_id);


--
-- Name: UserAccident weather_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UserAccident"
    ADD CONSTRAINT weather_id FOREIGN KEY (weather_id) REFERENCES public."Weather"(weather_id) NOT VALID;


--
-- PostgreSQL database dump complete
--

