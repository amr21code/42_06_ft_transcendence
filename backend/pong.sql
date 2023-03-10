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
-- Name: avatars; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.avatars (
    avatarurl character varying(200),
    avatarname character varying(100),
    avatarid integer NOT NULL
);


ALTER TABLE public.avatars OWNER TO pong;

--
-- Name: chat; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.chat (
    type integer DEFAULT 0 NOT NULL,
    password character varying(100),
    chatid integer NOT NULL,
    chat_name character varying(100) DEFAULT 'yet another chat'::character varying NOT NULL
);


ALTER TABLE public.chat OWNER TO pong;

--
-- Name: chat_chatid_seq; Type: SEQUENCE; Schema: public; Owner: pong
--

CREATE SEQUENCE public.chat_chatid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chat_chatid_seq OWNER TO pong;

--
-- Name: chat_chatid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pong
--

ALTER SEQUENCE public.chat_chatid_seq OWNED BY public.chat.chatid;


--
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.chat_messages (
    userid character varying(8) NOT NULL,
    chatid integer NOT NULL,
    message text,
    "time" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.chat_messages OWNER TO pong;

--
-- Name: chat_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: pong
--

CREATE SEQUENCE public.chat_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chat_messages_id_seq OWNER TO pong;

--
-- Name: chat_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pong
--

ALTER SEQUENCE public.chat_messages_id_seq OWNED BY public.chat_messages.id;


--
-- Name: chat_type; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.chat_type (
    typeid integer NOT NULL,
    typename character varying(100)
);


ALTER TABLE public.chat_type OWNER TO pong;

--
-- Name: COLUMN chat_type.typename; Type: COMMENT; Schema: public; Owner: pong
--

COMMENT ON COLUMN public.chat_type.typename IS '0 public,\n1 protected,\n2 private,\n3 direct';


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
    statuscode character(1) NOT NULL,
    statusname character varying(100)
);


ALTER TABLE public.friendship_codes OWNER TO pong;

--
-- Name: match_history; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.match_history (
    matchid integer NOT NULL,
    match_type integer NOT NULL
);


ALTER TABLE public.match_history OWNER TO pong;

--
-- Name: online_status; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.online_status (
    statusname character varying(100),
    statuscode integer NOT NULL
);


ALTER TABLE public.online_status OWNER TO pong;

--
-- Name: TABLE online_status; Type: COMMENT; Schema: public; Owner: pong
--

COMMENT ON TABLE public.online_status IS 'offline\nonline\nplaying\nmatchmaking';


--
-- Name: user_chat; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.user_chat (
    userid character varying(8) NOT NULL,
    chatid integer NOT NULL,
    status integer NOT NULL,
    bantime timestamp without time zone
);


ALTER TABLE public.user_chat OWNER TO pong;

--
-- Name: user_match; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.user_match (
    userid character varying(8) NOT NULL,
    matchid integer NOT NULL,
    user_score integer NOT NULL,
    challenge integer DEFAULT 0 NOT NULL,
    timeout timestamp without time zone NOT NULL
);


ALTER TABLE public.user_match OWNER TO pong;

--
-- Name: COLUMN user_match.challenge; Type: COMMENT; Schema: public; Owner: pong
--

COMMENT ON COLUMN public.user_match.challenge IS '0 not accepted\n1 accepted\n2 queue';


--
-- Name: user_status_chat; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.user_status_chat (
    statusid integer NOT NULL,
    statusname character varying(100)
);


ALTER TABLE public.user_status_chat OWNER TO pong;

--
-- Name: TABLE user_status_chat; Type: COMMENT; Schema: public; Owner: pong
--

COMMENT ON TABLE public.user_status_chat IS '0 admin\n1 member\n2 muted\n3 ban';


