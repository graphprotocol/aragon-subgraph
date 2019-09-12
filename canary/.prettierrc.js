module.exports = {
  ...require('@graphprotocol/graph-ts/.prettierrc.json'),

  printWidth: 120,

  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
      },
    },
  ],
}
