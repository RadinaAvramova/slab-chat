export default {
  files: ['./test/**/*.test.ts', './test/**/*.test.js'],
  extensions: {
    ts: 'module'
  },
  nodeArguments: [
    '--loader=ts-node/esm',
    '--experimental-specifier-resolution=node'
  ]
};