--
-- Name: users; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.users (
    userid character varying(8) NOT NULL,
    username character varying(100),
    twofa integer DEFAULT 0 NOT NULL,
    created timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    user_status integer DEFAULT 0 NOT NULL,
    profilepic42 character varying(200),
    avatar integer DEFAULT 42 NOT NULL
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
-- Name: COLUMN users.twofa; Type: COMMENT; Schema: public; Owner: pong
--

COMMENT ON COLUMN public.users.twofa IS 'not yet known\nid of data in another table? yes / no ?';


--
-- Name: users_achievements; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.users_achievements (
    userid character varying(8),
    achievementid integer,
    count integer,
    id integer NOT NULL
);


ALTER TABLE public.users_achievements OWNER TO pong;

--
-- Name: users_achievements_id_seq; Type: SEQUENCE; Schema: public; Owner: pong
--

CREATE SEQUENCE public.users_achievements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_achievements_id_seq OWNER TO pong;

--
-- Name: users_achievements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pong
--

ALTER SEQUENCE public.users_achievements_id_seq OWNED BY public.users_achievements.id;


--
-- Name: userstats; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.userstats (
    userid character varying(8) NOT NULL,
    wins integer,
    losses integer
);


ALTER TABLE public.userstats OWNER TO pong;

--
-- Name: chat chatid; Type: DEFAULT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.chat ALTER COLUMN chatid SET DEFAULT nextval('public.chat_chatid_seq'::regclass);


--
-- Name: chat_messages id; Type: DEFAULT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.chat_messages ALTER COLUMN id SET DEFAULT nextval('public.chat_messages_id_seq'::regclass);


--
-- Name: users_achievements id; Type: DEFAULT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.users_achievements ALTER COLUMN id SET DEFAULT nextval('public.users_achievements_id_seq'::regclass);


--
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.achievements (achievementid, achievementname, achievementdescription) FROM stdin;
0	First Blood	You scored the first point in a match
1	Too easy	You won to zero
2	the Gui	changed your name to Guillaume Calvi
3	the Chatty one	typed 10 messages in one chat
4	MacBeth	said something insulting in french in a chat
\.


--
-- Data for Name: avatars; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.avatars (avatarurl, avatarname, avatarid) FROM stdin;
/src/assets/bitcoin-black-white.png	Bitcoin-Logo	0
\N	42 Profile Picture	42
\.


--
-- Data for Name: chat; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.chat (type, password, chatid, chat_name) FROM stdin;
0		1	new name
\.


--
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.chat_messages (userid, chatid, message, "time", id) FROM stdin;
anruland	1	testnachricht	2023-01-08 16:40:56.050666	2
anruland	1	testnachricht	2023-01-08 16:41:13.182293	3
djedasch	1	testnachricht2	2023-01-08 16:41:29.510422	4
jtomala	1	test	2023-01-08 16:44:00.796979	8
anruland	1	test	2023-01-09 14:51:53.502991	9
\.


--
-- Data for Name: chat_type; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.chat_type (typeid, typename) FROM stdin;
0	public
3	direct
1	protected
2	private
\.


--
-- Data for Name: friends; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.friends (requesterid, addresseeid, statuscode) FROM stdin;
jtomala	raweber	2
jtomala	djedasch	1
djedasch	raweber	1
\.


--
-- Data for Name: friendship_codes; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.friendship_codes (statuscode, statusname) FROM stdin;
0	requested
1	friends
2	blocked
\.


--
-- Data for Name: match_history; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.match_history (matchid, match_type) FROM stdin;
\.


--
-- Data for Name: online_status; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.online_status (statusname, statuscode) FROM stdin;
offline	0
online	1
playing	2
matchmaking	3
\.


--
-- Data for Name: user_chat; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.user_chat (userid, chatid, status, bantime) FROM stdin;
djedasch	1	0	\N
anruland	1	3	2023-01-09 14:53:10.993
\.


--
-- Data for Name: user_match; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.user_match (userid, matchid, user_score, challenge, timeout) FROM stdin;
\.


--
-- Data for Name: user_status_chat; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.user_status_chat (statusid, statusname) FROM stdin;
0	admin
1	member
2	muted
3	ban
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.users (userid, username, twofa, created, user_status, profilepic42, avatar) FROM stdin;
raweber	raweber	0	2022-12-29 13:01:31.283	0	\N	0
djedasch	Desiree	0	2022-12-29 16:15:29.517	0	\N	0
anruland	Andreas	0	2023-01-05 08:37:27.188	0	https://cdn.intra.42.fr/users/cb10fe6877ac88da011465a5902d0f9a/small_anruland.jpg	42
jtomala	Jorit	0	2022-12-29 12:52:40.494	0	\N	0
\.


--
-- Data for Name: users_achievements; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.users_achievements (userid, achievementid, count, id) FROM stdin;
anruland	4	1	1
anruland	2	2	2
anruland	1	1	3
\.


--
-- Data for Name: userstats; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.userstats (userid, wins, losses) FROM stdin;
\.


--
-- Name: chat_chatid_seq; Type: SEQUENCE SET; Schema: public; Owner: pong
--

SELECT pg_catalog.setval('public.chat_chatid_seq', 22, true);


--
-- Name: chat_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pong
--

SELECT pg_catalog.setval('public.chat_messages_id_seq', 9, true);


--
-- Name: users_achievements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pong
--

SELECT pg_catalog.setval('public.users_achievements_id_seq', 3, true);


--
-- Name: achievements pk_achievements; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT pk_achievements PRIMARY KEY (achievementid);


--
-- Name: avatars pk_avatars; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.avatars
    ADD CONSTRAINT pk_avatars PRIMARY KEY (avatarid);


--
-- Name: chat pk_chat; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT pk_chat PRIMARY KEY (chatid);


--
-- Name: chat_messages pk_chat_messages; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT pk_chat_messages PRIMARY KEY (id);


--
-- Name: chat_type pk_chat_type; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.chat_type
    ADD CONSTRAINT pk_chat_type PRIMARY KEY (typeid);


--
-- Name: friendship_codes pk_friendship_codes; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.friendship_codes
    ADD CONSTRAINT pk_friendship_codes PRIMARY KEY (statuscode);


--
-- Name: match_history pk_match_history; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.match_history
    ADD CONSTRAINT pk_match_history PRIMARY KEY (matchid);


--
-- Name: online_status pk_online_status; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.online_status
    ADD CONSTRAINT pk_online_status PRIMARY KEY (statuscode);


--
-- Name: user_chat pk_user_chat; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.user_chat
    ADD CONSTRAINT pk_user_chat PRIMARY KEY (chatid, userid);


--
-- Name: user_status_chat pk_user_status_chat; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.user_status_chat
    ADD CONSTRAINT pk_user_status_chat PRIMARY KEY (statusid);


--
-- Name: users pk_users; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT pk_users PRIMARY KEY (userid);


--
-- Name: users_achievements pk_users_achievements; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.users_achievements
    ADD CONSTRAINT pk_users_achievements PRIMARY KEY (id);


--
-- Name: userstats pk_userstats; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.userstats
    ADD CONSTRAINT pk_userstats PRIMARY KEY (userid);


--
-- Name: friends unq_friends; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.friends
    ADD CONSTRAINT unq_friends UNIQUE (requesterid, addresseeid);


--
-- Name: user_match unq_user_match_matchid; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.user_match
    ADD CONSTRAINT unq_user_match_matchid UNIQUE (matchid);


--
-- Name: chat fk_chat_chat_type; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT fk_chat_chat_type FOREIGN KEY (type) REFERENCES public.chat_type(typeid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chat_messages fk_chat_messages_chat; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT fk_chat_messages_chat FOREIGN KEY (chatid) REFERENCES public.chat(chatid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: chat_messages fk_chat_messages_users; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT fk_chat_messages_users FOREIGN KEY (userid) REFERENCES public.users(userid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: friends fk_friends_friendship_codes; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.friends
    ADD CONSTRAINT fk_friends_friendship_codes FOREIGN KEY (statuscode) REFERENCES public.friendship_codes(statuscode) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: friends fk_friends_users; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.friends
    ADD CONSTRAINT fk_friends_users FOREIGN KEY (requesterid) REFERENCES public.users(userid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: friends fk_friends_users_0; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.friends
    ADD CONSTRAINT fk_friends_users_0 FOREIGN KEY (addresseeid) REFERENCES public.users(userid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_chat fk_user_chat_chat; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.user_chat
    ADD CONSTRAINT fk_user_chat_chat FOREIGN KEY (chatid) REFERENCES public.chat(chatid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_chat fk_user_chat_user_status_chat; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.user_chat
    ADD CONSTRAINT fk_user_chat_user_status_chat FOREIGN KEY (status) REFERENCES public.user_status_chat(statusid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_chat fk_user_chat_users; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.user_chat
    ADD CONSTRAINT fk_user_chat_users FOREIGN KEY (userid) REFERENCES public.users(userid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_match fk_user_match_match_history; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.user_match
    ADD CONSTRAINT fk_user_match_match_history FOREIGN KEY (matchid) REFERENCES public.match_history(matchid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_match fk_user_match_users; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.user_match
    ADD CONSTRAINT fk_user_match_users FOREIGN KEY (userid) REFERENCES public.users(userid) ON UPDATE CASCADE;


--
-- Name: users_achievements fk_users_achievements_achievements; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.users_achievements
    ADD CONSTRAINT fk_users_achievements_achievements FOREIGN KEY (achievementid) REFERENCES public.achievements(achievementid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users_achievements fk_users_achievements_users; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.users_achievements
    ADD CONSTRAINT fk_users_achievements_users FOREIGN KEY (userid) REFERENCES public.users(userid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users fk_users_avatars; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_avatars FOREIGN KEY (avatar) REFERENCES public.avatars(avatarid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users fk_users_online_status; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_users_online_status FOREIGN KEY (user_status) REFERENCES public.online_status(statuscode) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: userstats fk_userstats_users; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.userstats
    ADD CONSTRAINT fk_userstats_users FOREIGN KEY (userid) REFERENCES public.users(userid) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

