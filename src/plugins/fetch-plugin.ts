import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const fileCache = localForage.createInstance({
  name: 'filecache'
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: inputCode
          };
        }

        // Check to see if we've already fetched this file
        // and if it is in the cache
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        // if it is, return it immediately
        if (cachedResult) return cachedResult;
        else {
          const { data, request } = await axios.get(args.path);

          const fileType = args.path.match(/.css$/) ? 'css' : 'jsx';
          const escaped = data
            .replace(/\n/g, '')
            .replace(/"/g, '\\"')
            .replace(/'/g, "\\'");
          const contents =
            fileType === 'css'
              ? `
        const style = document.createElement('style');
        style.innerText = '${escaped}';
        document.head.appendDhild(style);
        `
              : data;

          const result: esbuild.OnLoadResult = {
            loader: 'jsx',
            contents,
            resolveDir: new URL('./', request.responseURL).pathname
          };

          // store reponse in cache
          await fileCache.setItem(args.path, result);

          return result;
        }
      });
    }
  };
};