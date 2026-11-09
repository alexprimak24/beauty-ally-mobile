/** @type {import('prettier').Config} */
const config = {
  endOfLine: 'lf',
  plugins: ['prettier-plugin-tailwindcss'],
  printWidth: 100,
  semi: false,
  singleQuote: true,
  tailwindConfig: './tailwind.config.js',
  trailingComma: 'all',
}

export default config
