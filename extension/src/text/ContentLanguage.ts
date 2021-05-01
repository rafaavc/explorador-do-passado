export interface ContentLanguage {
  serviceName: string;
  titlePrefix: string;
  sideBySideTitle: string;
  textDiffTitle: string;
  traveledTo: string;
  cancelledTaskMessage: string;
  openInNew: OpenInNew;
  openTextDiff: OpenTextDiff;
  openSideBySide: OpenTextDiff;
  copyURL: OpenTextDiff;
  stopViewing: OpenInNew;
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

interface OpenTextDiff {
  text: string;
  successMsg: string;
}

interface OpenInNew {
  text: string;
}