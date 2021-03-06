import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from '../budler/plugins/unpkg-path-plugin';
import { fetchPlugin } from '../budler/plugins/fetch-plugin';

let service: esbuild.Service;

export const bundle = async (rawCode: string) => {
  if (!service) {
    service = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
    });
  }

  try {
    const res = await service.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window'
      }
    });

    return { code: res.outputFiles[0].text, err: '' };
  } catch (err) {
    return { code: '', err: err.message };
  }
};

export default bundle;
