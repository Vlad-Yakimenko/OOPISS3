module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint'
  ],
  extends: [
    'airbnb-typescript/base'
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  rules: {
    'no-trailing-spaces': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    'import/prefer-default-export': 'off',
    'no-restricted-syntax': 'off',
    'arrow-body-style': 'never',
    'no-console': 'off',
    'import/first': 'off',
    'import/newline-after-import': 'off',
    'class-methods-use-this': 'off',
    'max-len': ['warn', {
      'code': 120,
      'tabWidth': 2,
      'ignoreComments': true,
      'ignoreUrls': true,
      'ignoreStrings': true,
      'ignoreTemplateLiterals': true
    }],
    'no-param-reassign': ['warn', {
      'props': true,
      'ignorePropertyModificationsFor': ['query', 'validatedArr', 'header', 'benchDataItem', 'r']
    }],
    'object-curly-newline': 'warn'
  }
};
