<template>
    <General></General>
</template>

<script>
import General from './General.vue'
export default {
    components: {
        General
    },
    provide() {
        return {
            indexTypeData: 1
        }
    }
}
</script>

<style>

</style>
