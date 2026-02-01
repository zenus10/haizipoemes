// 诗歌筛选配置
import poemFilters from '../content/_config/filters.json';

export const poemTypes = poemFilters.poemTypes;
export const poemYears = poemFilters.poemYears;

// 类型定义
export interface PoemType {
  key: string;
  label: string;
}
