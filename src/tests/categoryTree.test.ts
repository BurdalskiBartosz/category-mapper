import test from 'ava';

import { CORRECT } from '../correctResult';
import { INCORRECT } from '../currentResult';
import { getCategories } from '../mockedApi';
import { categoryTree } from '../task';
import type { GetCategories } from '../types';
import { generateEntryValue, generateReturnValue } from '../utils/tests';

test('categoryTree return value should be deep equal to correct data from correctResult.ts', async (t) => {
  const data = await categoryTree(getCategories);
  t.deepEqual(data, CORRECT);
});

test('categoryTree return value should not be deep equal to incorrect data from currentResult.ts', async (t) => {
  const data = await categoryTree(getCategories);
  t.notDeepEqual(data, INCORRECT);
});

test('categoryTree handles more than 5 items without # in titles', async (t) => {
  const mock = [
    generateEntryValue(1, 'Test 1', '2'),
    generateEntryValue(2, 'Test 2', '1'),
    generateEntryValue(3, 'Test 3', '3'),
    generateEntryValue(4, 'Test 4', '4'),
    generateEntryValue(5, 'Test 5', '5'),
    generateEntryValue(6, 'Test 6', '6'),
  ];
  const getMockedCategories: GetCategories = async () => ({ data: mock });

  const data = await categoryTree(getMockedCategories);

  const expected = [
    generateReturnValue(2, 'Test 2', 1),
    generateReturnValue(1, 'Test 1', 2),
    generateReturnValue(3, 'Test 3', 3),
    generateReturnValue(4, 'Test 4', 4, false),
    generateReturnValue(5, 'Test 5', 5, false),
    generateReturnValue(6, 'Test 6', 6, false),
  ];

  t.deepEqual(data, expected);
});

test('categoryTree handles more than 5 items with # in titles', async (t) => {
  const mock = [
    generateEntryValue(1, 'Test 1', '2'),
    generateEntryValue(2, 'Test 2', '1'),
    generateEntryValue(3, 'Test 3', '3'),
    generateEntryValue(4, 'Test 4', '4#'),
    generateEntryValue(5, 'Test 5', '5#'),
    generateEntryValue(6, 'Test 6', '6#'),
  ];
  const getMockedCategories: GetCategories = async () => ({ data: mock });

  const data = await categoryTree(getMockedCategories);

  const expected = [
    generateReturnValue(2, 'Test 2', 1, false),
    generateReturnValue(1, 'Test 1', 2, false),
    generateReturnValue(3, 'Test 3', 3, false),
    generateReturnValue(4, 'Test 4', 4),
    generateReturnValue(5, 'Test 5', 5),
    generateReturnValue(6, 'Test 6', 6),
  ];

  t.deepEqual(data, expected);
});

test('categoryTree handles data arrays with 5 or fewer items', async (t) => {
  const mock = [
    generateEntryValue(1, 'Test 1', '2'),
    generateEntryValue(2, 'Test 2', '1'),
    generateEntryValue(3, 'Test 3', '3'),
    generateEntryValue(4, 'Test 4', '4'),
  ];
  const getMockedCategories: GetCategories = async () => ({ data: mock });

  const data = await categoryTree(getMockedCategories);

  const expected = [
    generateReturnValue(2, 'Test 2', 1),
    generateReturnValue(1, 'Test 1', 2),
    generateReturnValue(3, 'Test 3', 3),
    generateReturnValue(4, 'Test 4', 4),
  ];

  t.deepEqual(data, expected);
});

test('categoryTree should return items in correct order', async (t) => {
  const mock = [
    generateEntryValue(1, 'Test 1', '4'),
    generateEntryValue(2, 'Test 2', '2'),
    generateEntryValue(3, 'Test 3', '1'),
    generateEntryValue(4, 'Test 4', '3'),
  ];
  const getMockedCategories: GetCategories = async () => ({ data: mock });

  const data = await categoryTree(getMockedCategories);

  const expected = [
    generateReturnValue(3, 'Test 3', 1),
    generateReturnValue(2, 'Test 2', 2),
    generateReturnValue(4, 'Test 4', 3),
    generateReturnValue(1, 'Test 1', 4),
  ];

  t.deepEqual(data, expected);
});

test('categoryTree should return empty array', async (t) => {
  const getMockedCategories: GetCategories = async () => ({ data: null });

  const data = await categoryTree(getMockedCategories);

  const expected = [];

  t.deepEqual(data, expected);
});

test('categoryTree should return an empty array when getCategories throws an error', async (t) => {
  const getCategories: GetCategories = async () => {
    throw new Error('Failed to fetch categories');
  };

  const data = await categoryTree(getCategories);

  t.deepEqual(data, []);
});
