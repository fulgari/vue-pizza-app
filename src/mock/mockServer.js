/**
 * Using 'mockjs' for mocking data, provide API for mock data
 */

import Mock from 'mockjs';
import data from '../common/data/data.json';

// register interfaces
Mock.mock('/api/goods', {
  code: 0,
  data: data.goods
});
Mock.mock('/api/ratings', {
  code: 0,
  data: data.ratings
});
Mock.mock('/api/seller', {
  code: 0,
  data: data.seller
});

// no need to 'export'
