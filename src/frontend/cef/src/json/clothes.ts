
import BugsJson from './clothes/clothes_Bugs.json';


import MALE_MasksJson from './clothes/clothes_MALE_Masks.json';
import MALE_AccessoriesJson from './clothes/clothes_MALE_Accessories.json';
import MALE_EarsJson from './clothes/clothes_MALE_Ears.json';
import MALE_GlassesJson from './clothes/clothes_MALE_Glasses.json';
import MALE_HatsJson from './clothes/clothes_MALE_Hats.json';
import MALE_LegsJson from './clothes/clothes_MALE_Legs.json';
import MALE_ShoesJson from './clothes/clothes_MALE_Shoes.json';
import MALE_TopsJson from './clothes/clothes_MALE_Tops.json';
import MALE_UndershortJson from './clothes/clothes_MALE_Undershort.json';
import MALE_WatchesJson from './clothes/clothes_MALE_Watches.json';
import MALE_TorsosJson from './clothes/clothes_MALE_Torsos.json';
import MALE_BraceletsJson from './clothes/clothes_MALE_Bracelets.json';
import MALE_BodyArmorsJson from './clothes/clothes_MALE_BodyArmors.json';
import MALE_DecalsJson from './clothes/clothes_MALE_Decals.json';

import FEMALE_MasksJson from './clothes/clothes_FEMALE_Masks.json';
import FEMALE_AccessoriesJson from './clothes/clothes_FEMALE_Accessories.json';
import FEMALE_EarsJson from './clothes/clothes_FEMALE_Ears.json';
import FEMALE_GlassesJson from './clothes/clothes_FEMALE_Glasses.json';
import FEMALE_HatsJson from './clothes/clothes_FEMALE_Hats.json';
import FEMALE_LegsJson from './clothes/clothes_FEMALE_Legs.json';
import FEMALE_ShoesJson from './clothes/clothes_FEMALE_Shoes.json';
import FEMALE_TopsJson from './clothes/clothes_FEMALE_Tops.json';
import FEMALE_UndershortJson from './clothes/clothes_FEMALE_Undershort.json';
import FEMALE_WatchesJson from './clothes/clothes_FEMALE_Watches.json';
import FEMALE_TorsosJson from './clothes/clothes_FEMALE_Torsos.json';
import FEMALE_BraceletsJson from './clothes/clothes_FEMALE_Bracelets.json';
import FEMALE_BodyArmorsJson from './clothes/clothes_FEMALE_BodyArmors.json';
import FEMALE_DecalsJson from './clothes/clothes_FEMALE_Decals.json';

const jsonClothesData = {
    "MALE": {
        "Masks": MALE_MasksJson,
        "Bugs": BugsJson,
        "Hat": MALE_HatsJson,
        "Tops": MALE_TopsJson,
        "Undershort": MALE_UndershortJson,
        "Legs": MALE_LegsJson,
        "Shoes": MALE_ShoesJson,
        "Watches": MALE_WatchesJson,
        "Bracelets": MALE_BraceletsJson,
        "Glasses": MALE_GlassesJson,
        "Accessories": MALE_AccessoriesJson,
        "Ears": MALE_EarsJson,
        "Torsos": MALE_TorsosJson,
        "BodyArmors": MALE_BodyArmorsJson,
        "Decals": MALE_DecalsJson,
    },
    "FEMALE": {
        "Masks": FEMALE_MasksJson,
        "Bugs": BugsJson,
        "Hat": FEMALE_HatsJson,
        "Tops": FEMALE_TopsJson,
        "Undershort": FEMALE_UndershortJson,
        "Legs": FEMALE_LegsJson,
        "Shoes": FEMALE_ShoesJson,
        "Watches": FEMALE_WatchesJson,
        "Bracelets": FEMALE_BraceletsJson,
        "Glasses": FEMALE_GlassesJson,
        "Accessories": FEMALE_AccessoriesJson,
        "Ears": FEMALE_EarsJson,
        "Torsos": FEMALE_TorsosJson,
        "BodyArmors": FEMALE_BodyArmorsJson,
        "Decals": FEMALE_DecalsJson,
    }
}

