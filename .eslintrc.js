module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    
      // allow async-await
      'generator-star-spacing': 'off',
      // 函数定义时括号前面要不要有空格
      'space-before-function-paren': [2, 'never'],
      // 缩进风格
      'indent': [2, 2],
      // 检查 === 但是不报错
      'eqeqeq': [0, 'always'],
      // 连续声明必须要用'，'分开
      'one-var': [2, "always"]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
 