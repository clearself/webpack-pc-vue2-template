<template>
    <div class="new-btn normal" :class="{'edit':type==='edit','del':type==='del','disabled':!disabled}" @click="searchBtn">
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
            if (this.title === '编辑' || this.title === '编辑人数') {
                return 'edit'
            } else if (this.title === '删除' || this.title === '移除' || this.title === '删除组') {
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
.ub {
    display: -webkit-box!important;
    display: -moz-box!important;
    display: -ms-flexbox!important;
    display: -o-box!important;
    display: box!important;
    position: relative;
}
.ub-ac {
    -webkit-box-align: center;
    -moz-box-align: center;
    -ms-flex-align: center;
    -o-box-align: center;
    box-align: center;
}
.ub-pc {
    -webkit-box-pack: center;
    -moz-box-pack: center;
    -ms-flex-pack: center;
    -o-box-pack: center;
    box-pack: center;
}

.new-btn{
    display: inline-block;
    margin:0 5px;
    font-size:16px;
    cursor: pointer;
}
.new-btn.normal{
    i{
        color:#00C0FF;
    }
}

.new-btn.edit{
    i{
        color:#FFF584;
    }
}
.new-btn.del{
    i{
        color:#FF4E00;
    }
}
.new-btn.disabled{
    i{
        opacity: .5;
        cursor: not-allowed
    }
}

.white-theme .new-btn.normal{
    i{
        color:#3aa6e4;
    }
}

.white-theme .new-btn.edit{
    i{
        color:#F9D100;
    }
}
.white-theme .new-btn.del{
    i{
        color:#ff7200;
    }
}
.white-theme .new-btn.disabled{
    i{
        color:#6a6c6f;
        opacity: .3;
        cursor: not-allowed
    }
}
</style>
