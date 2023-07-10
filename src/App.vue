<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
import { toggleClass } from '@/utils'
export default {
    name: 'App',
    data() {
        return {}
    },
    computed: {
        themeSettings() {
            return this.$store.state.settings.themeSettings
        }
    },
    watch: {
        themeSettings(newData, oldData) {
            console.log('newData', newData)
            if (newData) {
                toggleClass(document.body, 'custom-' + newData)
            }
        }
    },
    beforeCreate() {
        window.addEventListener('load', e => { toggleClass(document.body, 'custom-' + this.ceshi('root', 'along').settings.themeSettings) })
    },
    created() {
        console.log('created')
        let initInfo = this.$getlocalStorage('initInfo')
        if (initInfo?.theme?.systemName) {
            document.title = initInfo.theme.systemName
        }
    },
    mounted() {
        console.log(this.ceshi('root', 'along'))
    },
    methods: {
        ceshi(keys, content) {
            if (sessionStorage && sessionStorage[content] != undefined) {
                var jsom = sessionStorage[content]
                if (jsom && jsom != '') {
                    var mp = JSON.parse(jsom)
                    if (mp[keys] && mp[keys] != '') {
                        return mp[keys]
                    } else {
                        return ''
                    }
                }
            } else {
                return ''
            }
        }
    }
}
</script>

<style lang="scss">
html,body {
    padding-right: 0 !important;
    height: 100%;
}
#app {
    position: relative;
    overflow: hidden;
    min-width: 900px;
    min-height: 100%;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    //text-align: center;
    color: #2c3e50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    @include themeify {
        background: themed('page-bg');
    }
}
</style>
