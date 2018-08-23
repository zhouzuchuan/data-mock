import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'lib/index.js',
            format: 'cjs'
        },
        {
            file: 'es/index.js',
            format: 'es'
        }
    ],
    external: ['fs', 'path', 'assert', 'url'],
    plugins: [
        resolve({
            jsnext: true
        }),
        babel({
            exclude: ['node_modules/**']
        })
    ]
};
