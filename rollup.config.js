import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    input: 'src/index.js',
    output: [
        {
            file: 'cjs/index.js',
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
        // commonjs({
        //     include: 'node_modules/**'
        // }),
        babel({
            exclude: ['node_modules/**']
        })
    ]
};
