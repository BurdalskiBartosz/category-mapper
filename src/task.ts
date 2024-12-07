import {
  maxResultsOnHome,
  minResultsOnHome,
  titleIndicator,
} from './constants';
import { Category } from './mockedApi';
import type { CategoryListElement, GetCategories } from './types';

const markCategoriesToShowOnHome = (
  result: CategoryListElement[],
  toShowOnHome: number[]
): void => {
  const shouldShowOnHome = (categoryId: number, index: number): boolean => {
    if (result.length <= maxResultsOnHome) return true;
    if (toShowOnHome.length > 0) return toShowOnHome.includes(categoryId);
    return index < minResultsOnHome;
  };

  result.forEach((category, index) => {
    category.showOnHome = shouldShowOnHome(category.id, index);
  });
};

const compareByOrder = (
  a: CategoryListElement,
  b: CategoryListElement
): number => a.order - b.order;

const getCategoryTree = (data: Category[]) => {
  const toShowOnHome: number[] = [];

  const getOrder = (title: string, id: number): number => {
    const hasIndicator = title.includes(titleIndicator);
    const orderPart = hasIndicator ? title.split(titleIndicator)[0] : title;

    if (hasIndicator) toShowOnHome.push(id);

    const order = parseInt(orderPart);
    return isNaN(order) ? id : order;
  };

  const mapCategories = (child: Category): CategoryListElement => {
    const { children = [], MetaTagDescription, name, Title, id } = child;

    return {
      children: children.map(mapCategories).sort(compareByOrder),
      image: MetaTagDescription,
      showOnHome: false,
      id,
      name,
      order: getOrder(Title, id),
    };
  };

  const result = data.map(mapCategories).sort(compareByOrder);

  markCategoriesToShowOnHome(result, toShowOnHome);
  return result;
};

export const categoryTree = async (
  getCategories: GetCategories
): Promise<CategoryListElement[]> => {
  try {
    const res = await getCategories();
    if (!res.data) {
      return [];
    }

    return getCategoryTree(res.data);
  } catch (error) {
    return [];
  }
};
