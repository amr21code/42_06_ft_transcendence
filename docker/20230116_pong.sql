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
-- Name: challenge_status; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.challenge_status (
    statuscode integer NOT NULL,
    status_name character varying(100)
);


ALTER TABLE public.challenge_status OWNER TO pong;

--
-- Name: TABLE challenge_status; Type: COMMENT; Schema: public; Owner: pong
--

COMMENT ON TABLE public.challenge_status IS '0 not accepted\n1 accepted\n2 queue';


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
    match_status integer NOT NULL,
    matchid integer NOT NULL
);


ALTER TABLE public.match_history OWNER TO pong;

--
-- Name: match_history_matchid_seq; Type: SEQUENCE; Schema: public; Owner: pong
--

CREATE SEQUENCE public.match_history_matchid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.match_history_matchid_seq OWNER TO pong;

--
-- Name: match_history_matchid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pong
--

ALTER SEQUENCE public.match_history_matchid_seq OWNED BY public.match_history.matchid;


--
-- Name: match_status; Type: TABLE; Schema: public; Owner: pong
--

CREATE TABLE public.match_status (
    statuscode integer NOT NULL,
    statusname character varying(100)
);


ALTER TABLE public.match_status OWNER TO pong;

--
-- Name: TABLE match_status; Type: COMMENT; Schema: public; Owner: pong
--

COMMENT ON TABLE public.match_status IS '0 finished\n1 active\n2 waiting for players';


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
    user_score integer DEFAULT 0 NOT NULL,
    challenge integer DEFAULT 0 NOT NULL,
    timeout timestamp without time zone
);


ALTER TABLE public.user_match OWNER TO pong;

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
    avatar integer DEFAULT 42 NOT NULL,
    twofasecret character varying(100),
    access_token character varying(100)
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
-- Name: match_history matchid; Type: DEFAULT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.match_history ALTER COLUMN matchid SET DEFAULT nextval('public.match_history_matchid_seq'::regclass);


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
2	the Gui	changed your name to GuillaumeCalvi
\.


--
-- Data for Name: avatars; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.avatars (avatarurl, avatarname, avatarid) FROM stdin;
/src/assets/bitcoin-black-white.png	Bitcoin-Logo	0
\N	42 Profile Picture	42
\.


--
-- Data for Name: challenge_status; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.challenge_status (statuscode, status_name) FROM stdin;
0	not accepted
1	accepted
2	queue
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
-- Data for Name: friendship_codes; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.friendship_codes (statuscode, statusname) FROM stdin;
0	requested
1	friends
2	blocked
\.


--
-- Data for Name: match_status; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.match_status (statuscode, statusname) FROM stdin;
0	finished
1	active
2	waiting for players
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
-- Data for Name: user_status_chat; Type: TABLE DATA; Schema: public; Owner: pong
--

COPY public.user_status_chat (statusid, statusname) FROM stdin;
0	admin
1	member
2	muted
3	ban
\.


--
-- Name: chat_chatid_seq; Type: SEQUENCE SET; Schema: public; Owner: pong
--

SELECT pg_catalog.setval('public.chat_chatid_seq', 37, true);


--
-- Name: chat_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pong
--

SELECT pg_catalog.setval('public.chat_messages_id_seq', 9, true);


--
-- Name: match_history_matchid_seq; Type: SEQUENCE SET; Schema: public; Owner: pong
--

SELECT pg_catalog.setval('public.match_history_matchid_seq', 8, true);


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
-- Name: challenge_status pk_challenge_status; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.challenge_status
    ADD CONSTRAINT pk_challenge_status PRIMARY KEY (statuscode);


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
-- Name: match_status pk_match_status; Type: CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.match_status
    ADD CONSTRAINT pk_match_status PRIMARY KEY (statuscode);


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
    ADD CONSTRAINT unq_user_match_matchid UNIQUE (matchid, userid);


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
-- Name: match_history fk_match_history_match_status; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.match_history
    ADD CONSTRAINT fk_match_history_match_status FOREIGN KEY (match_status) REFERENCES public.match_status(statuscode) ON UPDATE CASCADE ON DELETE CASCADE;


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
-- Name: user_match fk_user_match_challenge_status; Type: FK CONSTRAINT; Schema: public; Owner: pong
--

ALTER TABLE ONLY public.user_match
    ADD CONSTRAINT fk_user_match_challenge_status FOREIGN KEY (challenge) REFERENCES public.challenge_status(statuscode) ON UPDATE CASCADE ON DELETE CASCADE;


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

