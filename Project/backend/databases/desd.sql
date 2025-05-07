
CREATE DATABASE desd;

-- Connect to unified database
\c desd


CREATE TABLE public."Roles" (
    role_id serial PRIMARY KEY,
    role_name character varying(75) NOT NULL
);

CREATE TABLE public."Permissions" (
    permission_id serial PRIMARY KEY,
    permission_name character varying(75) NOT NULL
);

CREATE TABLE public."RolePermissions" (
    role_permission_id serial PRIMARY KEY,
    role_id integer NOT NULL REFERENCES public."Roles"(role_id),
    permission_id integer NOT NULL REFERENCES public."Permissions"(permission_id)
);

CREATE TABLE public."Users" (
    user_id serial PRIMARY KEY,
    role_id integer NOT NULL REFERENCES public."Roles"(role_id),
    full_name character varying(70) NOT NULL,
    email character varying(254) NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    last_login timestamp without time zone NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    phone_number character varying(11),
    is_active boolean DEFAULT true NOT NULL,
    stripe_account_id character varying(255) NULL
);

CREATE TABLE public."UserModelFeedback" (
    feedback_id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES public."Users"(user_id),
    settlement_amount numeric DEFAULT 0 NOT NULL,
    expected_amount numeric DEFAULT 0 NOT NULL,
    feedback_rating smallint DEFAULT 0 NOT NULL,
    comments text
);

CREATE TABLE public."Accidents" (
    accident_id serial PRIMARY KEY,
    accident_type character varying(75) NOT NULL
);

CREATE TABLE public."Weather" (
    weather_id serial PRIMARY KEY,
    weather_conditions character varying(50) NOT NULL
);

CREATE TABLE public."Vehicles" (
    vehicle_id serial PRIMARY KEY,
    vehicle_type character varying(50) NOT NULL
);

CREATE TABLE public."Drivers" (
    driver_id serial PRIMARY KEY,
    driver_age integer NOT NULL,
    gender character varying(25) NOT NULL,
    number_of_passengers integer DEFAULT 0 NOT NULL
);

CREATE TABLE public."Claims" (
    claim_id serial PRIMARY KEY,
    injury_prognosis character varying(255) NOT NULL,
    injury_description text NOT NULL,
    police_report_filed boolean DEFAULT false NOT NULL,
    claim_date timestamp without time zone NOT NULL,
    witness_present boolean DEFAULT false NOT NULL,
    "SpecialHealthExpenses" NUMERIC DEFAULT 0 NOT NULL,
    "SpecialReduction" NUMERIC DEFAULT 0 NOT NULL,
    "SpecialOverage" NUMERIC DEFAULT 0 NOT NULL,
    "GeneralRest" NUMERIC DEFAULT 0 NOT NULL,
    "SpecialAdditionalInjury" NUMERIC DEFAULT 0 NOT NULL,
    "SpecialEarningsLoss" NUMERIC DEFAULT 0 NOT NULL,
    "SpecialUsageLoss" NUMERIC DEFAULT 0 NOT NULL,
    "SpecialMedication" NUMERIC DEFAULT 0 NOT NULL,
    "SpecialAssetDamage" NUMERIC DEFAULT 0 NOT NULL,
    "SpecialRehabilitation" NUMERIC DEFAULT 0 NOT NULL,
    "SpecialFixes" NUMERIC DEFAULT 0 NOT NULL,
    "GeneralFixed" NUMERIC DEFAULT 0 NOT NULL,
    "GeneralUplift" NUMERIC DEFAULT 0 NOT NULL,
    "SpecialLoanerVehicle" NUMERIC DEFAULT 0 NOT NULL,
    "SpecialTripCosts" NUMERIC DEFAULT 0 NOT NULL,
    "SpecialJourneyExpenses" NUMERIC DEFAULT 0 NOT NULL,
    "SpecialTherapy" NUMERIC DEFAULT 0 NOT NULL,
    "Exceptional_Circumstances" BOOLEAN DEFAULT FALSE NOT NULL,
    "Minor_Psychological_Injury" BOOLEAN DEFAULT FALSE NOT NULL,
    "Dominant_injury" CHARACTER VARYING(100),
    "Whiplash" BOOLEAN DEFAULT FALSE NOT NULL
);

