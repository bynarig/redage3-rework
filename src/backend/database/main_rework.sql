CREATE TABLE IF NOT EXISTS accounts
(
    login                      varchar(50)  NOT NULL,
    email                      varchar(100) NOT NULL,
    password                   varchar(256) NOT NULL,
    hwid                       varchar(256) NOT NULL,
    ip                         varchar(256) NOT NULL,
    social_club                varchar(50)  NOT NULL,
    donut_currency             integer      NOT NULL DEFAULT 0,
    vip_lvl                    integer      NOT NULL,
    vip_date                   timestamp    NOT NULL,
    promo_codes                varchar(256) NOT NULL,
    bonus_codes                text         NOT NULL,
    character1                 integer      NOT NULL,
    character2                 integer      NOT NULL,
    character3                 integer      NOT NULL,
    characters                 varchar(100) NOT NULL DEFAULT '[-2,-2,-2,-2,-2,-2]',
    present                    smallint     NOT NULL DEFAULT 0,
    ref_present                smallint     NOT NULL DEFAULT 0,
    "case"                     varchar(100) NOT NULL DEFAULT '[0,0,0]',
    referral_id                integer      NOT NULL DEFAULT 0,
    is_subscribed              smallint     NOT NULL DEFAULT 0,
    subscribed_end_time        timestamp    NOT NULL DEFAULT current_timestamp,
    subscribe_time             timestamp    NOT NULL DEFAULT current_timestamp,
    collection_gifts           varchar(500) NOT NULL DEFAULT '[]',
    received_award             varchar(75)  NOT NULL DEFAULT '[0,0,0,0,0,0,0,0,1]',
    received_award_week        integer      NOT NULL DEFAULT 0,
    received_award_donate      integer      NOT NULL DEFAULT 0,
    "Unique"                   varchar(16)  NOT NULL DEFAULT '',
    last_select_character_uuid integer      NOT NULL DEFAULT 0,
    exit_date                  timestamp    NOT NULL DEFAULT current_timestamp,
    ga                         varchar(25)  NOT NULL DEFAULT '',
    PRIMARY KEY (login, email, social_club)
);

CREATE TYPE character_gender AS ENUM (
    'MALE',
    'FEMALE',
    'UNKNOWN'
    );

CREATE TABLE IF NOT EXISTS characters
(
    uuid              SERIAL PRIMARY KEY,
    is_deleted        boolean      NOT NULL                                    DEFAULT FALSE,
    deleted_date      timestamp                                                DEFAULT NULL,
    firstname         varchar(50)                                              DEFAULT NULL,
    lastname          varchar(50)                                              DEFAULT NULL,
    gender            character_gender                                         DEFAULT 'MALE',
    health            integer                                                  DEFAULT 100,
    armor             integer                                                  DEFAULT 0,
    lvl               integer                                                  DEFAULT 1,
    exp               integer                                                  DEFAULT 0,
    money             bigint                                                   DEFAULT 0,
    bank              integer                                                  DEFAULT NULL,
    work              integer                                                  DEFAULT NULL,
    fraction          integer                                                  DEFAULT NULL,
    fraction_lvl      integer                                                  DEFAULT NULL,
    drug_addiction    integer                                                  DEFAULT 0,
    arrests           integer                                                  DEFAULT NULL,
    demorgan          integer                                                  DEFAULT NULL,
    wanted_lvl        smallint                                                 DEFAULT 0,
    biz               varchar(50)                                              DEFAULT NULL,
--     admin_lvl         integer                                                  DEFAULT NULL,
    licenses          varchar(256)                                             DEFAULT NULL,
    unwarn            timestamp                                                DEFAULT NULL,
    unmute            integer                                                  DEFAULT 0,
    warns             integer                                                  DEFAULT NULL,
    on_duty           boolean                                                  DEFAULT FALSE,
    last_hour         integer                                                  DEFAULT NULL,
--     hotel             integer                                                  DEFAULT NULL,
--     hotel_left        integer                                                  DEFAULT NULL,
    contacts          varchar(2500)                                            DEFAULT NULL,
    achiev            varchar(2450)                                            DEFAULT NULL,
    sim_card          integer UNIQUE                                           DEFAULT NULL,
--     PetName           varchar(30)  NOT NULL                                    DEFAULT NULL,
    position          varchar(256)                                             DEFAULT NULL,
    dimension         integer                                                  DEFAULT NULL,
    create_date       timestamp                                                DEFAULT NULL,
--     demorgan_info     varchar(350)                                             DEFAULT '{Admin:-1,Reason:-1}',
    demorgan_times    integer                                                  DEFAULT 0,
--     warn_info         varchar(1000)                                            DEFAULT '{Admin:[-1,-1,-1],Reason:[-1,-1,-1]}',
    warn_times        integer                                                  DEFAULT 0,
    hours_played      integer                                                  DEFAULT 0,
--     time              varchar(250)                                             DEFAULT '{TotalTime:0,Day:16,TodayTime:0,Month:3,MonthTime:0,Year:2020,YearTime:0,Week:1,WeekTime:0}',
    deaths            bigint                                                   DEFAULT 0,
    kills             bigint                                                   DEFAULT 0,
    earned_money      bigint                                                   DEFAULT 0,
    eat_times         bigint                                                   DEFAULT 0,
    revived           bigint                                                   DEFAULT 0,
    hands_shaken      bigint                                                   DEFAULT 0,
--     job_skills        varchar(2048)         DEFAULT '{}', CREATED TABLE FOR THIS
    referral_code     varchar(64)                                              DEFAULT NULL,
    wedding_uuid      integer REFERENCES characters (uuid) ON DELETE NO ACTION DEFAULT NULL,
    WeddingName       varchar(50)  NOT NULL                                    DEFAULT '',
    MissionTask       text         NOT NULL                                    DEFAULT '{}',
    IsBannedMP        smallint     NOT NULL                                    DEFAULT 0,
    BanMPReason       varchar(64)  NOT NULL                                    DEFAULT '',
    IsBannedCrime     smallint     NOT NULL                                    DEFAULT 0,
    BanCrimeReason    varchar(64)  NOT NULL                                    DEFAULT '',
    SelectedQuest     varchar(42)  NOT NULL,
    isForbesShow      smallint     NOT NULL                                    DEFAULT 0,
    FractionTasksData varchar(350) NOT NULL                                    DEFAULT '[]',
    isLucky           smallint     NOT NULL                                    DEFAULT 0
);

ALTER TABLE characters
    ADD CONSTRAINT CK_HEALTH_LIMIT CHECK (health >= 0 AND health <= 100);
ALTER TABLE characters
    ADD CONSTRAINT CK_ARMOR_LIMIT CHECK (armor >= 0 AND armor <= 100);
ALTER TABLE characters
    ADD CONSTRAINT CK_DRUG_ADDICTION_LIMIT CHECK (drug_addiction >= 0 AND drug_addiction <= 100);
ALTER TABLE characters
    ADD CONSTRAINT CK_WANTED_LVL_LIMIT CHECK (wanted_lvl >= 0 AND wanted_lvl <= 5);
ALTER TABLE characters
    ADD CONSTRAINT CK_DIMENSION_LIMIT CHECK (dimension >= 0 AND dimension < 4294967295); -- RAGE MP DIMENSION LIMIT

ALTER TABLE characters
    ADD CONSTRAINT CK_MONEY_MIN CHECK (0 <= money);



CREATE TABLE IF NOT EXISTS warns
(
    uuid             integer PRIMARY KEY REFERENCES characters (uuid) ON DELETE NO ACTION ON UPDATE CASCADE,
    admin_uuid_warn1 integer REFERENCES characters (uuid) ON DELETE NO ACTION ON UPDATE CASCADE,
    warn1_date       timestamp DEFAULT NULL,
    reason_warn1     text NOT NULL,
    admin_uuid_warn2 integer REFERENCES characters (uuid) ON DELETE NO ACTION ON UPDATE CASCADE,
    warn2_date       timestamp DEFAULT NULL,
    reason_warn2     text NOT NULL,
    admin_uuid_warn3 integer REFERENCES characters (uuid) ON DELETE NO ACTION ON UPDATE CASCADE,
    warn3_date       timestamp DEFAULT NULL,
    reason_warn3     text NOT NULL
);

CREATE TABLE IF NOT EXISTS job_skills
(
    uuid                       integer PRIMARY KEY REFERENCES characters (uuid) ON DELETE NO ACTION ON UPDATE CASCADE,
    electrician_work           integer DEFAULT 0,
    postman_work               integer DEFAULT 0,
    taxi_work                  integer DEFAULT 0,
    bus_driver_work            integer DEFAULT 0,
    lawn_mover_work            integer DEFAULT 0,
    longhaul_truck_driver_work integer DEFAULT 0,
    collection_agent_work      integer DEFAULT 0,
    auto_Mechanic_work         integer DEFAULT 0
);