export const getClothesDictionary = (gender: CharacterGender, name: string) => {
    return JSON.stringify((jsonClothesData[gender] as Record<string, unknown>)[name]);
}


import barber_MALE_BeardJson from './clothes/barber_Male_Beard.json';
import barber_MALE_BodyJson from './clothes/barber_Male_Body.json';
import barber_MALE_EyebrowsJson from './clothes/barber_Male_Eyebrows.json';
import barber_MALE_EyesJson from './clothes/barber_Male_Eyes.json';
import barber_MALE_HairJson from './clothes/barber_Male_Hair.json';
import barber_MALE_LipsJson from './clothes/barber_Male_Lips.json';
import barber_MALE_MakeupJson from './clothes/barber_Male_Makeup.json';
import barber_MALE_PaletteJson from './clothes/barber_Male_Palette.json';

import barber_FEMALE_BeardJson from './clothes/barber_Female_Beard.json';
import barber_FEMALE_BodyJson from './clothes/barber_Female_Body.json';
import barber_FEMALE_EyebrowsJson from './clothes/barber_Female_Eyebrows.json';
import barber_FEMALE_EyesJson from './clothes/barber_Female_Eyes.json';
import barber_FEMALE_HairJson from './clothes/barber_Female_Hair.json';
import barber_FEMALE_LipsJson from './clothes/barber_Female_Lips.json';
import barber_FEMALE_MakeupJson from './clothes/barber_Female_Makeup.json';
import barber_FEMALE_PaletteJson from './clothes/barber_Female_Palette.json';

const jsonBarberData = {
    "MALE": {
        "Beard": barber_MALE_BeardJson,
        "Body": barber_MALE_BodyJson,
        "Eyebrows": barber_MALE_EyebrowsJson,
        "Eyes": barber_MALE_EyesJson,
        "Hair": barber_MALE_HairJson,
        "Lips": barber_MALE_LipsJson,
        "Makeup": barber_MALE_MakeupJson,
        "Palette": barber_MALE_PaletteJson,
    },
    "FEMALE": {
        "Beard": barber_FEMALE_BeardJson,
        "Body": barber_FEMALE_BodyJson,
        "Eyebrows": barber_FEMALE_EyebrowsJson,
        "Eyes": barber_FEMALE_EyesJson,
        "Hair": barber_FEMALE_HairJson,
        "Lips": barber_FEMALE_LipsJson,
        "Makeup": barber_FEMALE_MakeupJson,
        "Palette": barber_FEMALE_PaletteJson,
    }
}

export const getBarberDictionary = (gender: CharacterGender, name: string) => {
    return JSON.stringify((jsonBarberData[gender] as Record<string, unknown>)[name]);
}


import tattoo_Head from './clothes/tattoo_Head.json';
import tattoo_LeftArm from './clothes/tattoo_LeftArm.json';
import tattoo_RightArm from './clothes/tattoo_RightArm.json';
import tattoo_LeftLeg from './clothes/tattoo_LeftLeg.json';
import tattoo_RightLeg from './clothes/tattoo_RightLeg.json';
import tattoo_Torso from './clothes/tattoo_Torso.json';
import type {CharacterGender} from "@/enums/character_gender";


const jsonTattooData = {
    "Head": tattoo_Head,
    "Torso": tattoo_Torso,
    "LeftArm": tattoo_LeftArm,
    "RightArm": tattoo_RightArm,
    "LeftLeg": tattoo_LeftLeg,
    "RightLeg": tattoo_RightLeg,
}

export const getTattooDictionary = (name: string) => {
    return JSON.stringify((jsonTattooData as Record<string, unknown>)[name]);
}




