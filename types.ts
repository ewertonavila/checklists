
export type ItemStatus = 'PENDING' | 'OK' | 'NA';

export interface ChecklistItem {
  id: string;
  label: string;
  status: ItemStatus;
}

export interface ChecklistCategory {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistSection {
  id: string;
  title: string;
  categories: ChecklistCategory[];
  projectCode?: string;
  designer?: string;
  reviewer?: string;
}

export interface AppState {
  sections: ChecklistSection[];
  activeSectionId: string;
  projectName: string;
}
