--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Debian 15.1-1.pgdg110+1)
-- Dumped by pg_dump version 15.1 (Debian 15.1-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: achievements; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.achievements (
    achievementid integer NOT NULL,
    achievementname character varying(100),
    achievementdescription character varying
);


ALTER TABLE public.achievements OWNER TO pong;

--
-- Name: friends; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.friends (
    requesterid character varying(8) NOT NULL,
    addresseeid character varying(8) NOT NULL,
    statuscode character(1)
);


ALTER TABLE public.friends OWNER TO pong;

--
-- Name: friendship_codes; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.friendship_codes (
    statuscode character(1),
    statusname character varying(100)
);


ALTER TABLE public.friendship_codes OWNER TO pong;

--
-- Name: ladderlevel; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.ladderlevel (
    levelid integer,
    levelname character varying(100)
);


ALTER TABLE public.ladderlevel OWNER TO pong;

--
-- Name: match_history; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.match_history (
    matchid integer NOT NULL,
    match_type integer NOT NULL
);


ALTER TABLE public.match_history OWNER TO pong;

--
-- Name: online_codes; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.online_codes (
    statuscode character(1),
    statusname character varying(100)
);


ALTER TABLE public.online_codes OWNER TO pong;

--
-- Name: user_match; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.user_match (
    userid character varying(8) NOT NULL,
    matchid integer NOT NULL,
    user_score integer NOT NULL
);


ALTER TABLE public.user_match OWNER TO pong;

--
-- Name: users; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.users (
    userid character varying(8) NOT NULL,
    username character varying(100),
    avatar bytea NOT NULL,
    "2fa" integer DEFAULT 0 NOT NULL,
    status character(1)
);


ALTER TABLE public.users OWNER TO pong;

--
-- Name: COLUMN users.userid; Type: COMMENT; Schema: public; Owner: pong
--

COMMENT ON COLUMN public.users.userid IS 'intra name';


--
-- Name: COLUMN users.username; Type: COMMENT; Schema: public; Owner: pong
--

COMMENT ON COLUMN public.users.username IS 'unique name that can be chosen by the user';


--
-- Name: COLUMN users.avatar; Type: COMMENT; Schema: public; Owner: pong
--

COMMENT ON COLUMN public.users.avatar IS 'thumbnail of an avatar picture (default intra pic)';


--
-- Name: COLUMN users."2fa"; Type: COMMENT; Schema: public; Owner: pong
--

COMMENT ON COLUMN public.users."2fa" IS 'not yet known\nid of data in another table? yes / no ?';


--
-- Name: users_achievements; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.users_achievements (
    userid character varying(8),
    achievementid integer
);


ALTER TABLE public.users_achievements OWNER TO pong;

--
-- Name: userstats; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.userstats (
    userid character varying(8) NOT NULL,
    wins integer,
    losses integer,
    ladderlevel integer
);


ALTER TABLE public.userstats OWNER TO pong;

--
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.achievements (achievementid, achievementname, achievementdescription) FROM stdin;
\.


--
-- Data for Name: friends; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.friends (requesterid, addresseeid, statuscode) FROM stdin;
\.


--
-- Data for Name: friendship_codes; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.friendship_codes (statuscode, statusname) FROM stdin;
\.


--
-- Data for Name: ladderlevel; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.ladderlevel (levelid, levelname) FROM stdin;
\.


--
-- Data for Name: match_history; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.match_history (matchid, match_type) FROM stdin;
\.


--
-- Data for Name: online_codes; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.online_codes (statuscode, statusname) FROM stdin;
\.


--
-- Data for Name: user_match; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.user_match (userid, matchid, user_score) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.users (userid, username, avatar, "2fa", status) FROM stdin;
\.


--
-- Data for Name: users_achievements; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.users_achievements (userid, achievementid) FROM stdin;
\.


--
-- Data for Name: userstats; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.userstats (userid, wins, losses, ladderlevel) FROM stdin;
\.


--
-- Name: achievements pk_achievements; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT pk_achievements PRIMARY KEY (achievementid);


--
-- Name: match_history pk_match_history; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.match_history
    ADD CONSTRAINT pk_match_history PRIMARY KEY (matchid);


--
-- Name: user_match pk_user_match; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.user_match
    ADD CONSTRAINT pk_user_match PRIMARY KEY (userid);


--
-- Name: users pk_users; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT pk_users PRIMARY KEY (userid);


--
-- Name: userstats pk_userstats; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.userstats
    ADD CONSTRAINT pk_userstats PRIMARY KEY (userid);


--
-- Name: friends unq_friends_addresseeid; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.friends
    ADD CONSTRAINT unq_friends_addresseeid UNIQUE (addresseeid);


--
-- Name: friends unq_friends_requesterid; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.friends
    ADD CONSTRAINT unq_friends_requesterid UNIQUE (requesterid);


--
-- Name: friends unq_friends_statuscode; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.friends
    ADD CONSTRAINT unq_friends_statuscode UNIQUE (statuscode);


--
-- Name: user_match unq_user_match_matchid; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.user_match
    ADD CONSTRAINT unq_user_match_matchid UNIQUE (matchid);


--
-- Name: users_achievements unq_users_achievements_achievementid; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.users_achievements
    ADD CONSTRAINT unq_users_achievements_achievementid UNIQUE (achievementid);


--
-- Name: users_achievements unq_users_achievements_userid; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.users_achievements
    ADD CONSTRAINT unq_users_achievements_userid UNIQUE (userid);


--
-- Name: users unq_users_status; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unq_users_status UNIQUE (status);


--
-- Name: userstats unq_userstats_ladderlevel; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.userstats
    ADD CONSTRAINT unq_userstats_ladderlevel UNIQUE (ladderlevel);


--
-- Name: achievements fk_achievements_users_achievements; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT fk_achievements_users_achievements FOREIGN KEY (achievementid) REFERENCES public.users_achievements(achievementid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ladderlevel fk_ladderlevel_userstats; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.ladderlevel
    ADD CONSTRAINT fk_ladderlevel_userstats FOREIGN KEY (levelid) REFERENCES public.userstats(ladderlevel) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: match_history fk_match_history_user_match; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.match_history
    ADD CONSTRAINT fk_match_history_user_match FOREIGN KEY (matchid) REFERENCES public.user_match(matchid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: online_codes fk_online_codes_users; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.online_codes
    ADD CONSTRAINT fk_online_codes_users FOREIGN KEY (statuscode) REFERENCES public.users(status) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: friendship_codes fk_statuscodes_friends; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.friendship_codes
    ADD CONSTRAINT fk_statuscodes_friends FOREIGN KEY (statuscode) REFERENCES public.friends(statuscode) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users fk_users_friends; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_friends FOREIGN KEY (userid) REFERENCES public.friends(requesterid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users fk_users_friends_0; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_friends_0 FOREIGN KEY (userid) REFERENCES public.friends(addresseeid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users fk_users_user_match; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_user_match FOREIGN KEY (userid) REFERENCES public.user_match(userid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users fk_users_users_achievements; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_users_achievements FOREIGN KEY (userid) REFERENCES public.users_achievements(userid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users fk_users_userstats; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_userstats FOREIGN KEY (userid) REFERENCES public.userstats(userid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

