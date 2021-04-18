export interface ContentLanguage {
    serviceName: string;
    titlePrefix: string;
    sideBySideTitle: string;
    textDiffTitle: string;
    traveledTo: string;
    openInNew: string;
    openTextDiff: string;
    openSideBySide: string;
    copyURL: string;
    stopViewing: string;
    dates: Dates;
}

interface Dates {
    months: Months;
    weekdays: Weekdays;
    dayLabel: string;
    locale: string;
}

interface Weekdays {
    long: string[];
}

interface Months {
    long: string[];
    short: string[];
}