CREATE TABLE public."UserVehicle" (
    user_vehicle_id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES public."Users"(user_id),
    vehicle_id integer NOT NULL REFERENCES public."Vehicles"(vehicle_id),
    vehicle_age integer NOT NULL,
    driver_id integer NOT NULL REFERENCES public."Drivers"(driver_id)
);

CREATE TABLE public."UserAccident" (
    user_accident_id serial PRIMARY KEY,
    accident_id integer NOT NULL REFERENCES public."Accidents"(accident_id),
    weather_id integer NOT NULL REFERENCES public."Weather"(weather_id),
    user_vehicle_id integer NOT NULL REFERENCES public."UserVehicle"(user_vehicle_id),
    accident_description text NOT NULL,
    accident_date timestamp without time zone NOT NULL
);

CREATE TABLE public."UserClaims" (
    user_claim_id serial PRIMARY KEY,
    user_accident_id integer NOT NULL REFERENCES public."UserAccident"(user_accident_id),
    claim_id integer NOT NULL REFERENCES public."Claims"(claim_id),
    predicted_settlement_value numeric NOT NULL,
    pending_claim CHARACTER VARYING(50) DEFAULT 'pending' NOT NULL CHECK (pending_claim IN ('pending', 'approved', 'rejected', 'settled')),
    user_id integer NOT NULL REFERENCES public."Users"(user_id)
);

CREATE TABLE public."Models" (
    model_id serial PRIMARY KEY,
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

CREATE TABLE public."Invoices" (
    invoice_id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES public."Users"(user_id),
    total_amount numeric NOT NULL,
    due_date timestamp without time zone NOT NULL,
    status boolean NOT NULL,
    generated_at timestamp without time zone NOT NULL
);

CREATE TABLE public."Payments" (
    payment_id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES public."Users"(user_id),
    amount numeric NOT NULL,
    status boolean NOT NULL,
    created_at timestamp without time zone NOT NULL
);

CREATE TABLE public."ActivityLogs" (
    log_id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES public."Users"(user_id),
    ip_address inet NOT NULL,
    description text NOT NULL,
    status_code character varying(3) NOT NULL,
    generated_at timestamp without time zone NOT NULL,
    event_type character varying(100) NOT NULL,
    device_info text
);

CREATE TABLE public."AuditLogs" (
    audit_id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES public."Users"(user_id),
    created_at timestamp without time zone NOT NULL,
    crud_action_type character varying(75) NOT NULL,
    table_name character varying(255) NOT NULL,
    table_column character varying(255) NOT NULL,
    table_record_id integer NOT NULL,
    action_details text NOT NULL
);

CREATE TABLE public."ModelUsageLogs" (
    usage_id serial PRIMARY KEY,
    user_id integer NOT NULL REFERENCES public."Users"(user_id),
    model_id integer NOT NULL REFERENCES public."Models"(model_id),
    num_predictions integer NOT NULL,
    model_duration interval NOT NULL,
    created_at timestamp without time zone NOT NULL
);

-- Django-specific tables
CREATE TABLE public.django_migrations (
    id bigint NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);

CREATE SEQUENCE public.django_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.django_migrations_id_seq OWNED BY public.django_migrations.id;
ALTER TABLE ONLY public.django_migrations ALTER COLUMN id SET DEFAULT nextval('public.django_migrations_id_seq'::regclass);
ALTER TABLE ONLY public.django_migrations ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);

CREATE SEQUENCE public.django_content_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.django_content_type_id_seq OWNED BY public.django_content_type.id;
ALTER TABLE ONLY public.django_content_type ALTER COLUMN id SET DEFAULT nextval('public.django_content_type_id_seq'::regclass);
ALTER TABLE ONLY public.django_content_type ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.django_content_type ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);

ALTER TABLE ONLY public.django_session ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);
CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);
CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);

CREATE TABLE public.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);

CREATE SEQUENCE public.django_admin_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.django_admin_log_id_seq OWNED BY public.django_admin_log.id;
ALTER TABLE ONLY public.django_admin_log ALTER COLUMN id SET DEFAULT nextval('public.django_admin_log_id_seq'::regclass);
ALTER TABLE ONLY public.django_admin_log ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);
CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log USING btree (content_type_id);
ALTER TABLE ONLY public.django_admin_log ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE ONLY public.django_admin_log ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_users_id FOREIGN KEY (user_id) REFERENCES public."Users"(user_id) DEFERRABLE INITIALLY DEFERRED;

