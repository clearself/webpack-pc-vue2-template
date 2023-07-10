<template>
    <div class="reuse-btn normal" :class="{'edit':type==='edit','del':type==='del','disabled':!disabled}" @click="searchBtn">
        <el-tooltip class="item" effect="dark" :content="title" placement="top">
            <i :class="[icon]"></i>
        </el-tooltip>
    </div>
</template>

<script>
export default {
    name: 'OptBtn',
    props: {
        title: {
            type: String,
            default: ''
        },
        icon: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {}
    },
    computed: {
        // eslint-disable-next-line vue/return-in-computed-property
        type() {
            if (this.title === '编辑' || this.title === '编辑人数' || this.title === '编辑草稿') {
                return 'edit'
            } else if (this.title === '删除' || this.title === '移除' || this.title === '删除组' || this.title === '删除草稿') {
                return 'del'
            }
        }
    },
    mounted() {

    },
    methods: {
        searchBtn() {
            if (this.disabled) {
                this.$emit('click')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.reuse-btn{
    display: inline-block;
    margin:0 5px;
    font-size:16px;
    cursor: pointer;
}
.reuse-btn.normal{
    i{
        color:#00C0FF;
    }
}

.reuse-btn.edit{
    i{
        color:#FFF584;
    }
}
.reuse-btn.del{
    i{
        color:#FF4E00;
    }
}
.reuse-btn.disabled{
    i{
        opacity: .5;
        cursor: not-allowed
    }
}

.white-theme .reuse-btn.normal{
    i{
        color:#3aa6e4;
    }
}

.white-theme .reuse-btn.edit{
    i{
        color:#F9D100;
    }
}
.white-theme .reuse-btn.del{
    i{
        color:#ff7200;
    }
}
.white-theme .reuse-btn.disabled{
    i{
        color:#6a6c6f;
        opacity: .3;
        cursor: not-allowed
    }
}
</style>
