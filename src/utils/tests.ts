export const generateEntryValue = (id: number, name: string, Title: string) => {
  return {
    id,
    name,
    hasChildren: false,
    url: 'https://exampledataprovider.com/porządki',
    Title,
    MetaTagDescription: 'https://anotherprovider.com/categories/porzadki.jpg',
    children: [],
  };
};

export const generateReturnValue = (
  id: number,
  name: string,
  order: number,
  showOnHome = true
) => {
  return {
    children: [],
    image: 'https://anotherprovider.com/categories/porzadki.jpg',
    showOnHome,
    id,
    name,
    order,
  };
};