-- Auth tables for JWT and permissions
CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);

CREATE SEQUENCE public.auth_permission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.auth_permission_id_seq OWNED BY public.auth_permission.id;
ALTER TABLE ONLY public.auth_permission ALTER COLUMN id SET DEFAULT nextval('public.auth_permission_id_seq'::regclass);
ALTER TABLE ONLY public.auth_permission ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.auth_permission ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);
CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);
ALTER TABLE ONLY public.auth_permission ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;

-- Token blacklist tables
CREATE TABLE public.token_blacklist_outstandingtoken (
    id bigint NOT NULL,
    token text NOT NULL,
    created_at timestamp with time zone,
    expires_at timestamp with time zone NOT NULL,
    user_id integer,
    jti character varying(255) NOT NULL
);

CREATE SEQUENCE public.token_blacklist_outstandingtoken_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.token_blacklist_outstandingtoken_id_seq OWNED BY public.token_blacklist_outstandingtoken.id;
ALTER TABLE ONLY public.token_blacklist_outstandingtoken ALTER COLUMN id SET DEFAULT nextval('public.token_blacklist_outstandingtoken_id_seq'::regclass);
ALTER TABLE ONLY public.token_blacklist_outstandingtoken ADD CONSTRAINT token_blacklist_outstandingtoken_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.token_blacklist_outstandingtoken ADD CONSTRAINT token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq UNIQUE (jti);
CREATE INDEX token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_like ON public.token_blacklist_outstandingtoken USING btree (jti varchar_pattern_ops);
CREATE INDEX token_blacklist_outstandingtoken_user_id_83bc629a ON public.token_blacklist_outstandingtoken USING btree (user_id);
ALTER TABLE ONLY public.token_blacklist_outstandingtoken ADD CONSTRAINT token_blacklist_outs_user_id_83bc629a_fk_users_Use FOREIGN KEY (user_id) REFERENCES public."Users"(user_id) DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE public.token_blacklist_blacklistedtoken (
    id bigint NOT NULL,
    blacklisted_at timestamp with time zone NOT NULL,
    token_id bigint NOT NULL
);

CREATE SEQUENCE public.token_blacklist_blacklistedtoken_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.token_blacklist_blacklistedtoken_id_seq OWNED BY public.token_blacklist_blacklistedtoken.id;
ALTER TABLE ONLY public.token_blacklist_blacklistedtoken ALTER COLUMN id SET DEFAULT nextval('public.token_blacklist_blacklistedtoken_id_seq'::regclass);
ALTER TABLE ONLY public.token_blacklist_blacklistedtoken ADD CONSTRAINT token_blacklist_blacklistedtoken_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.token_blacklist_blacklistedtoken ADD CONSTRAINT token_blacklist_blacklistedtoken_token_id_key UNIQUE (token_id);
ALTER TABLE ONLY public.token_blacklist_blacklistedtoken ADD CONSTRAINT token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk FOREIGN KEY (token_id) REFERENCES public.token_blacklist_outstandingtoken(id) DEFERRABLE INITIALLY DEFERRED;

-- Authtoken tables
CREATE TABLE public.authtoken_token (
    key character varying(40) NOT NULL,
    created timestamp with time zone NOT NULL,
    user_id integer NOT NULL
);

ALTER TABLE ONLY public.authtoken_token ADD CONSTRAINT authtoken_token_pkey PRIMARY KEY (key);
ALTER TABLE ONLY public.authtoken_token ADD CONSTRAINT authtoken_token_user_id_key UNIQUE (user_id);
CREATE INDEX authtoken_token_key_10f0b77e_like ON public.authtoken_token USING btree (key varchar_pattern_ops);
ALTER TABLE ONLY public.authtoken_token ADD CONSTRAINT authtoken_token_user_id_35299eff_fk_users_Use FOREIGN KEY (user_id) REFERENCES public."Users"(user_id) DEFERRABLE INITIALLY DEFERRED;