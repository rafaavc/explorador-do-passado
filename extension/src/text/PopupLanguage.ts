export interface PopupLanguage {
  extensionTitle: string;
  website: Website;
  general: General;
  history: History;
  info: Info;
  settings: Settings;
  entities: Entities;
  mementoList: MementoList;
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

interface MementoList {
  versionLabel: VersionLabel;
  title: string;
  notFoundMessage: string;
  entryActions: EntryActions;
  viewingMementoCard: ViewingMementoCard;
}

interface ViewingMementoCard {
  header: string;
  sideBySide: string;
  textDiff: string;
  subHeader: string;
  actions: Actions;
  closeFeedback: CloseFeedback;
}

interface CloseFeedback {
  success: string;
}

interface Actions {
  close: string;
  newTab: string;
  sideBySide: string;
  textDiff: string;
  copy: string;
}

interface EntryActions {
  title: string;
  newTab: NewTab;
  sideBySide: SideBySide;
  textDiff: SideBySide;
  copy: SideBySide;
}

interface SideBySide {
  primary: string;
  secondary: string;
  successMsg: string;
}

interface NewTab {
  primary: string;
  secondary: string;
}

interface VersionLabel {
  singular: string;
  plural: string;
}

interface Entities {
  title: string;
}

interface Settings {
  title: string;
  tooltip: string;
  retrieveAtLoad: RetrieveAtLoad;
  language: RetrieveAtLoad;
  historyMaxNEntries: RetrieveAtLoad;
  defaultEntitiesState: RetrieveAtLoad;
}

interface RetrieveAtLoad {
  primary: string;
}

interface Info {
  tooltip: string;
  titleBeginning: string;
  content: string;
  arquivoURL: string;
  arquivoButtonText: string;
}

interface History {
  title: string;
  tooltip: string;
}

interface General {
  closeButtonText: string;
}

interface Website {
  tooltip: string;
  url: string;
}