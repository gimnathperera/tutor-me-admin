export interface Subject {
  id: string;
  title: string;
}

export interface Grade {
  id: string;
  title?: string;
  description?: string;
  subjects?: Subject[];
  createdAt?: string;
}
