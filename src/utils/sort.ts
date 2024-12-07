import type { CategoryListElement } from '../types';

export const compareByOrder = (
  a: CategoryListElement,
  b: CategoryListElement
): number => a.order - b.order;
