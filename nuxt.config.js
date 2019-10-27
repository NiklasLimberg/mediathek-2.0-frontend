require('dotenv').config();

export default {
    modules: [
        '@nuxtjs/pwa',
        '@nuxtjs/auth',
        '@nuxtjs/axios',
        '@nuxtjs/dotenv'
    ],
    axios: {
        baseURL: process.env.LARAVEL_ENDPOINT
    },
    auth: {
        redirect: {
            login: '/login',
            logout: '/',
            callback: '/login',
            home: '/'
        },
        strategies: {
            local: false,
            password_grant: {
                _scheme: 'local',
                endpoints: {
                    login: {
                        url: '/oauth/token',
                        method: 'post',
                        propertyName: 'access_token'
                    },
                    logout: false,
                    user: {
                        url: '/api/user',
                        method: 'get',
                    }
                }
            }
        }
    },
    router: {
        middleware: ['auth']
    },
    css: [
        '@/assets/css/colors.css',
        '@/assets/css/main.scss',
        '@fortawesome/fontawesome-svg-core/styles.css',
    ],
    pwa: {
        workbox: {
            offline: true,
            offlineStrategy: 'CacheFirst',
            routingExtensions: '~/plugins/lookForVideoInCache',
            runtimeCaching: [{
                urlPattern: 'mediathek.s3.eu-central-1.wasabisys.com/show-thumbnails',
                handler: 'cacheFirst',
                method: 'GET',
                strategyOptions: {cacheableResponse: {statuses: [0, 200]}}
            }]
        }
    },
    plugins: [
        '~/plugins/fontawesome.js',
        {src: '~/plugins/localStorage.js', ssr: false}
    ],
    buildModules: [
        '@nuxtjs/dotenv',
        '@nuxtjs/moment'
    ],
    moment: {
        defaultLocale: 'de',
        locales: ['de']
    }, build: {
        extend(config, ctx) {
          if (ctx.isDev) {
            config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
          }
        }
    }
};