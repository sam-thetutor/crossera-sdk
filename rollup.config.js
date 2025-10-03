import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'CrossEraSDK',
      sourcemap: true,
      globals: {
        axios: 'axios'
      }
    }
  ],
  external: ['axios'],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json'
    })
  ]
};
