// @ts-check
const path = require('path')

const OUTPUT_FILE = 'main.js'

/** @type {(env: unknown, argv: { mode?: string }) => import('webpack').Configuration} */
module.exports = (env, argv) => {
    const mode = argv.mode || 'development'
    const isProduction = mode === 'production'

    return {
        entry: './index.ts',
        mode,
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'ts-loader',
                        options: {
                            // Skip type checking here — run `npm run type-check` separately
                            transpileOnly: false,
                        },
                    },
                },
            ],
        },
        resolve: {
            extensions: ['.ts', '.js'],
            alias: {
                '@': path.resolve(__dirname),
            },
        },
        optimization: {
            minimize: isProduction,
        },
        // RAGE MP client_packages bundle size limits:
        //   - Warn at 512 KB (single-file scripts can become sluggish above this)
        //   - Error at 1 MB (practical upper bound before RAGE MP shows loading issues)
        performance: {
            hints: isProduction ? 'warning' : false,
            maxEntrypointSize: 1024 * 1024,
            maxAssetSize: 1024 * 1024,
        },
        output: {
            // Mirror src_client: output goes directly into client_packages/
            path: path.join(__dirname, '../client_packages'),
            filename: OUTPUT_FILE,
            library: 'redage-clientside',
            libraryTarget: 'umd',
            globalObject: 'global',
        },
        devtool: isProduction ? false : 'source-map',
    }
}