CREATE TYPE fractions_type AS ENUM (

--     gangs
    'THE_FAMILIES',
    'THE_BALLAS_GANG',
    'LOS_SANTOS_VAGOS',
    'MARABUNTA_GRANDE',
    'BLOOD_STREET',

--     governments
    'GOVERNMENT',
    'POLICE_DEPARTMENT',
    'HOSPITAL',
    'FIB',
    'ARMY',
    'SHERIFF',

--     mafias
    'LA_COSA_NOSTRA',
    'ALBANIAN_MAFIA',
    'YAKUZA',
    'MEXICAN_CARTEL',

--     other
    'NEWS',
    'THE_LOST',
    'MERRYWEATHER_SECURITY'
    );

CREATE TABLE IF NOT EXISTS characters_fractions
(
    uuid           integer REFERENCES characters (uuid) ON DELETE CASCADE ON UPDATE CASCADE,
    fraction       fractions_type NOT NULL DEFAULT NULL,
    fractions_rank integer        NOT NULL DEFAULT 0,
    PRIMARY KEY (uuid)
);

CREATE TABLE IF NOT EXISTS fractions
(
    name              integer        NOT NULL,
    name_enum         fractions_type NOT NULL DEFAULT 'THE_FAMILIES',
    min_lvl           integer        NOT NULL DEFAULT 0,
    is_crime          boolean        NOT NULL DEFAULT FALSE,
    is_mafia          boolean        NOT NULL DEFAULT FALSE,
    is_government     boolean        NOT NULL DEFAULT FALSE,
    is_private        boolean        NOT NULL DEFAULT FALSE,
    drugs             integer        NOT NULL,
    mats              integer        NOT NULL,
    medkits           integer        NOT NULL,
    coalore           integer        NOT NULL DEFAULT 0,
    ironore           integer        NOT NULL DEFAULT 0,
    sulfurore         integer        NOT NULL DEFAULT 0,
    preciou_sore      integer        NOT NULL DEFAULT 0,
    money             integer        NOT NULL,
    last_serial       integer        NOT NULL DEFAULT 0,
    weapons           text                    DEFAULT NULL,
    is_open           smallint       NOT NULL DEFAULT 0,
    is_open_gun_stock smallint       NOT NULL DEFAULT 0,
    fuel_limit        integer        NOT NULL,
    fuel_left         integer        NOT NULL,
--     clothing_sets     text           NOT NULL,
    discord_link      varchar(24)             DEFAULT '',
    departments       text                    DEFAULT '{}',
    tasksData         varchar(350)            DEFAULT '[]'
);


