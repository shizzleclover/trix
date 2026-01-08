import fs from 'fs-extra';
import path from 'path';
import { CodeInjection } from '../types/template.js';

export class CodeInjector {
    async applyInjections(injections: CodeInjection[], targetDir: string): Promise<void> {
        const byFile = this.groupByFile(injections);

        for (const [filepath, fileInjections] of byFile) {
            let fullPath = path.join(targetDir, filepath);

            // Try alternatives if file doesn't exist
            if (!await fs.pathExists(fullPath)) {
                const alternatives = [
                    filepath.replace('.tsx', '.ts').replace('.js', '.ts'),
                    filepath.replace('.tsx', '.js').replace('.ts', '.js'),
                    filepath.replace('src/index.ts', 'src/server.ts'),
                    filepath.replace('src/index.ts', 'src/main.ts'),
                ];

                for (const alt of alternatives) {
                    const altPath = path.join(targetDir, alt);
                    if (await fs.pathExists(altPath)) {
                        fullPath = altPath;
                        break;
                    }
                }
            }

            if (!await fs.pathExists(fullPath)) {
                console.warn(`File ${fullPath} does not exist, skipping injections`);
                continue;
            }

            let content = await fs.readFile(fullPath, 'utf-8');

            for (const injection of fileInjections) {
                content = this.inject(content, injection);
            }

            await fs.writeFile(fullPath, content);
        }
    }

    private groupByFile(injections: CodeInjection[]): Map<string, CodeInjection[]> {
        const map = new Map<string, CodeInjection[]>();

        for (const injection of injections) {
            const existing = map.get(injection.file) || [];
            existing.push(injection);
            map.set(injection.file, existing);
        }

        return map;
    }

    private inject(content: string, injection: CodeInjection): string {
        switch (injection.position) {
            case 'import':
                return this.injectImport(content, injection.code);

            case 'provider':
                return this.wrapWithProvider(content, injection.code);

            case 'config':
                return this.injectConfig(content, injection.code);

            case 'custom':
                if (injection.marker) {
                    return this.injectAtMarker(content, injection.code, injection.marker);
                }
                return content;

            default:
                return content;
        }
    }

    private injectImport(content: string, importStatement: string): string {
        const importRegex = /^import\s+.+from\s+['"].+['"];?\s*$/gm;
        const matches = content.match(importRegex);

        if (matches && matches.length > 0) {
            const lastImport = matches[matches.length - 1];
            const lastImportIndex = content.lastIndexOf(lastImport);
            const insertPosition = lastImportIndex + lastImport.length;

            return content.slice(0, insertPosition) + '\n' + importStatement + content.slice(insertPosition);
        }

        return importStatement + '\n\n' + content;
    }

    private wrapWithProvider(content: string, providerCode: string): string {
        const appRegex = /<App\s*\/>/;

        if (appRegex.test(content)) {
            return content.replace(appRegex, `${providerCode}\n  <App />\n</${providerCode.match(/<(\w+)/)?.[1]}>`);
        }

        return content;
    }

    private injectConfig(content: string, configCode: string): string {
        const configRegex = /export\s+default\s+{/;

        if (configRegex.test(content)) {
            return content.replace(configRegex, `export default {\n  ${configCode},`);
        }

        return content;
    }

    private injectAtMarker(content: string, code: string, marker: string): string {
        if (content.includes(marker)) {
            return content.replace(marker, marker + '\n' + code);
        }

        return content;
    }
}