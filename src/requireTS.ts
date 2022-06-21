import ts from 'typescript'
import fs from 'fs'
import path from 'path'

require.extensions['.ts'] = function (module: any, filename) {
    const fileFullPath = path.resolve(__dirname, filename)
    const content = fs.readFileSync(fileFullPath, 'utf-8')

    const { outputText } = ts.transpileModule(content, {
        compilerOptions: require(path.join(process.cwd(), 'tsconfig.json')),
    })

    module?._compile?.(outputText, filename)
}