CREATE TABLE IF NOT EXISTS fraction_clothing_sets
(
    id             SERIAL PRIMARY KEY,
    fraction_name  integer                   DEFAULT 0,
    rank           integer                   DEFAULT 1,
    gender         character_gender NOT NULL DEFAULT 'MALE',
    name           varchar(24)      NOT NULL DEFAULT 'NEW CLOTHING SET',
    clothing_index integer                   DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS friends
(
    first_uuid  integer REFERENCES characters (uuid) ON DELETE CASCADE ON UPDATE CASCADE,
    second_uuid integer REFERENCES characters (uuid) ON DELETE CASCADE ON UPDATE CASCADE
--     fullname smallint    NOT NULL DEFAULT 0
);

-- CREATE TABLE IF NOT EXISTS furniture
-- (
--     uuid      integer NOT NULL,
--     furniture text         DEFAULT NULL,
--     data      text         DEFAULT NULL,
--     access    varchar(400) DEFAULT '[]'
-- );


CREATE TABLE IF NOT EXISTS banned
(
    uuid            integer PRIMARY KEY REFERENCES characters (uuid) ON DELETE NO ACTION ON UPDATE CASCADE,
    name            varchar(50) NOT NULL,
    account         varchar(50) NOT NULL,
    time            timestamp   NOT NULL,
    until           timestamp   NOT NULL,
    is_hard_ban     boolean      DEFAULT FALSE,
    ip              varchar(255) DEFAULT NULL,
    social_club     varchar(255) DEFAULT NULL,
    hwid            varchar(256) DEFAULT NULL,
    reason          varchar(300) DEFAULT NULL,
    by_admin        varchar(50)  DEFAULT NULL,
    rgsc_email_hash varchar(128) DEFAULT '-'
);

CREATE TABLE IF NOT EXISTS commands_access
(
    command  varchar(50) NOT NULL,
    is_admin smallint    NOT NULL,
    min_rank smallint    NOT NULL
);

CREATE TABLE IF NOT EXISTS admins
(
    uuid          integer REFERENCES characters (uuid) ON DELETE CASCADE ON UPDATE CASCADE,
    admin_lvl     integer NOT NULL DEFAULT 0,
    admin_log     boolean NOT NULL DEFAULT FALSE,
    error_log     boolean NOT NULL DEFAULT FALSE,
    win_log       boolean NOT NULL DEFAULT FALSE,
    agm           boolean NOT NULL DEFAULT FALSE,
    kl            boolean NOT NULL DEFAULT FALSE,
    hide_nickname boolean NOT NULL DEFAULT FALSE,
    hide_me       boolean NOT NULL DEFAULT FALSE,
    red_name      boolean NOT NULL DEFAULT TRUE,
    esp           boolean NOT NULL DEFAULT FALSE,
    is_invisible  boolean NOT NULL DEFAULT FALSE,
    PRIMARY KEY (uuid)
);

CREATE TYPE ad_status AS ENUM (
    'OPENED',
    'CLOSED',
    'REJECTED'
    );

CREATE TYPE ad_type AS ENUM (
    'NEWS',
    'ADVERTISEMENT',
    'BONUS',
    'GREETING',
    'WARNING',
    'OTHER'
    );
CREATE TABLE IF NOT EXISTS advertises
(
    advertises_id SERIAL PRIMARY KEY,
    author_uuid   integer REFERENCES characters (uuid) ON DELETE NO ACTION,
    author_sim    integer REFERENCES characters (sim_card) ON DELETE NO ACTION,
    ad            varchar(150) NOT NULL,
    link          varchar(150) NOT NULL DEFAULT '',
    editor_uuid   integer REFERENCES characters (uuid) ON DELETE NO ACTION,
    edited_ad     varchar(500)          DEFAULT NULL,
    opened_at     timestamp    NOT NULL,
    closed_at     timestamp    NOT NULL,
    ad_status     ad_status    NOT NULL DEFAULT 'OPENED',
    ad_type       ad_type      NOT NULL DEFAULT 'NEWS',
    is_premium    boolean      NOT NULL DEFAULT false
);


CREATE TABLE IF NOT EXISTS alco_clubs
(
    alco_club_id integer PRIMARY KEY DEFAULT 0,
    alco1        integer             DEFAULT 0,
    alco2        integer             DEFAULT 0,
    alco3        integer             DEFAULT 0,
    price_mod    integer             DEFAULT 100,
    mats         integer             DEFAULT 5000
);

CREATE TABLE IF NOT EXISTS battlepass
(
--     autoId            SERIAL PRIMARY KEY,
    uuid              integer PRIMARY KEY REFERENCES characters (uuid) ON DELETE CASCADE,
    seasonId          smallint NOT NULL DEFAULT 1,
    tasksDay          text     NOT NULL DEFAULT '[]',
    tasksWeek         text     NOT NULL DEFAULT '[]',
    lvl               integer  NOT NULL DEFAULT 0,
    exp               integer  NOT NULL DEFAULT 0,
    isPremium         smallint NOT NULL DEFAULT 0,
    tookReward        text     NOT NULL DEFAULT '[]',
    tookRewardPremium text     NOT NULL DEFAULT '[]',
    time              integer  NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS character_bind_cfg
(
    uuid          integer PRIMARY KEY REFERENCES characters (uuid) ON DELETE CASCADE,
    bindSetting   varchar(800) NOT NULL DEFAULT '{}',
    chatSetting   varchar(150) NOT NULL DEFAULT '{}',
    animFavorites text         NOT NULL DEFAULT '[]',
--     animBind      varchar(86)  NOT NULL DEFAULT '[0,0,0,0,0,0,0,0,0,0]',
    adminOption   varchar(150) NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS character_animation_bind
(
    uuid   integer PRIMARY KEY REFERENCES characters (uuid) ON DELETE CASCADE,
    bind1  varchar(20) NOT NULL DEFAULT '0',
    bind2  varchar(20) NOT NULL DEFAULT '0',
    bind3  varchar(20) NOT NULL DEFAULT '0',
    bind4  varchar(20) NOT NULL DEFAULT '0',
    bind5  varchar(20) NOT NULL DEFAULT '0',
    bind6  varchar(20) NOT NULL DEFAULT '0',
    bind7  varchar(20) NOT NULL DEFAULT '0',
    bind8  varchar(20) NOT NULL DEFAULT '0',
    bind9  varchar(20) NOT NULL DEFAULT '0',
    bind10 varchar(20) NOT NULL DEFAULT '0'
--     animBind varchar(86) NOT NULL DEFAULT '[0,0,0,0,0,0,0,0,0,0]'
);

CREATE TABLE IF NOT EXISTS bonus_codes
(
    code        varchar(50)   DEFAULT 'changeit',
    used_times  bigint        DEFAULT 0,
    usage_limit bigint        DEFAULT 0,
    msg_r       varchar(400)  DEFAULT 'Вы успешно активировали бонус код!',
    exp_r       smallint      DEFAULT 0,
    money_r     integer       DEFAULT 0,
    vip_r       smallint      DEFAULT 0,
    vipdays_r   smallint      DEFAULT 0,
    itemsm_r    varchar(4096) DEFAULT '[]',
    itemsf_r    varchar(4096) DEFAULT '[]'
);


CREATE TYPE business_type AS ENUM (
    'GOVERNMENT',
    'PLAYER',
    'FAMILY',
    'NONE'
    );
CREATE TABLE IF NOT EXISTS businesses
(
    business_id  integer PRIMARY KEY NOT NULL,
    owner        varchar(256)        NOT NULL DEFAULT 'GOVERNMENT',
    name         varchar(256)        NULL     DEFAULT NULL,
    description  varchar(256)                 DEFAULT NULL,
    sell_price   integer             NOT NULL,
    type         integer             NOT NULL,
    products     text                NOT NULL,
    enter_point  varchar(256)        NOT NULL,
    unload_point varchar(256)        NOT NULL,
    money        integer             NOT NULL,
    mafia        integer             NOT NULL,
    orders       text                NOT NULL,
    tax          double precision             DEFAULT 0.013
);


CREATE TABLE IF NOT EXISTS business_history
(
    business_id integer PRIMARY KEY REFERENCES businesses (business_id) ON DELETE CASCADE,
    date        timestamp   NOT NULL DEFAULT current_timestamp,
    uuid        integer REFERENCES characters (uuid) ON DELETE NO ACTION,
    item        varchar(50) NOT NULL DEFAULT '',
    price       integer     NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS compensation
(
    auto_Id SERIAL PRIMARY KEY,
    login   varchar(50)           DEFAULT '0',
    UUID    integer      NOT NULL,
    Title   varchar(86)  NOT NULL DEFAULT '',
    Text    varchar(450) NOT NULL DEFAULT '',
    Money   integer      NOT NULL DEFAULT 0,
    Donate  integer      NOT NULL DEFAULT 0,
    ItemID  integer      NOT NULL DEFAULT 0,
    Data    varchar(26)  NOT NULL DEFAULT '',
    Toggled smallint     NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS customization
(
    uuid       integer PRIMARY KEY REFERENCES characters (uuid) ON DELETE CASCADE,
    gender     character_gender DEFAULT NULL,
    parents    varchar(100)     DEFAULT NULL,
    features   varchar(300)     DEFAULT NULL,
    appearance varchar(1000)    DEFAULT NULL,
    hair       varchar(500)     DEFAULT NULL,
    tattoos    text             DEFAULT NULL,
    eyec       integer          DEFAULT NULL,
    is_created boolean NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS doors_control
(
    id             varchar(16) PRIMARY KEY NOT NULL,
    is_closed      boolean                 NOT NULL DEFAULT FALSE,
    is_hard_locked boolean                 NOT NULL DEFAULT FALSE --  hard lock for admin
);

CREATE TABLE IF NOT EXISTS economy
(
    business_min                real    DEFAULT 0.5,
    business_max                real    DEFAULT 1.5,
    drugs_price                 integer DEFAULT 60,
--     busPrices                   varchar(50) DEFAULT '[3,4,3,4,4,8]',  CREATED TABLE FOR THIS
    colPay                      integer DEFAULT 7,
    electrician_pay             integer DEFAULT 7,
    postman_pay                 integer DEFAULT 3,
    lawn_mover_pay              integer DEFAULT 2,
    gang_car_delivery           integer DEFAULT 500,
    mafia_car_delivery          integer DEFAULT 500,
    police_award                integer DEFAULT 200,
    min_gun_license_price       integer DEFAULT 5000,
    max_gun_license_price       integer DEFAULT 6000,
    min_paramedic_license_price integer DEFAULT 15000,
    max_paramedic_license_price integer DEFAULT 20000,
    min_police_ticket_price     integer DEFAULT 7000,
    min_heal                    integer DEFAULT 50,
    max_heal                    integer DEFAULT 400,
    capture_win                 integer DEFAULT 300,
    business_war_win            integer DEFAULT 300,
    mafia_business_war_win      integer DEFAULT 120,
    gang_point_win              integer DEFAULT 100,
--     license_prices              varchar(70) DEFAULT '[600,1000,3000,6000,10000,10000]',  CREATED TABLE FOR THIS
    hotel_rent                  integer DEFAULT 100,
    sms_cost                    integer DEFAULT 10,
    ad_cost                     integer DEFAULT 6,
    evacuate_car                integer DEFAULT 200,
    ad_edit_cost                real    DEFAULT 0.4,
    min_dice                    integer DEFAULT 1000,
    max_dice                    integer DEFAULT 150000,
    BMdrill                     integer DEFAULT 20000,
    BMlockpick                  integer DEFAULT 200,
    BMalockpick                 integer DEFAULT 1200,
    BMcuffs                     integer DEFAULT 600,
    BMpocket                    integer DEFAULT 600,
    BMwanted                    integer DEFAULT 800,
    busPay                      integer DEFAULT 30,
    BMuncuff                    integer DEFAULT 2000,
    BlackMarketGunLic           integer DEFAULT 12000,
    BlackMarketMedCard          integer DEFAULT 8000,
    BlackRadioInterceptord      integer DEFAULT 8000,
    BlackQrFake                 integer DEFAULT 8000
);

CREATE TABLE IF NOT EXISTS economy_license_prices
(
    license_type varchar(50) PRIMARY KEY NOT NULL,
    price        integer                 NOT NULL
);

-- TODO: RENAME LICENSES
INSERT INTO economy_license_prices (license_type, price)
VALUES ('license1', 600),
       ('license2', 1000),
       ('license3', 3000),
       ('license4', 6000),
       ('license5', 10000),
       ('license6', 10000);

CREATE TABLE IF NOT EXISTS economy_bus_prices
(
    economy_bus_prices_id SERIAL PRIMARY KEY NOT NULL,
    price                 integer            NOT NULL
);

INSERT INTO economy_bus_prices (price)
VALUES (3),
       (4),
       (3),
       (4),
       (4),
       (8);


-- Дамп структуры для таблица main.e_candidates
CREATE TABLE IF NOT EXISTS e_candidates
(
    ID       SERIAL,
    Election integer      NOT NULL,
    Name     varchar(100) NOT NULL,
    Votes    smallint     NOT NULL DEFAULT 0,
    PRIMARY KEY (ID)
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.e_points
CREATE TABLE IF NOT EXISTS e_points
(
    ID        SERIAL,
    Election  integer  NOT NULL DEFAULT 0,
    X         real     NOT NULL DEFAULT 0,
    Y         real     NOT NULL DEFAULT 0,
    Z         real     NOT NULL DEFAULT 0,
    Dimension integer  NOT NULL DEFAULT 0,
    Opened    smallint NOT NULL DEFAULT 0,
    PRIMARY KEY (ID)
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.e_voters
CREATE TABLE IF NOT EXISTS e_voters
(
    ID        SERIAL,
    Election  integer      DEFAULT NULL,
    Login     varchar(50)  DEFAULT NULL,
    TimeVoted timestamp    DEFAULT NULL,
    VotedFor  varchar(100) DEFAULT NULL,
    PRIMARY KEY (ID)
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблица main.familyzones
-- CREATE TABLE IF NOT EXISTS familyzones
-- (
--     id    SERIAL PRIMARY KEY,
--     orgid smallint NOT NULL DEFAULT 0,
--     PRIMARY KEY (id) USING BTREE
-- );

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.fracranks
CREATE TABLE IF NOT EXISTS fracranks
(
    uuid           integer       NOT NULL DEFAULT -1,
    name           varchar(50)   NOT NULL DEFAULT '',
    id             integer       NOT NULL DEFAULT 0,
    rank           integer       NOT NULL DEFAULT 0,
    date           timestamp     NOT NULL DEFAULT current_timestamp,
    avatar         varchar(255)  NOT NULL DEFAULT '',
    departmentId   integer       NOT NULL DEFAULT 0,
    departmentRank integer       NOT NULL DEFAULT 0,
    access         varchar(1500) NOT NULL DEFAULT '[]',
    lock           varchar(1500) NOT NULL DEFAULT '[]',
    score          integer       NOT NULL DEFAULT 0,
    lastLoginDate  timestamp     NOT NULL DEFAULT current_timestamp,
    time           varchar(350)  NOT NULL DEFAULT '{}',
    tasks          varchar(350)  NOT NULL DEFAULT '{}'
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.fractionaccess
CREATE TABLE IF NOT EXISTS fractionaccess
(
    fraction integer                DEFAULT NULL,
    commands varchar(1024) NOT NULL DEFAULT '{}',
    weapons  varchar(1024) NOT NULL DEFAULT '{}'
);


CREATE TABLE IF NOT EXISTS fractionlogs
(
    auto_id  SERIAL,
    fraction smallint     NOT NULL DEFAULT 0,
    name     varchar(100) NOT NULL,
    uuid     integer      NOT NULL DEFAULT -1,
    rank     smallint     NOT NULL DEFAULT 0,
    text     text         NOT NULL,
    type     smallint     NOT NULL DEFAULT 0,
    time     timestamp    NOT NULL DEFAULT current_timestamp,
    PRIMARY KEY (auto_id)
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы server1.fractionranks
CREATE TABLE IF NOT EXISTS fractionranks
(
    fraction integer              DEFAULT NULL,
    rank     integer              DEFAULT NULL,
    payday   integer     NOT NULL DEFAULT 0,
    name     varchar(50) NOT NULL,
    clothesm text        NOT NULL DEFAULT 'null',
    clothesf text        NOT NULL DEFAULT 'null',
    access   text        NOT NULL DEFAULT '-1'
);

-- Дамп данных таблицы server1.fractionranks: ~236 rows (приблизительно)
/*!40000 ALTER TABLE fractionranks DISABLE KEYS */;


CREATE TABLE IF NOT EXISTS fractionrankscrazy
(
    fraction integer              DEFAULT NULL,
    rank     integer              DEFAULT NULL,
    payday   integer     NOT NULL DEFAULT 0,
    name     varchar(50) NOT NULL,
    access   text        NOT NULL DEFAULT '-1'
);


-- Removed legacy duplicate `fractions` definition (column names diverged from
-- the canonical table defined earlier in this file: `isopen` vs `is_open`,
-- `lastserial` vs `last_serial`, `clothingsets` text vs the normalized
-- fraction_clothing_sets table). The earlier definition is the source of truth.

-- Dumping structure for table ra3_main.fractionvehicles
CREATE TABLE IF NOT EXISTS "fractionvehicles"
(
    "id"          SERIAL,
    "fraction"    integer       NOT NULL,
    "number"      text          NOT NULL DEFAULT 'null',
    "model"       text          NOT NULL,
    "position"    varchar(100)  NOT NULL,
    "rotation"    varchar(100)  NOT NULL,
    "rank"        integer       NOT NULL,
    "defaultrank" integer       NOT NULL DEFAULT -1,
    "colorprim"   integer       NOT NULL DEFAULT 0,
    "colorsec"    integer       NOT NULL DEFAULT 0,
    "components"  varchar(2048) NOT NULL DEFAULT '{"PrimColor":{"Red":255,"Green":255,"Blue":255,"Alpha":255},"SecColor":{"Red":255,"Green":255,"Blue":255,"Alpha":255},"PrimModColor":-1,"SecModColor":-1,"Muffler":-1,"SideSkirt":-1,"Hood":-1,"Spoiler":-1,"Lattice":-1,"Wings":-1,"Roof":-1,"Vinyls":-1,"FrontBumper":-1,"RearBumper":-1,"Engine":-1,"Turbo":-1,"Horn":-1,"Transmission":-1,"WindowTint":0,"Suspension":-1,"Brakes":-1,"Headlights":-1,"NumberPlate":0,"Wheels":-1,"WheelsType":0,"WheelsColor":0,"NeonColor":{"Red":0,"Green":0,"Blue":0,"Alpha":0},"Armor":-1}',
    "isDimension" smallint      NOT NULL DEFAULT 0,
    PRIMARY KEY ("id")
);


-- Дамп структуры для таблица main.fractionvehiclesbackup
CREATE TABLE IF NOT EXISTS "fractionvehiclesbackup"
(
    "fraction"    integer       NOT NULL,
    "number"      text          NOT NULL DEFAULT 'null',
    "model"       text          NOT NULL,
    "position"    varchar(100)  NOT NULL,
    "rotation"    varchar(100)  NOT NULL,
    "rank"        integer       NOT NULL,
    "defaultrank" integer       NOT NULL DEFAULT -1,
    "colorprim"   integer       NOT NULL DEFAULT 0,
    "colorsec"    integer       NOT NULL DEFAULT 0,
    "components"  varchar(2048) NOT NULL DEFAULT '{"PrimColor":{"Red":255,"Green":255,"Blue":255,"Alpha":255},"SecColor":{"Red":255,"Green":255,"Blue":255,"Alpha":255},"PrimModColor":-1,"SecModColor":-1,"Muffler":-1,"SideSkirt":-1,"Hood":-1,"Spoiler":-1,"Lattice":-1,"Wings":-1,"Roof":-1,"Vinyls":-1,"FrontBumper":-1,"RearBumper":-1,"Engine":-1,"Turbo":-1,"Horn":-1,"Transmission":-1,"WindowTint":0,"Suspension":-1,"Brakes":-1,"Headlights":-1,"NumberPlate":0,"Wheels":-1,"WheelsType":0,"WheelsColor":0,"NeonColor":{"Red":0,"Green":0,"Blue":0,"Alpha":0},"Armor":-1}',
    "isDimension" smallint      NOT NULL DEFAULT 0
);

-- Экспортируемые данные не выделены.

-- Removed legacy duplicate `fraction_clothing_sets` definition.
-- The earlier definition (with fraction_name FK + character_gender enum)
-- is the source of truth.


-- Дамп структуры для таблицы main.friends
-- CREATE TABLE IF NOT EXISTS "friends"
-- (
--     "first"    varchar(50) NOT NULL,
--     "second"   varchar(50) NOT NULL,
--     "fullname" smallint    NOT NULL DEFAULT 0
-- );

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.furniture
CREATE TABLE IF NOT EXISTS "furniture"
(
    "uuid"      integer NOT NULL,
    "furniture" text         DEFAULT NULL,
    "data"      text         DEFAULT NULL,
    "access"    varchar(400) DEFAULT '[]'
);


-- Дамп структуры для таблицы main.gangspoints
CREATE TABLE IF NOT EXISTS "gangspoints"
(
    "id"     SERIAL,
    "gangid" smallint NOT NULL,
    PRIMARY KEY ("id")
);


-- Дамп структуры для таблицы main.garages
CREATE TABLE IF NOT EXISTS "garages"
(
    "id"       integer       NOT NULL,
    "type"     integer       NOT NULL DEFAULT -1,
    "position" varchar(80)   NOT NULL DEFAULT '',
    "rotation" varchar(80)   NOT NULL DEFAULT '',
    "upgraded" integer       NOT NULL DEFAULT -1,
    "carSlots" varchar(1000) NOT NULL DEFAULT '{}',
    PRIMARY KEY ("id")
);


-- Дамп структуры для таблицы main.houses
CREATE TABLE IF NOT EXISTS "houses"
(
    "id"        varchar(64)   NOT NULL,
    "owner_uuid" integer REFERENCES characters (uuid) ON DELETE SET NULL ON UPDATE CASCADE DEFAULT NULL,
    "type"      integer       NOT NULL DEFAULT 0,
    "position"  varchar(80)   NOT NULL DEFAULT '',
    "price"     integer       NOT NULL DEFAULT 1000000,
    "locked"    smallint      NOT NULL DEFAULT 0,
    "garage"    integer       NOT NULL DEFAULT 0,
    "bank"      integer       NOT NULL DEFAULT 0,
    "healkit"   smallint               DEFAULT 0,
    "roommates" varchar(2024) NOT NULL DEFAULT '{}',
    "alarm"     smallint      NOT NULL DEFAULT 0,
    PRIMARY KEY ("id")
);


-- Экспортируемые данные не выделены.

-- Дамп структуры для функции main. InsertItemData (PostgreSQL)
CREATE OR REPLACE FUNCTION "InsertItemData"(
    in_data_id varchar(32),
    in_item_id smallint,
    in_item_count smallint,
    in_item_data varchar(46),
    in_location varchar(24),
    in_slotId smallint
)
    RETURNS integer
    LANGUAGE plpgsql
AS
$$
DECLARE
    r_id integer;
BEGIN
    INSERT INTO "items_data"("data_id", "item_id", "item_count", "item_data", "location", "slotId")
    VALUES (in_data_id, in_item_id, in_item_count, in_item_data, in_location, in_slotId)
    RETURNING "auto_id" INTO r_id;

    RETURN r_id;
END;
$$;

-- Дамп структуры для таблицы main.items_data
CREATE TABLE IF NOT EXISTS "items_data"
(
    "auto_id"    SERIAL,
    "data_id"    varchar(32) DEFAULT '-1_-1_True',
    "item_id"    smallint    DEFAULT NULL,
    "item_count" integer     DEFAULT NULL,
    "item_data"  varchar(46) DEFAULT NULL,
    "location"   varchar(24) DEFAULT NULL,
    "slotId"     smallint    DEFAULT NULL,
    PRIMARY KEY ("auto_id")
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.livingcity
CREATE TABLE IF NOT EXISTS "livingcity"
(
    "VehicleX" real NOT NULL,
    "VehicleY" real NOT NULL,
    "VehicleZ" real NOT NULL,
    "VehicleR" real NOT NULL
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.lottery
CREATE TABLE IF NOT EXISTS "lottery"
(
    "number" integer NOT NULL
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.lottery_players
CREATE TABLE IF NOT EXISTS "lottery_players"
(
    "number" integer NOT NULL,
    "ticket" integer NOT NULL,
    "player" integer NOT NULL
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.mine_stocks
CREATE TABLE IF NOT EXISTS "mine_stocks"
(
    "id"      SERIAL,
    "coal"    integer NOT NULL DEFAULT 0,
    "iron"    integer NOT NULL DEFAULT 0,
    "gold"    integer NOT NULL DEFAULT 0,
    "sulfur"  integer NOT NULL DEFAULT 0,
    "emerald" integer NOT NULL DEFAULT 0,
    "ruby"    integer NOT NULL DEFAULT 0,
    PRIMARY KEY ("id")
);

INSERT INTO "mine_stocks" ("id", "coal", "iron", "gold", "sulfur", "emerald", "ruby")
VALUES (1, 0, 0, 0, 0, 0, 0),
       (2, 0, 0, 0, 0, 0, 0);
/*!40000 ALTER TABLE "mine_stocks" ENABLE KEYS */;

-- Дамп структуры для таблицы main.money
CREATE TABLE IF NOT EXISTS "money"
(
    "id"      SERIAL,
    "type"    smallint     NOT NULL,
    "holder"  varchar(256) NOT NULL,
    "balance" integer      NOT NULL,
    PRIMARY KEY ("id")
);


-- Дамп структуры для таблицы main.notes
CREATE TABLE IF NOT EXISTS "notes"
(
    "Item_Id" integer     NOT NULL,
    "Name"    varchar(46) NOT NULL DEFAULT '',
    "Text"    text        NOT NULL DEFAULT '',
    "Type"    smallint    NOT NULL DEFAULT 0
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.orders
CREATE TABLE IF NOT EXISTS "orders"
(
    "id"       SERIAL,
    "bizid"    integer      NOT NULL,
    "prodname" varchar(256) NOT NULL,
    "amount"   integer      NOT NULL,
    PRIMARY KEY ("id")
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.organizations
CREATE TABLE IF NOT EXISTS "organizations"
(
    "Organization"              SERIAL,
    "OwnerUUID"                 integer NOT NULL DEFAULT -1,
    "Name"                      varchar(30)      DEFAULT NULL,
    "OfficeUP"                  smallint         DEFAULT 0,
    "Customs"                   smallint         DEFAULT 0,
    "Stock"                     smallint         DEFAULT 0,
    "CrimeOptions"              smallint         DEFAULT 0,
    "PistolScheme"              smallint         DEFAULT 0,
    "PistolMk2Scheme"           smallint         DEFAULT 0,
    "Pistol50Scheme"            smallint         DEFAULT 0,
    "HeavyPistolScheme"         smallint         DEFAULT 0,
    "PumpShotgunScheme"         smallint         DEFAULT 0,
    "DoubleBarrelShotgunScheme" smallint         DEFAULT 0,
    "SawnOffShotgunScheme"      smallint         DEFAULT 0,
    "MiniSMGScheme"             smallint         DEFAULT 0,
    "SMGMk2Scheme"              smallint         DEFAULT 0,
    "MachinePistolScheme"       smallint         DEFAULT 0,
    "MicroSMGScheme"            smallint         DEFAULT 0,
    "CombatPDWScheme"           smallint         DEFAULT 0,
    "CompactRifleScheme"        smallint         DEFAULT 0,
    "AssaultRifleScheme"        smallint         DEFAULT 0,
    "ArmorScheme"               smallint         DEFAULT 0,
    "Drugs"                     integer          DEFAULT 0,
    "Mats"                      integer          DEFAULT 0,
    "MedKits"                   integer          DEFAULT 0,
    "Money"                     integer          DEFAULT 0,
    "Weapons"                   text             DEFAULT '[]',
    "IsOpen"                    smallint         DEFAULT 0,
    "Status"                    smallint         DEFAULT 1,
    "BlipID"                    integer          DEFAULT -1,
    "BlipColor"                 smallint         DEFAULT 0,
    "BlipXYZ"                   varchar(150)     DEFAULT '{"x":0,"y":0,"z":0}',
    "Ranks"                     text             DEFAULT '-1',
    "departments"               text             DEFAULT '{}',
    "discord"                   varchar(24)      DEFAULT '',
    "salary"                    smallint         DEFAULT 0,
    "color"                     varchar(56)      DEFAULT '{}',
    "date"                      timestamp        DEFAULT current_timestamp,
    "slogan"                    varchar(85)      DEFAULT '',
    "attackingCount"            varchar(150)     DEFAULT '{}',
    "protectingCount"           varchar(150)     DEFAULT '{}',
    PRIMARY KEY ("Organization")
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.orglogs
CREATE TABLE IF NOT EXISTS "orglogs"
(
    "auto_id"      SERIAL,
    "organization" smallint     NOT NULL DEFAULT 0,
    "name"         varchar(100) NOT NULL,
    "uuid"         integer      NOT NULL DEFAULT -1,
    "rank"         smallint     NOT NULL DEFAULT 0,
    "text"         text         NOT NULL,
    "type"         smallint     NOT NULL DEFAULT 0,
    "time"         timestamp    NOT NULL DEFAULT current_timestamp,
    PRIMARY KEY ("auto_id")
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.orgranks
CREATE TABLE IF NOT EXISTS "orgranks"
(
    "uuid"           integer     NOT NULL DEFAULT -1,
    "name"           varchar(50) NOT NULL DEFAULT '',
    "id"             integer              DEFAULT 0,
    "rank"           integer              DEFAULT 0,
    "date"           timestamp            DEFAULT current_timestamp,
    "avatar"         varchar(255)         DEFAULT '',
    "departmentId"   integer              DEFAULT 0,
    "departmentRank" integer              DEFAULT 0,
    "access"         varchar(1500)        DEFAULT '[]',
    "lock"           varchar(1500)        DEFAULT '[]',
    "score"          integer              DEFAULT 0,
    "lastLoginDate"  timestamp            DEFAULT current_timestamp,
    "time"           varchar(350)         DEFAULT '{}',
    "tasks"          varchar(350)         DEFAULT '{}'
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.orgvehicles
CREATE TABLE IF NOT EXISTS "orgvehicles"
(
    "organization" integer       NOT NULL,
    "number"       varchar(25)   NOT NULL,
    "model"        varchar(50)   NOT NULL,
    "position"     smallint      NOT NULL DEFAULT 0,
    "rank"         integer       NOT NULL DEFAULT 0,
    "components"   varchar(2048) NOT NULL DEFAULT '{"PrimColor":{"Red":255,"Green":255,"Blue":255,"Alpha":255},"SecColor":{"Red":255,"Green":255,"Blue":255,"Alpha":255},"PrimModColor":-1,"SecModColor":-1,"Muffler":-1,"SideSkirt":-1,"Hood":-1,"Spoiler":-1,"Lattice":-1,"Wings":-1,"Roof":-1,"Vinyls":-1,"FrontBumper":-1,"RearBumper":-1,"Engine":-1,"Turbo":-1,"Horn":-1,"Transmission":-1,"WindowTint":0,"Suspension":-1,"Brakes":-1,"Headlights":-1,"NumberPlate":0,"Wheels":-1,"WheelsType":0,"WheelsColor":0,"NeonColor":{"Red":0,"Green":0,"Blue":0,"Alpha":0},"Armor":-1}',
    "dirt"         real                   DEFAULT 0,
    "petrol"       integer       NOT NULL DEFAULT 100
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.othervehicles
CREATE TABLE IF NOT EXISTS "othervehicles"
(
    "type"     integer      DEFAULT NULL,
    "number"   varchar(50)  DEFAULT NULL,
    "model"    varchar(50)  DEFAULT NULL,
    "position" varchar(100) DEFAULT NULL,
    "rotation" varchar(100) DEFAULT NULL,
    "color1"   integer      DEFAULT NULL,
    "color2"   integer      DEFAULT NULL,
    "price"    integer      DEFAULT NULL
);


/*!40000 ALTER TABLE "othervehicles" ENABLE KEYS */;

-- Дамп структуры для таблицы main.pet
CREATE TABLE IF NOT EXISTS "pet"
(
    "AutoId"    SERIAL,
    "Name"      varchar(50) NOT NULL DEFAULT '',
    "OwnerUUID" integer     NOT NULL,
    "Model"     bigint      NOT NULL DEFAULT 0,
    "Health"    integer     NOT NULL DEFAULT 100,
    "Death"     timestamp   NOT NULL,
    "InGame"    smallint    NOT NULL DEFAULT 0,
    "Position"  varchar(50) NOT NULL DEFAULT '{}',
    "Heading"   real        NOT NULL DEFAULT 0,
    "Rotation"  varchar(50) NOT NULL DEFAULT '{}',
    "Dimension" integer     NOT NULL DEFAULT 0,
    PRIMARY KEY ("AutoId")
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.phoneinfo
CREATE TABLE IF NOT EXISTS "phoneinfo"
(
    "uuid"      integer      NOT NULL,
    "contacts"  text         NOT NULL DEFAULT '{}',
    "blackList" text         NOT NULL DEFAULT '[]',
    "settings"  varchar(500) NOT NULL DEFAULT '{}',
    "gallery"   text         NOT NULL DEFAULT '[]',
    "recents"   text         NOT NULL DEFAULT '[]',
    PRIMARY KEY ("uuid")
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.phonemessage
CREATE TABLE IF NOT EXISTS "phonemessage"
(
    "autoId"     SERIAL,
    "fromUuid"   integer   NOT NULL DEFAULT 0,
    "fromPhone"  integer   NOT NULL DEFAULT 0,
    "toUuid"     integer   NOT NULL DEFAULT 0,
    "toPhone"    integer   NOT NULL DEFAULT 0,
    "date"       timestamp NOT NULL DEFAULT current_timestamp,
    "type"       smallint  NOT NULL DEFAULT 0,
    "text"       text      NOT NULL,
    "fromStatus" smallint  NOT NULL DEFAULT 0,
    "toStatus"   smallint  NOT NULL DEFAULT 0,
    PRIMARY KEY ("autoId")
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.phonetinder
CREATE TABLE IF NOT EXISTS "phonetinder"
(
    "uuid"      integer      DEFAULT NULL,
    "avatar"    varchar(250) DEFAULT NULL,
    "text"      varchar(200) DEFAULT NULL,
    "type"      smallint     DEFAULT NULL,
    "isVisible" smallint     DEFAULT NULL,
    "likes"     text         DEFAULT NULL,
    "noLikes"   text         DEFAULT NULL
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.promocodes_new
CREATE TABLE IF NOT EXISTS "promocodes_new"
(
    "promo"          varchar(50) NOT NULL DEFAULT 'changeit',
    "createdby"      integer              DEFAULT 0,
    "used"           bigint               DEFAULT 0,
    "rewardreceived" bigint               DEFAULT 0,
    "rewardlimit"    bigint               DEFAULT 0,
    "msg_r"          varchar(400)         DEFAULT 'Вы достигли первого уровня и успешно активировали бонус за промокод, приятной игры!',
    "money_r"        integer              DEFAULT 3000,
    "vip_r"          smallint             DEFAULT 0,
    "vipdays_r"      smallint             DEFAULT 0,
    "items_r"        varchar(4096)        DEFAULT '[{"Data":"null","ID":10,"Type":10,"Count":3,"IsActive":false},{"Data":"null","ID":3,"Type":3,"Count":3,"IsActive":false}]',
    "don_r"          double precision     DEFAULT 0,
    "donlogin_r"     varchar(50)          DEFAULT NULL,
    "donated"        bigint               DEFAULT 0,
    "donreceived"    bigint               DEFAULT 0,
    PRIMARY KEY ("promo")
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.promo_timing
CREATE TABLE IF NOT EXISTS "promo_timing"
(
    "id"    integer      NOT NULL,
    "promo" varchar(100) NOT NULL,
    "used"  integer      NOT NULL,
    "date"  date         NOT NULL,
    "added" integer      NOT NULL
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.questions
CREATE TABLE IF NOT EXISTS "questions"
(
    "ID"         SERIAL,
    "Author"     varchar(50)  NOT NULL,
    "Question"   varchar(150) NOT NULL,
    "Respondent" varchar(50) DEFAULT NULL,
    "Response"   text        DEFAULT NULL,
    "Opened"     timestamp    NOT NULL,
    "Closed"     timestamp   DEFAULT NULL,
    "Status"     smallint    DEFAULT 0,
    PRIMARY KEY ("ID")
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.questschar
CREATE TABLE IF NOT EXISTS "questschar"
(
    "q_auto_id"    SERIAL,
    "q_actor_name" varchar(42) NOT NULL,
    "q_line"       smallint    NOT NULL,
    "q_status"     smallint    NOT NULL DEFAULT 0,
    "q_time"       timestamp   NOT NULL DEFAULT current_timestamp,
    "char_id"      integer     NOT NULL,
    "q_complete"   smallint    NOT NULL DEFAULT 0,
    "q_stage"      smallint    NOT NULL DEFAULT 0,
    "q_data"       varchar(50) NOT NULL DEFAULT '[0,0,0]',
    "q_use"        smallint    NOT NULL DEFAULT 0,
    PRIMARY KEY ("q_auto_id")
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.refferals
CREATE TABLE IF NOT EXISTS "refferals"
(
    "uuid"        integer     DEFAULT NULL,
    "name"        varchar(64) DEFAULT NULL,
    "uuidref"     integer     DEFAULT NULL,
    "success"     smallint    DEFAULT 0,
    "cost"        smallint    DEFAULT 0,
    "createdate"  timestamp   DEFAULT NULL,
    "successdate" timestamp   DEFAULT NULL,
    "refcode"     varchar(64) DEFAULT NULL
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.safes
CREATE TABLE IF NOT EXISTS "safes"
(
    "id"        SERIAL,
    "minamount" integer      NOT NULL,
    "maxamount" integer      NOT NULL,
    "pos"       varchar(256) NOT NULL,
    "rotation"  real         NOT NULL DEFAULT 0,
    "address"   varchar(256) NOT NULL,
    PRIMARY KEY ("id")
);

-- Дамп данных таблицы server1.safes: ~17 rows (приблизительно)

-- Дамп структуры для функции main. SelectItemsData (PostgreSQL)
CREATE OR REPLACE FUNCTION "SelectItemsData"(
    in_data_id varchar(32)
)
    RETURNS SETOF "items_data"
    LANGUAGE plpgsql
AS
$$
BEGIN
    RETURN QUERY
        SELECT * FROM "items_data" WHERE "data_id" = in_data_id ORDER BY "slotId";
END;
$$;

-- Дамп структуры для таблицы main.sessions
CREATE TABLE IF NOT EXISTS "sessions"
(
    "hash"    varchar(75) NOT NULL,
    "login"   varchar(50) NOT NULL,
    "data"    timestamp   NOT NULL,
    "oneTime" smallint    NOT NULL DEFAULT 0,
    PRIMARY KEY ("hash")
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.ticketlog
CREATE TABLE IF NOT EXISTS "ticketlog"
(
    "time"   timestamp    DEFAULT NULL,
    "player" integer      DEFAULT NULL,
    "target" integer      DEFAULT NULL,
    "sum"    integer      DEFAULT NULL,
    "reason" varchar(100) DEFAULT NULL
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для функции main. UpdateItemData (PostgreSQL)
CREATE OR REPLACE FUNCTION "UpdateItemData"(
    in_data_id varchar(32),
    in_item_count smallint,
    in_item_data varchar(46),
    in_location varchar(24),
    in_slotId smallint,
    in_auto_id integer
)
    RETURNS boolean
    LANGUAGE plpgsql
AS
$$
BEGIN
    UPDATE "items_data"
    SET "data_id"    = in_data_id,
        "item_count" = in_item_count,
        "item_data"  = in_item_data,
        "location"   = in_location,
        "slotId"     = in_slotId
    WHERE "auto_id" = in_auto_id;

    RETURN FOUND;
END;
$$;

-- Дамп структуры для таблицы main.vehicles
CREATE TABLE IF NOT EXISTS "vehicles"
(
    "auto_id"    SERIAL,
    "number"     varchar(8)    NOT NULL,
    "holder_uuid" integer REFERENCES characters (uuid) ON DELETE SET NULL ON UPDATE CASCADE DEFAULT NULL,
    "model"      varchar(64)   NOT NULL,
    "health"     integer       NOT NULL,
    "fuel"       integer       NOT NULL DEFAULT 0,
    "components" varchar(2048) NOT NULL DEFAULT '{}',
    "position"   varchar(80)            DEFAULT NULL,
    "rotation"   varchar(80)            DEFAULT NULL,
    "keynum"     integer       NOT NULL DEFAULT 0,
    "dirt"       real          NOT NULL DEFAULT 0,
    "tag"        varchar(11)   NOT NULL DEFAULT 'null',
    PRIMARY KEY ("auto_id")
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.vehicleticket
CREATE TABLE IF NOT EXISTS "vehicleticket"
(
    "autoId"       SERIAL,
    "vehAutoId"    integer      NOT NULL DEFAULT 0,
    "vehNumber"    varchar(15)  NOT NULL,
    "model"        varchar(30)  NOT NULL,
    "holderAutoId" integer      NOT NULL DEFAULT 0,
    "holderName"   varchar(65)  NOT NULL,
    "policAutoId"  integer      NOT NULL DEFAULT 0,
    "policName"    varchar(65)  NOT NULL DEFAULT '',
    "text"         varchar(50)  NOT NULL,
    "link"         varchar(150) NOT NULL,
    "time"         timestamp    NOT NULL,
    "price"        integer      NOT NULL DEFAULT 0,
    "isEvac"       smallint     NOT NULL DEFAULT 0,
    "toggled"      smallint     NOT NULL DEFAULT 0,
    "type"         smallint     NOT NULL DEFAULT 0,
    PRIMARY KEY ("autoId")
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.wars
CREATE TABLE IF NOT EXISTS "wars"
(
    "id"              smallint    DEFAULT NULL,
    "objectId"        smallint    DEFAULT NULL,
    "type"            smallint    DEFAULT NULL,
    "attackingId"     smallint    DEFAULT NULL,
    "protectingId"    smallint    DEFAULT NULL,
    "mapName"         varchar(65) DEFAULT NULL,
    "mapId"           smallint    DEFAULT NULL,
    "position"        varchar(75) DEFAULT '{}',
    "range"           real        DEFAULT NULL,
    "gripType"        smallint    DEFAULT NULL,
    "composition"     smallint    DEFAULT NULL,
    "weaponsCategory" smallint    DEFAULT NULL,
    "time"            timestamp   DEFAULT NULL
);

-- Экспортируемые данные не выделены.

-- Дамп структуры для таблицы main.weapons
CREATE TABLE IF NOT EXISTS "weapons"
(
    "id"         integer NOT NULL,
    "name"       varchar(256)  DEFAULT NULL,
    "weapons"    varchar(8192) DEFAULT NULL,
    "lastserial" integer NOT NULL,
    PRIMARY KEY ("id")
);

-- Экспортируемые данные не выделены.

-- ============================================
-- Optimization: indexes and constraints
-- ============================================

-- Accounts
CREATE INDEX IF NOT EXISTS idx_accounts_login ON accounts (login);
CREATE INDEX IF NOT EXISTS idx_accounts_email ON accounts (email);
CREATE INDEX IF NOT EXISTS idx_accounts_social_club ON accounts (social_club);

-- Characters
CREATE INDEX IF NOT EXISTS idx_characters_sim_card ON characters (sim_card);
-- CREATE INDEX IF NOT EXISTS idx_characters_wedding_uuid ON characters (wedding_uuid);
CREATE INDEX IF NOT EXISTS idx_characters_fraction ON characters (fraction);
CREATE INDEX IF NOT EXISTS idx_characters_biz ON characters (biz);
-- CREATE INDEX IF NOT EXISTS idx_characters_refcode ON characters (referral_code);
CREATE INDEX IF NOT EXISTS idx_characters_is_deleted ON characters (is_deleted);

-- Character relations
CREATE INDEX IF NOT EXISTS idx_characters_fractions_fraction ON characters_fractions (fraction);

-- Fractions
CREATE INDEX IF NOT EXISTS idx_fractions_name_enum ON fractions (name_enum);
CREATE INDEX IF NOT EXISTS idx_fraction_clothing_sets_fraction ON fraction_clothing_sets (fraction_name);
CREATE INDEX IF NOT EXISTS idx_fraction_clothing_sets_rank ON fraction_clothing_sets (rank);

-- Friends
-- CREATE INDEX IF NOT EXISTS idx_friends_first ON friends (first);
-- CREATE INDEX IF NOT EXISTS idx_friends_second ON friends (second);
-- CREATE UNIQUE INDEX IF NOT EXISTS uq_friends_pair ON friends (first, second);

-- Furniture
CREATE INDEX IF NOT EXISTS idx_furniture_uuid ON furniture (uuid);

-- Bans
CREATE INDEX IF NOT EXISTS idx_banned_account ON banned (account);
CREATE INDEX IF NOT EXISTS idx_banned_ip ON banned (ip);
CREATE INDEX IF NOT EXISTS idx_banned_social_club ON banned (social_club);

-- Admins
-- CREATE UNIQUE INDEX IF NOT EXISTS uq_admin_access_command ON admin_access (command);

-- Advertises
CREATE INDEX IF NOT EXISTS idx_advertises_author_uuid ON advertises (author_uuid);
CREATE INDEX IF NOT EXISTS idx_advertises_author_sim ON advertises (author_sim);
CREATE INDEX IF NOT EXISTS idx_advertises_status_time ON advertises (ad_status, opened_at);

-- Businesses
CREATE INDEX IF NOT EXISTS idx_business_history_uuid ON business_history (uuid);
CREATE INDEX IF NOT EXISTS idx_business_history_date ON business_history (date);
CREATE INDEX IF NOT EXISTS idx_orders_bizid ON orders (bizid);

-- Items
CREATE INDEX IF NOT EXISTS idx_items_data_data_id ON items_data (data_id);
CREATE INDEX IF NOT EXISTS idx_items_data_location_slot ON items_data (location, "slotId");
CREATE INDEX IF NOT EXISTS idx_items_data_data_id_slot ON items_data (data_id, "slotId");

-- Vehicles
CREATE INDEX IF NOT EXISTS idx_vehicles_number ON vehicles (number);
CREATE INDEX IF NOT EXISTS idx_vehicles_holder ON vehicles (holder_uuid);
CREATE INDEX IF NOT EXISTS idx_vehicleticket_vehicle ON vehicleticket ("vehAutoId");
CREATE INDEX IF NOT EXISTS idx_vehicleticket_holder ON vehicleticket ("holderAutoId");

-- Phone
CREATE INDEX IF NOT EXISTS idx_phonemessage_from_uuid_time ON phonemessage ("fromUuid", date);
CREATE INDEX IF NOT EXISTS idx_phonemessage_to_uuid_time ON phonemessage ("toUuid", date);

-- Factions and orgs
CREATE INDEX IF NOT EXISTS idx_fractionlogs_fraction_time ON fractionlogs (fraction, time);
CREATE INDEX IF NOT EXISTS idx_orglogs_org_time ON orglogs (organization, time);

-- Sessions
CREATE INDEX IF NOT EXISTS idx_sessions_login ON sessions (login);
CREATE INDEX IF NOT EXISTS idx_sessions_data ON sessions (data);

-- Questions
CREATE INDEX IF NOT EXISTS idx_questions_status_opened ON questions ("Status", "Opened");

-- Tickets
CREATE INDEX IF NOT EXISTS idx_ticketlog_player_time ON ticketlog (player, time);
CREATE INDEX IF NOT EXISTS idx_ticketlog_target_time ON ticketlog (target, time);

-- Promo timing
CREATE INDEX IF NOT EXISTS idx_promo_timing_promo_date ON promo_timing (promo, date);

-- ============================================
-- Gradual normalization: new tables (stage 1)
-- ============================================

-- Accounts: character slots (replaces accounts.characters and character1-3)
CREATE TABLE IF NOT EXISTS account_characters
(
    account_login       varchar(50)  NOT NULL,
    account_email       varchar(100) NOT NULL,
    account_social_club varchar(50)  NOT NULL,
    slot_index          smallint     NOT NULL,
    character_uuid      integer      NOT NULL,
    PRIMARY KEY (account_login, account_email, account_social_club, slot_index),
    FOREIGN KEY (account_login, account_email, account_social_club)
        REFERENCES accounts (login, email, social_club) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_account_characters_uuid ON account_characters (character_uuid);

-- Characters: contacts
CREATE TABLE IF NOT EXISTS character_contacts
(
    uuid          integer      NOT NULL,
    contact_uuid  integer               DEFAULT NULL,
    contact_phone integer               DEFAULT NULL,
    contact_name  varchar(100) NOT NULL DEFAULT '',
    is_favorite   smallint     NOT NULL DEFAULT 0,
    created_at    timestamp    NOT NULL DEFAULT current_timestamp,
    PRIMARY KEY (uuid, contact_name, contact_phone),
    FOREIGN KEY (uuid) REFERENCES characters (uuid) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_character_contacts_uuid ON character_contacts (uuid);
CREATE INDEX IF NOT EXISTS idx_character_contacts_contact_uuid ON character_contacts (contact_uuid);

-- Characters: achievements
CREATE TABLE IF NOT EXISTS character_achievements
(
    uuid           integer NOT NULL,
    achievement_id integer NOT NULL,
    progress       integer NOT NULL DEFAULT 0,
    completed_at   timestamp        DEFAULT NULL,
    PRIMARY KEY (uuid, achievement_id),
    FOREIGN KEY (uuid) REFERENCES characters (uuid) ON DELETE CASCADE
);

-- Characters: time stats (structured replacement for characters.time)
CREATE TABLE IF NOT EXISTS character_time_stats
(
    uuid       integer PRIMARY KEY,
    total_time integer NOT NULL DEFAULT 0,
    day        integer NOT NULL DEFAULT 0,
    today_time integer NOT NULL DEFAULT 0,
    month      integer NOT NULL DEFAULT 0,
    month_time integer NOT NULL DEFAULT 0,
    year       integer NOT NULL DEFAULT 0,
    year_time  integer NOT NULL DEFAULT 0,
    week       integer NOT NULL DEFAULT 0,
    week_time  integer NOT NULL DEFAULT 0,
    FOREIGN KEY (uuid) REFERENCES characters (uuid) ON DELETE CASCADE
);

-- Fractions: departments and tasks (structured replacements for fractions.departments/tasksData)
CREATE TABLE IF NOT EXISTS fraction_departments
(
    fraction_id   integer      NOT NULL,
    department_id integer      NOT NULL,
    name          varchar(100) NOT NULL DEFAULT '',
    PRIMARY KEY (fraction_id, department_id)
);
CREATE INDEX IF NOT EXISTS idx_fraction_departments_fraction ON fraction_departments (fraction_id);

CREATE TABLE IF NOT EXISTS fraction_tasks
(
    fraction_id integer   NOT NULL,
    task_id     integer   NOT NULL,
    progress    integer   NOT NULL DEFAULT 0,
    updated_at  timestamp NOT NULL DEFAULT current_timestamp,
    PRIMARY KEY (fraction_id, task_id)
);
CREATE INDEX IF NOT EXISTS idx_fraction_tasks_fraction ON fraction_tasks (fraction_id);

-- Phone: message threads (optional stage 1 aggregation support)
CREATE TABLE IF NOT EXISTS phone_threads
(
    thread_id       SERIAL PRIMARY KEY,
    participant_a   integer   NOT NULL,
    participant_b   integer   NOT NULL,
    last_message_at timestamp NOT NULL DEFAULT current_timestamp
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_phone_threads_pair ON phone_threads (participant_a, participant_b);


-- ============================================
-- Foreign-key constraints (previously undeclared).
--
-- This block backfills FKs on columns whose values logically reference another
-- table but had no constraint enforcing it. Orphans must be deleted first or
-- the constraint creation will fail.
--
-- Re-applying this script after main_drop.sql is the supported reset path;
-- the DELETE statements are no-ops on an empty schema and harmless on a live
-- one (they only remove rows that are already orphans).
-- ============================================

-- characters → characters (pet ownership)
DELETE FROM "pet" WHERE "OwnerUUID" NOT IN (SELECT uuid FROM characters);
ALTER TABLE "pet"
    ADD CONSTRAINT fk_pet_owner
    FOREIGN KEY ("OwnerUUID") REFERENCES characters (uuid) ON DELETE CASCADE ON UPDATE CASCADE;

-- phone subsystem
DELETE FROM "phonemessage" WHERE "fromUuid" NOT IN (SELECT uuid FROM characters);
DELETE FROM "phonemessage" WHERE "toUuid"   NOT IN (SELECT uuid FROM characters);
ALTER TABLE "phonemessage"
    ADD CONSTRAINT fk_phonemessage_from
    FOREIGN KEY ("fromUuid") REFERENCES characters (uuid) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT fk_phonemessage_to
    FOREIGN KEY ("toUuid")   REFERENCES characters (uuid) ON DELETE CASCADE ON UPDATE CASCADE;

DELETE FROM "phoneinfo" WHERE "uuid" NOT IN (SELECT uuid FROM characters);
ALTER TABLE "phoneinfo"
    ADD CONSTRAINT fk_phoneinfo_character
    FOREIGN KEY ("uuid") REFERENCES characters (uuid) ON DELETE CASCADE ON UPDATE CASCADE;

DELETE FROM phone_threads WHERE participant_a NOT IN (SELECT uuid FROM characters);
DELETE FROM phone_threads WHERE participant_b NOT IN (SELECT uuid FROM characters);
ALTER TABLE phone_threads
    ADD CONSTRAINT fk_phone_threads_a
    FOREIGN KEY (participant_a) REFERENCES characters (uuid) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT fk_phone_threads_b
    FOREIGN KEY (participant_b) REFERENCES characters (uuid) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT ck_phone_threads_pair_ordered
    CHECK (participant_a < participant_b);

-- character-owned auxiliary tables
DELETE FROM "furniture"   WHERE "uuid"     NOT IN (SELECT uuid FROM characters);
ALTER TABLE "furniture"
    ADD CONSTRAINT fk_furniture_character
    FOREIGN KEY ("uuid") REFERENCES characters (uuid) ON DELETE CASCADE ON UPDATE CASCADE;

DELETE FROM "questschar"  WHERE "char_id"  NOT IN (SELECT uuid FROM characters);
ALTER TABLE "questschar"
    ADD CONSTRAINT fk_questschar_character
    FOREIGN KEY ("char_id") REFERENCES characters (uuid) ON DELETE CASCADE ON UPDATE CASCADE;

-- compensation.UUID was declared unquoted, so Postgres stores it lowercase.
DELETE FROM "compensation" WHERE uuid NOT IN (SELECT uuid FROM characters);
ALTER TABLE "compensation"
    ADD CONSTRAINT fk_compensation_character
    FOREIGN KEY (uuid) REFERENCES characters (uuid) ON DELETE CASCADE ON UPDATE CASCADE;

-- ticketlog / referrals: SET NULL because rows are historical audit data
DELETE FROM "ticketlog" WHERE "player" IS NOT NULL AND "player" NOT IN (SELECT uuid FROM characters);
DELETE FROM "ticketlog" WHERE "target" IS NOT NULL AND "target" NOT IN (SELECT uuid FROM characters);
ALTER TABLE "ticketlog"
    ADD CONSTRAINT fk_ticketlog_player
    FOREIGN KEY ("player") REFERENCES characters (uuid) ON DELETE SET NULL ON UPDATE CASCADE,
    ADD CONSTRAINT fk_ticketlog_target
    FOREIGN KEY ("target") REFERENCES characters (uuid) ON DELETE SET NULL ON UPDATE CASCADE;

DELETE FROM "refferals" WHERE "uuid"    IS NOT NULL AND "uuid"    NOT IN (SELECT uuid FROM characters);
DELETE FROM "refferals" WHERE "uuidref" IS NOT NULL AND "uuidref" NOT IN (SELECT uuid FROM characters);
ALTER TABLE "refferals"
    ADD CONSTRAINT fk_refferals_uuid
    FOREIGN KEY ("uuid")    REFERENCES characters (uuid) ON DELETE SET NULL ON UPDATE CASCADE,
    ADD CONSTRAINT fk_refferals_uuidref
    FOREIGN KEY ("uuidref") REFERENCES characters (uuid) ON DELETE SET NULL ON UPDATE CASCADE;

-- vehicle ticket (cross-table references)
DELETE FROM "vehicleticket" WHERE "vehAutoId"    > 0 AND "vehAutoId"    NOT IN (SELECT auto_id FROM vehicles);
DELETE FROM "vehicleticket" WHERE "holderAutoId" > 0 AND "holderAutoId" NOT IN (SELECT uuid FROM characters);
DELETE FROM "vehicleticket" WHERE "policAutoId"  > 0 AND "policAutoId"  NOT IN (SELECT uuid FROM characters);
ALTER TABLE "vehicleticket"
    ADD CONSTRAINT fk_vehicleticket_vehicle
    FOREIGN KEY ("vehAutoId")    REFERENCES vehicles  (auto_id) ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT fk_vehicleticket_holder
    FOREIGN KEY ("holderAutoId") REFERENCES characters (uuid)   ON DELETE SET NULL ON UPDATE CASCADE,
    ADD CONSTRAINT fk_vehicleticket_police
    FOREIGN KEY ("policAutoId")  REFERENCES characters (uuid)   ON DELETE SET NULL ON UPDATE CASCADE;

-- lottery
DELETE FROM "lottery_players" WHERE "player" NOT IN (SELECT uuid FROM characters);
ALTER TABLE "lottery_players"
    ADD CONSTRAINT fk_lottery_players_player
    FOREIGN KEY ("player") REFERENCES characters (uuid) ON DELETE CASCADE ON UPDATE CASCADE;

-- business orders → businesses
DELETE FROM "orders" WHERE "bizid" NOT IN (SELECT business_id FROM businesses);
ALTER TABLE "orders"
    ADD CONSTRAINT fk_orders_business
    FOREIGN KEY ("bizid") REFERENCES businesses (business_id) ON DELETE CASCADE ON UPDATE CASCADE;

-- log tables — keep rows on character delete (audit trail), so SET NULL not CASCADE.
-- Order matters: drop NOT NULL/DEFAULT first, THEN nullify orphans, THEN add FK.
ALTER TABLE "fractionlogs" ALTER COLUMN uuid DROP NOT NULL;
ALTER TABLE "fractionlogs" ALTER COLUMN uuid DROP DEFAULT;
UPDATE "fractionlogs" SET uuid = NULL WHERE uuid NOT IN (SELECT uuid FROM characters);
ALTER TABLE "fractionlogs"
    ADD CONSTRAINT fk_fractionlogs_character
    FOREIGN KEY (uuid) REFERENCES characters (uuid) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "orglogs" ALTER COLUMN uuid DROP NOT NULL;
ALTER TABLE "orglogs" ALTER COLUMN uuid DROP DEFAULT;
UPDATE "orglogs" SET uuid = NULL WHERE uuid NOT IN (SELECT uuid FROM characters);
ALTER TABLE "orglogs"
    ADD CONSTRAINT fk_orglogs_character
    FOREIGN KEY (uuid) REFERENCES characters (uuid) ON DELETE SET NULL ON UPDATE CASCADE;

-- character_time_stats / character_achievements were declared with FK already; nothing to add.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
