import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enLogin from "./Language/English/enLogin.json";
import viLogin from "./Language/Vietnamese/viLogin.json";
import enSignup from "./Language/English/enSignup.json";
import viSignup from "./Language/Vietnamese/viSignup.json";
import enCommon from "./Language/English/enCommon.json";
import viCommon from "./Language/Vietnamese/viCommon.json";
import enUserProfile from "./Language/English/enUserProfile.json";
import viUserProfile from "./Language/Vietnamese/viUserProfile.json";
import enMenu from "./Language/English/enMenu.json";
import viMenu from "./Language/Vietnamese/viMenu.json";
import enEmployee from "./Language/English/enEmployee.json";
import viEmployee from "./Language/Vietnamese/viEmployee.json";
import enAsset from "./Language/English/enAsset.json";
import viAsset from "./Language/Vietnamese/viAsset.json";
import enAssetType from "./Language/English/enAssetType.json";
import viAssetType from "./Language/Vietnamese/viAssetType.json";

const enTranslate = {
  ...enLogin,
  ...enSignup,
  ...enCommon,
  ...enUserProfile,
  ...enMenu,
  ...enEmployee,
  ...enAsset,
  ...enAssetType,
};

const viTranslate = {
  ...viLogin,
  ...viSignup,
  ...viCommon,
  ...viUserProfile,
  ...viMenu,
  ...viEmployee,
  ...viAsset,
  ...viAssetType,
};

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translate: enTranslate,
    },
    vi: {
      translate: viTranslate,
    },
  },
  lng: "en",
  fallbackLng: "en",
  ns: ["translate"],
  interpolation: {
    escapeValue: false,
  },
});
