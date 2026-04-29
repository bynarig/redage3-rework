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
    subscribed_end_time        timestamp    NOT NULL DEFAULT now(),
    subscribe_time             timestamp    NOT NULL DEFAULT now(),
    collection_gifts           varchar(500) NOT NULL DEFAULT '[]',
    received_award             varchar(75)  NOT NULL DEFAULT '[0,0,0,0,0,0,0,0,1]',
    received_award_week        integer      NOT NULL DEFAULT 0,
    received_award_donate      integer      NOT NULL DEFAULT 0,
    "Unique"                   varchar(16)  NOT NULL DEFAULT '',
    last_select_character_uuid integer      NOT NULL DEFAULT 0,
    exit_date                  timestamp    NOT NULL DEFAULT now(),
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
    money             integer                                                  DEFAULT 0,
    bank              integer                                                  DEFAULT NULL,
    work              integer                                                  DEFAULT NULL,
    fraction          integer                                                  DEFAULT NULL,
    fraction_lvl      integer                                                  DEFAULT NULL,
    drug_addicted     boolean                                                  DEFAULT FALSE,
    arrest            integer                                                  DEFAULT NULL,
    demorgan          integer                                                  DEFAULT NULL,
    wanted            varchar(512)                                             DEFAULT NULL,
    biz               varchar(50)                                              DEFAULT NULL,
--     admin_lvl         integer                                                  DEFAULT NULL,
    licenses          varchar(256)                                             DEFAULT NULL,
    unwarn            timestamp                                                DEFAULT NULL,
    unmute            integer                                                  DEFAULT 0,
    warns             integer                                                  DEFAULT NULL,
    on_duty           varchar(50)                                              DEFAULT '',
    last_hour         integer                                                  DEFAULT NULL,
    hotel             integer                                                  DEFAULT NULL,
    hotel_left        integer                                                  DEFAULT NULL,
    contacts          varchar(2500)                                            DEFAULT NULL,
    achiev            varchar(2450)                                            DEFAULT NULL,
    sim_card          integer UNIQUE                                           DEFAULT NULL,
    PetName           varchar(30)  NOT NULL                                    DEFAULT NULL,
    pos               varchar(256)                                             DEFAULT NULL,
    create_date       timestamp                                                DEFAULT NULL,
    demorgan_info     varchar(350)                                             DEFAULT '{Admin:-1,Reason:-1}',
    warn_info         varchar(1000)                                            DEFAULT '{Admin:[-1,-1,-1],Reason:[-1,-1,-1]}',
    time              varchar(250)                                             DEFAULT '{TotalTime:0,Day:16,TodayTime:0,Month:3,MonthTime:0,Year:2020,YearTime:0,Week:1,WeekTime:0}',
    deaths            bigint                                                   DEFAULT 0,
    kills             bigint                                                   DEFAULT 0,
    earned_money      bigint                                                   DEFAULT 0,
    eat_times         bigint                                                   DEFAULT 0,
    revived           bigint                                                   DEFAULT 0,
    hands_shaken      bigint                                                   DEFAULT 0,
--     job_skills        varchar(2048)         DEFAULT '{}', CREATED TABLE FOR THIS
    refcode           varchar(64)                                              DEFAULT NULL,
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
CREATE TABLE IF NOT EXISTS job_skills
(
    uuid                       integer PRIMARY KEY REFERENCES characters (uuid) ON DELETE NO ACTION,
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
    uuid           integer REFERENCES characters (uuid) ON DELETE CASCADE,
    fraction       fractions_type NOT NULL DEFAULT NULL,
    fractions_rank integer        NOT NULL DEFAULT 0,
    PRIMARY KEY (uuid)
);

CREATE TABLE IF NOT EXISTS fractions
(
    name              integer        NOT NULL,
    name_enum         fractions_type NOT NULL DEFAULT 'THE_FAMILIES',
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
    clothing_sets     text           NOT NULL,
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
    first    varchar(50) NOT NULL,
    second   varchar(50) NOT NULL,
    fullname smallint    NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS furniture
(
    uuid      integer NOT NULL,
    furniture text         DEFAULT NULL,
    data      text         DEFAULT NULL,
    access    varchar(400) DEFAULT '[]'
);


CREATE TABLE IF NOT EXISTS banned
(
    uuid            integer PRIMARY KEY REFERENCES characters(uuid) ON DELETE NO ACTION,
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

CREATE TABLE IF NOT EXISTS admin_access
(
    command  varchar(50) NOT NULL,
    is_admin smallint    NOT NULL,
    min_rank smallint    NOT NULL
);

CREATE TABLE IF NOT EXISTS admins
(
    uuid          integer REFERENCES characters (uuid) ON DELETE CASCADE,
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
    'NOONE'
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
    date        timestamp   NOT NULL DEFAULT now(),
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
