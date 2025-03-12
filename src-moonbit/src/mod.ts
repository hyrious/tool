// @ts-ignore
import wasm from '../target/wasm-gc/release/build/lib/lib.wasm'

export interface Mod {
  // Returns 0 = equal, 1 = insert, 2 = delete
  // 0 old_line_num new_line_num
  // 1 new_line_num
  // 2 old_line_num
  diff(prev: string, next: string): string
}

declare global {
  namespace WebAssembly {
    interface CompileOptions {
      builtins: ["js-string"],
      importedStringConstants: string,
    }
    function instantiate(bytes: BufferSource, importObject?: Imports, compileOptions?: CompileOptions): Promise<WebAssemblyInstantiatedSource>;
  }
}

export default (imports: WebAssembly.Imports = {}): Promise<Mod> =>
  WebAssembly.instantiate(wasm, imports, { builtins: ["js-string"], importedStringConstants: "_" })
    .then(result => result.instance.exports as unknown as Mod)
