<template>
    <div><sketch-picker v-model="colors" @input="updateValue"/></div>
</template>

<script>
import { Sketch } from 'vue-color'
export default {
    name: 'ColorPicker',
    props: ['color'],
    components: {
        'sketch-picker': Sketch
    },
    data() {
        return {
            colors: {
                hex: ''
            }
        }
    },
    watch: {
        // color: {
        //     handler(newval) {
        //         console.log(newval)
        //     },
        //     deep: true
        // }
    },
    computed: {},
    created() {
        this.colors.hex = this.color
    },
    mounted() {
        // console.log(this.color)
        // this.$forceUpdate()
    },
    beforeDestroy() {},
    methods: {
        updateValue(value) {
            console.log(value)
            this.$emit('colorChange', value.hex)
        }
    }
}
</script>

<style scoped lang="scss"></style>
