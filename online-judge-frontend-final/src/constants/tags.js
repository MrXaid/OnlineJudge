export const TAGS = [
  'math', 'dp', 'greedy', 'binary search', 'graph', 'tree',
  'number theory', 'combinatorics', 'bitmasks', 'dfs', 'bfs',
  'shortest paths', 'geometry', 'implementation', 'brute force',
  'prefix sum', 'sliding window'
];

export const tagOptions = TAGS.map(tag => ({ value: tag, label: tag }));

export const tagColors = {
  math: 'bg-blue-200 text-blue-800',
  dp: 'bg-green-200 text-green-800',
  greedy: 'bg-yellow-200 text-yellow-800',
  'binary search': 'bg-red-200 text-red-800',
  graph: 'bg-purple-200 text-purple-800',
  tree: 'bg-pink-200 text-pink-800',
  default: 'bg-gray-200 text-gray-800',
};

export const getTagColorClass = (tag) => tagColors[tag] || tagColors.default;
