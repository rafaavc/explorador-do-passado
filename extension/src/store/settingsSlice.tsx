import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getSettingsValue, setSettingsValue } from '../chrome/storage';
import { SettingsOptions } from '../utils/SettingsOptions';
import { Language, languageAsStr, RootState, strAsLanguage, ThunkState } from './storeInterfaces';
import enlang from '../text/en.json';
import ptlang from '../text/pt.json';
import { PopupLanguage } from '../text/PopupLanguage';


export const toggleRetrieveAtLoad = createAsyncThunk('settings/toggleRetrieveAtLoad', async (current: boolean) => {
    if (process.env.NODE_ENV == "production") await setSettingsValue(SettingsOptions.RetrieveAtLoad, !current);
    return !current;
});

export const changeLanguage = createAsyncThunk('settings/changeLanguage', async (lang: Language) => {
    if (process.env.NODE_ENV == "production") await setSettingsValue(SettingsOptions.Language, languageAsStr(lang));
    return {
        lang,
        text: getLanguageText(lang)
    };
});

const getLanguageText = (lang: Language): PopupLanguage => {
    if (lang == Language.PT) return ptlang;
    return enlang;
}

const detectBrowserLanguage = (): Language => {
    const navigatorLanguage = (navigator.languages && navigator.languages[0]) || navigator.language; // mavigator.userLanguage doesn't exist?
    const lang = navigatorLanguage.substring(0, 2).toUpperCase();
    const converted = strAsLanguage(lang);
    if (converted == Language.ERROR) return Language.EN;
    return converted;
}

export const fetchSettings = createAsyncThunk('settings/fetchSettings', async () => {
    const settings = await getSettingsValue([ SettingsOptions.RetrieveAtLoad, SettingsOptions.Language ]);
    console.log("Received the value of settings:", settings);

    const userLang = detectBrowserLanguage();

    const candidate = SettingsOptions.Language in settings ? strAsLanguage(settings[SettingsOptions.Language]) : Language.ERROR;
    console.log("User language is", userLang, "| Stored language is", candidate);
    const lang: Language = candidate != Language.ERROR ? candidate : userLang;

    return {
        retrieveAtLoad: SettingsOptions.RetrieveAtLoad in settings ? settings[SettingsOptions.RetrieveAtLoad] : true,
        language: {
            lang,
            text: getLanguageText(lang)
        }
    };
});


// need to do defaults based on system language
const initialLanguage = {
    lang: detectBrowserLanguage(),
    text: getLanguageText(detectBrowserLanguage())
}

export const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        retrieveAtLoad: true,
        status: ThunkState.Idle,
        language: initialLanguage
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(toggleRetrieveAtLoad.fulfilled, (state, action) => {
                state.retrieveAtLoad = action.payload;
            })
            .addCase(changeLanguage.fulfilled, (state, action) => {
                state.language = action.payload;
            })
            .addCase(fetchSettings.fulfilled, (state, action: { payload: any }) => {
                state.retrieveAtLoad = action.payload.retrieveAtLoad;
                state.language = action.payload.language;
                state.status = ThunkState.Success;
            })
            .addCase(fetchSettings.rejected, (state, action: { payload: any }) => {
                if (process.env.NODE_ENV == "development") {
                    state.retrieveAtLoad = false;
                    state.status = ThunkState.Success;
                    console.error(action.payload);
                    return;
                }
                state.status = ThunkState.Failed;
                console.error(action.payload);
            })
    }
});

export const selectRetrieveAtLoad = (state: RootState) => state.settings.retrieveAtLoad;

export const selectLanguage = (state: RootState) => state.settings.language.lang;

export const selectLanguageText = (state: RootState) => state.settings.language.text;

export const selectSettingsState = (state: RootState) => state.settings.status;

export default settingsSlice.reducer;

