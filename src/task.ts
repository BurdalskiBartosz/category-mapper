import { Category } from './mockedApi';
import type { CategoryListElement, GetCategories } from './types';
import { compareByOrder } from './utils/sort';

const markCategoriesToShowOnHome = (
  result: CategoryListElement[],
  toShowOnHome: number[]
): void => {
  if (result.length <= 5) {
    result.forEach((a) => (a.showOnHome = true));
  } else if (toShowOnHome.length > 0) {
    result.forEach((x) => (x.showOnHome = toShowOnHome.includes(x.id)));
  } else {
    result.forEach((x, index) => (x.showOnHome = index < 3));
  }
};

export const categoryTree = async (
  getCategories: GetCategories
): Promise<CategoryListElement[]> => {
  const res = await getCategories();

  if (!res.data) {
    return [];
  }

  const toShowOnHome: number[] = [];

  const getOrder = (title: string, id: number): number => {
    const hasHash = title.includes('#');
    const orderPart = hasHash ? title.split('#')[0] : title;

    if (hasHash) toShowOnHome.push(id);

    const order = parseInt(orderPart);
    return isNaN(order) ? id : order;
  };

  const mapCategoryToElement = (child: Category): CategoryListElement => {
    const { children = [], MetaTagDescription, name, Title, id } = child;
    return {
      children: children.map(mapCategoryToElement).sort(compareByOrder),
      image: MetaTagDescription,
      showOnHome: false,
      id,
      name,
      order: getOrder(Title, id),
    };
  };

  const result = res.data.map(mapCategoryToElement).sort(compareByOrder);

  markCategoriesToShowOnHome(result, toShowOnHome);

  return result;
};