export const menu = [
    //
    {
        title: "головного убора",
        type: "clothes",
        dictionary: "Hat",
        icon: "inv-item-cap",
        function: [
            {
                event: "setPropIndex",
                componentId: 0
            },
        ],
        camera: "hat"
    },
    {
        title: "очков",
        type: "clothes",
        dictionary: "Glasses",
        icon: "inv-item-glasses",
        function: [
            {
                event: "setPropIndex",
                componentId: 1
            },
        ],
        camera: "hat"
    },
    {
        title: "серёжек",
        type: "clothes",
        dictionary: "Ears",
        icon: "inv-item-ears",
        function: [
            {
                event: "setPropIndex",
                componentId: 2
            },
        ],
        camera: "hat"
    },
    {
        title: "маски",
        type: "clothes",
        dictionary: "Masks",
        icon: "inv-item-mask",
        function: [
            {
                event: "setComponentVariation",
                componentId: 1
            },
        ],
        camera: "hat"
    },
    {
        title: "аксессуара",
        type: "clothes",
        dictionary: "Accessories",
        icon: "inv-item-necklace",
        function: [
            {
                event: "setComponentVariation",
                componentId: 7
            },
        ],
        camera: "hat"
    },
    {
        title: "верхней одежды",
        type: "clothes",
        dictionary: "Tops",
        icon: "inv-item-jacket",
        function: [
            {
                event: "setComponentVariation",
                componentId: 11
            },
        ],
        camera: "top"
    },
    {
        title: "нижней одежды",
        type: "clothes",
        dictionary: "Undershort",
        icon: "inv-item-shirt",
        function: [
            {
                event: "setComponentVariation",
                componentId: 11
            },
        ],
        camera: "top"
    },
    {
        title: "рюкзаков",
        type: "clothes",
        dictionary: "Bugs",
        icon: "inv-item-backpack",
        function: [
            {
                event: "setComponentVariation",
                componentId: 5
            },
        ],
        camera: "top"
    },
    {
        title: "перчаток",
        type: "clothes",
        dictionary: "Torsos",
        icon: "inv-item-glove",
        function: [
            {
                event: "setComponentVariation",
                componentId: 3
            },
        ],
        camera: "top"
    },
    {
        title: "часов",
        type: "clothes",
        dictionary: "Watches",
        icon: "inv-item-clock",
        function: [
            {
                event: "setPropIndex",
                componentId: 6
            },
        ],
        camera: "top"
    },
    {
        title: "браслетов",
        type: "clothes",
        dictionary: "Bracelets",
        icon: "inv-item-bracelet",
        function: [
            {
                event: "setPropIndex",
                componentId: 7
            },
        ],
        camera: "top"
    },
    {
        title: "штанов",
        type: "clothes",
        dictionary: "Legs",
        icon: "inv-item-shorts",
        function: [
            {
                event: "setComponentVariation",
                componentId: 4
            },
        ],
        camera: "legs"
    },
    {
        title: "ботинок",
        type: "clothes",
        dictionary: "Shoes",
        icon: "inv-item-sneakers",
        function: [
            {
                event: "setComponentVariation",
                componentId: 6
            },
        ],
        camera: "shoes"
    },
    {
        title: "бронежелет",
        type: "clothes",
        dictionary: "BodyArmors",
        icon: "inv-item-armor",
        function: [
            {
                event: "setComponentVariation",
                componentId: 9
            },
        ],
        camera: "top"
    },
    {
        title: "декали",
        type: "clothes",
        dictionary: "Decals",
        icon: "inv-item-bracelet",
        function: [
            {
                event: "setComponentVariation",
                componentId: 10
            },
        ],
        camera: "top"
    },

    //Баребер
    {
        title: "прически",
        type: "barber",
        dictionary: "Hair",
        icon: "newbarbershopicons-hair",
        color: true,
        colorHighlight: true,
        function: [
            {
                event: "setComponentVariation",
                componentId: 2
            },
            {
                event: "setHairColor"
            }
        ],
        camera: "hat",
        isHair: true
    },
    {
        title: "бороды",
        type: "barber",
        dictionary: "Beard",
        icon: "newbarbershopicons-beard",
        color: true,
        opacity: true,
        function: [
            {
                event: "setHeadOverlay",
                overlayID: 1
            },
            {
                event: "setHeadOverlayColor",
                overlayID: 1,
                colorType: 1
            }
        ],
        camera: "hat",
        isHair: true,
        gender: "MALE"
    },
    {
        title: "бровей",
        type: "barber",
        dictionary: "Eyebrows",
        icon: "newbarbershopicons-eyebrows",
        color: true,
        opacity: true,
        function: [
            {
                event: "setHeadOverlay",
                overlayID: 2
            },
            {
                event: "setHeadOverlayColor",
                overlayID: 2,
                colorType: 1
            }
        ],
        camera: "hat",
        isHair: true
    },
    {
        title: "волос на груди",
        type: "barber",
        dictionary: "Body",
        icon: "newbarbershopicons-body",
        color: true,
        opacity: true,
        function: [
            {
                event: "setHeadOverlay",
                overlayID: 10
            },
            {
                event: "setHeadOverlayColor",
                overlayID: 10,
                colorType: 1
            }
        ],
        camera: "top",
        isHair: true,
        gender: "MALE"
    },
    {
        title: "линз",
        type: "barber",
        dictionary: "Eyes",
        icon: "newbarbershopicons-eyes",
        function: [
            {
                event: "setEyeColor"
            },
        ],
        camera: "hat"
    },
    {
        title: "помады",
        type: "barber",
        dictionary: "Lips",
        icon: "newbarbershopicons-lips",
        color: true,
        opacity: true,
        function: [
            {
                event: "setHeadOverlay",
                overlayID: 8
            },
            {
                event: "setHeadOverlayColor",
                overlayID: 8,
                colorType: 2
            }
        ],
        camera: "hat"
    },
    {
        title: "румянца",
        type: "barber",
        dictionary: "Palette",
        icon: "newbarbershopicons-palette",
        color: true,
        opacity: true,
        function: [
            {
                event: "setHeadOverlay",
                overlayID: 5
            },
            {
                event: "setHeadOverlayColor",
                overlayID: 5,
                colorType: 2
            }
        ],
        camera: "hat"
    },
    {
        title: "теней",
        type: "barber",
        dictionary: "Makeup",
        icon: "newbarbershopicons-makeup",
        opacity: true,
        function: [
            {
                event: "setHeadOverlay",
                overlayID: 4
            },
            {
                event: "setHeadOverlayColor",
                overlayID: 4,
                colorType: 0
            }
        ],
        camera: "hat"
    },

    //

    {
        title: "тату на голове",
        type: "tattoo",
        dictionary: "Head",
        icon: "ic-st-t-head",
        camera: "hat",
        tattooId: 1,
    },

    {
        title: "тату на торсе",
        type: "tattoo",
        dictionary: "Torso",
        icon: "newbarbershopicons-body",
        camera: "top",
        tattooId: 0,
    },

    {
        title: "тату на левой руке",
        type: "tattoo",
        dictionary: "LeftArm",
        icon: "ic-st-t-muscles",
        camera: "top",
        tattooId: 2,
    },

    {
        title: "тату на правой руке",
        type: "tattoo",
        dictionary: "RightArm",
        icon: "ic-st-t-muscler",
        camera: "top",
        tattooId: 3,
    },

    {
        title: "тату на левой ноге",
        type: "tattoo",
        dictionary: "LeftLeg",
        icon: "ic-st-t-leg2",
        camera: "legs",
        tattooId: 4,
    },

    {
        title: "тату на правой ноге",
        type: "tattoo",
        dictionary: "RightLeg",
        icon: "ic-st-t-leg1",
        camera: "legs",
        tattooId: 5,
    },

];

export let clothesEmpty = {
    "FEMALE": {1: 0, 3: 15, 4: 15, 5: 0, 6: 35, 7: 0, 8: 6, 9: 0, 10: 0, 11: 15},
    "MALE": {1: 0, 3: 15, 4: 21, 5: 0, 6: 34, 7: 0, 8: 15, 9: 0, 10: 0, 11: 15}
};
