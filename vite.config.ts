import vue from '@vitejs/plugin-vue'
// @ts-ignore
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: 'src/DatePicker',
      outDir: 'dist/types',
    }),
  ],
  build: {
    lib: {
      // @ts-ignore
      entry: resolve(__dirname, 'src/DatePicker'),
      name: 'Datepicker',
      fileName: 'vue3-datepicker-ja',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue', 'date-fns'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
