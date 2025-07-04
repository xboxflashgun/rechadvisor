--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET idle_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
SET partition_backend = 'internal';

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accs; Type: TABLE; Schema: public; Owner: eugene
--

CREATE TABLE public.accs (
    accid integer NOT NULL,
    cell integer,
    box text,
    placeid integer,
    name text
);


ALTER TABLE public.accs OWNER TO eugene;

--
-- Name: accs_accid_seq; Type: SEQUENCE; Schema: public; Owner: eugene
--

CREATE SEQUENCE public.accs_accid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.accs_accid_seq OWNER TO eugene;

--
-- Name: accs_accid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eugene
--

ALTER SEQUENCE public.accs_accid_seq OWNED BY public.accs.accid;


--
-- Name: placelog; Type: TABLE; Schema: public; Owner: eugene
--

CREATE TABLE public.placelog (
    pdate date,
    accid integer,
    placeid integer,
    box text
);


ALTER TABLE public.placelog OWNER TO eugene;

--
-- Name: places; Type: TABLE; Schema: public; Owner: eugene
--

CREATE TABLE public.places (
    placeid integer NOT NULL,
    place text
);


ALTER TABLE public.places OWNER TO eugene;

--
-- Name: places_placeid_seq; Type: SEQUENCE; Schema: public; Owner: eugene
--

CREATE SEQUENCE public.places_placeid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.places_placeid_seq OWNER TO eugene;

--
-- Name: places_placeid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eugene
--

ALTER SEQUENCE public.places_placeid_seq OWNED BY public.places.placeid;


--
-- Name: vollog; Type: TABLE; Schema: public; Owner: eugene
--

CREATE TABLE public.vollog (
    vdate date,
    accid integer,
    volume integer,
    box text
);


ALTER TABLE public.vollog OWNER TO eugene;

--
-- Name: accs accid; Type: DEFAULT; Schema: public; Owner: eugene
--

ALTER TABLE ONLY public.accs ALTER COLUMN accid SET DEFAULT nextval('public.accs_accid_seq'::regclass);


--
-- Name: places placeid; Type: DEFAULT; Schema: public; Owner: eugene
--

ALTER TABLE ONLY public.places ALTER COLUMN placeid SET DEFAULT nextval('public.places_placeid_seq'::regclass);


--
-- Name: accs accs_pkey; Type: CONSTRAINT; Schema: public; Owner: eugene
--

ALTER TABLE ONLY public.accs
    ADD CONSTRAINT accs_pkey PRIMARY KEY (accid);


--
-- Name: places places_pkey; Type: CONSTRAINT; Schema: public; Owner: eugene
--

ALTER TABLE ONLY public.places
    ADD CONSTRAINT places_pkey PRIMARY KEY (placeid);


--
-- Name: vollog_vdate_accid_idx; Type: INDEX; Schema: public; Owner: eugene
--

CREATE UNIQUE INDEX vollog_vdate_accid_idx ON public.vollog USING btree (vdate, accid);


--
-- Name: TABLE accs; Type: ACL; Schema: public; Owner: eugene
--

GRANT ALL ON TABLE public.accs TO readonly;


--
-- Name: TABLE placelog; Type: ACL; Schema: public; Owner: eugene
--

GRANT ALL ON TABLE public.placelog TO readonly;


--
-- Name: TABLE places; Type: ACL; Schema: public; Owner: eugene
--

GRANT ALL ON TABLE public.places TO readonly;


--
-- Name: TABLE vollog; Type: ACL; Schema: public; Owner: eugene
--

GRANT ALL ON TABLE public.vollog TO readonly;


--
-- PostgreSQL database dump complete
--

