--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5 (Debian 17.5-1.pgdg110+1)
-- Dumped by pg_dump version 17.5 (Debian 17.5-1.pgdg110+1)

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

--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cats; Type: TABLE; Schema: public; Owner: openstreet-cat
--

CREATE TABLE public.cats (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    gender text NOT NULL,
    location public.geography(Point,4326),
    created_at timestamp with time zone NOT NULL,
    created_by bigint NOT NULL,
    description text,
    CONSTRAINT cats_gender_check CHECK ((gender = ANY (ARRAY['male'::text, 'female'::text, 'unknown'::text])))
);


ALTER TABLE public.cats OWNER TO "openstreet-cat";

--
-- Name: cats_id_seq; Type: SEQUENCE; Schema: public; Owner: openstreet-cat
--

ALTER TABLE public.cats ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.cats_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: openstreet-cat
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    username character varying(100) NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO "openstreet-cat";

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: openstreet-cat
--

ALTER TABLE public.users ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: cats; Type: TABLE DATA; Schema: public; Owner: openstreet-cat
--

COPY public.cats (id, name, gender, location, created_at, created_by, description) FROM stdin;
1	Барсик	male	0101000020E6100000A835CD3B4ED1024076E09C11A56D4840	2026-09-12 13:16:17.168801+00	1	\N
7	cat 11	unknown	0101000020E6100000A18499B67FBD4540EFE6A90EB9514C40	2026-09-30 12:02:27.702803+00	1	\N
8	Мурка	female	0101000020E61000000000000000C04540CDCCCCCCCC5C4C40	2026-10-11 00:00:00+00	1	Милая, рыжая кошка
\.


--
-- Data for Name: spatial_ref_sys; Type: TABLE DATA; Schema: public; Owner: openstreet-cat
--

COPY public.spatial_ref_sys (srid, auth_name, auth_srid, srtext, proj4text) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: openstreet-cat
--

COPY public.users (id, username, password_hash, created_at) FROM stdin;
1	Nikitoring	$2b$12$cUjuZ77pM5LVX3sz1lB5u.AMOE42Nhlv/uyrE02lpjeH11ebPGazK	2026-09-30 11:29:51.808057+00
4	Tishka	$2b$12$1qBshkC76uWR2YZ/d2unguuY46PQP4/0CLUuKqLHePDDDk3ulSHhG	2026-10-25 12:53:34.33657+00
\.


--
-- Name: cats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: openstreet-cat
--

SELECT pg_catalog.setval('public.cats_id_seq', 8, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: openstreet-cat
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: cats cats_pkey; Type: CONSTRAINT; Schema: public; Owner: openstreet-cat
--

ALTER TABLE ONLY public.cats
    ADD CONSTRAINT cats_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: openstreet-cat
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: openstreet-cat
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- PostgreSQL database dump complete
--

