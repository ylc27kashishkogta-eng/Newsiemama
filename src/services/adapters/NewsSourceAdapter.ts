import { Story, TopicCategory } from '../../types';

export interface NewsSourceAdapter {
  id: string;
  name: string;
  description: string;
  isPermitted: boolean;
  fetchStories(topics: TopicCategory[]): Promise<Story[]>;
}
