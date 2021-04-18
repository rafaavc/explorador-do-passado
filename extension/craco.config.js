module.exports = {
    webpack: {
        configure: (webpackConfig, {env, paths}) => {
            return {
                ...webpackConfig,
                entry: {
                    main: [env === 'development' && require.resolve('react-dev-utils/webpackHotDevClient'),paths.appIndexJs].filter(Boolean),
                    content: './src/chrome/content.ts',
                    '../../service_worker': './src/chrome/service_worker.ts'
                },
                output: {
                    ...webpackConfig.output,
                    filename: 'static/js/[name].js'
                },
                optimization: {
                    ...webpackConfig.optimization,
                    runtimeChunk: false,
                }
            }
        },
    }
}