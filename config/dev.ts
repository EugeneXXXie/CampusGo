import type { UserConfigExport } from "@tarojs/cli";
export default {
  
  mini: {},
  h5: {
    devServer: {
      host: '127.0.0.1',
      port: 3000
    }
  }
} satisfies UserConfigExport<'vite'>
