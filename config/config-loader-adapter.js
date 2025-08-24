// config/config-loader-adapter.js
export class ConfigLoader {
  /**
   * @param {{ validate?: (data:any, name:string)=>Promise<void> | void }} [opts]
   *  - validate: JSONスキーマ等の検証関数（失敗時は例外を投げること）
   */
  constructor(opts = {}) {
    this.env = typeof window === 'undefined' ? 'node' : 'browser';
    this.validateFn = opts.validate;
  }

  async load(configName, { basePath = '/config' } = {}) {
    const data = this.env === 'node'
      ? await this.#loadNode(configName)
      : await this.#loadBrowser(configName, basePath);

    if (this.validateFn) {
      await this.validateFn(data, configName);
    } else {
      // 検証未注入の注意喚起
      if (typeof console !== 'undefined' && console.warn) {
        console.warn(`[ConfigLoader] No validator provided for ${configName}.`);
      }
    }
    return Object.freeze(data);
  }

  async #loadNode(configName) {
    const { readFile } = await import('node:fs/promises');
    const path = await import('node:path');
    const url = await import('node:url');
    const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
    const file = path.join(__dirname, `${configName}.json`);
    const text = await readFile(file, 'utf8');
    return JSON.parse(text);
  }

  async #loadBrowser(configName, basePath) {
    const res = await fetch(`${basePath}/${configName}.json`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load ${configName}.json: ${res.status}`);
    return res.json();
  }
}

/* ---- 例: Ajv を使ったスキーマ検証注入（任意） ----
import Ajv from 'https://cdn.skypack.dev/ajv@8?min';
import schema from '/config/kingwen-mapping.schema.json' assert { type: 'json' };

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

const loader = new ConfigLoader({
  validate: (data, name) => {
    if (name === 'kingwen-mapping' && !validate(data)) {
      throw new Error('kingwen-mapping schema validation failed: ' + ajv.errorsText(validate.errors));
    }
  }
});

const kingwen = await loader.load('kingwen-mapping');
console.log(kingwen);
------------------------------------------------------ */