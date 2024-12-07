import test from 'ava';

import { CORRECT } from '../correctResult';
import { getCategories } from '../mockedApi';
import { categoryTree } from '../task';

test('categoryTree', async (t) => {
  const data = await categoryTree(getCategories);

  t.deepEqual(data, CORRECT);
});
