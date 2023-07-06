<template>
    <div class="weui-div" @click.stop="toggle">
        <span class="weui-switch" :class="{ 'weui-switch-on': me_checked }" :value="value"></span>
        <div v-if="!me_checked" class="weui-div-2">停用</div>
        <div v-else class="weui-div-1">启用</div>
    </div>
</template>

<script>
export default {
    name: 'KSwitch',
    props: {
        value: {
            type: Boolean,
            default: true
        },
        FId: {
            type: String,
            default: ''
        },
        index: {
            type: Number,
            default: 11090
        },
        handle: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            me_checked: this.value
        }
    },
    watch: {
        value() {
            this.me_checked = this.value
        }
    },
    methods: {
        toggle() {
            // 是否可点击
            if (this.handle === true) {
                this.me_checked = !this.me_checked
                this.$emit('changeSwitch', this.me_checked, this.FId, this.index)
            }
        }
    }
}
</script>

<style scoped lang="scss">
.custom-star {
  .weui-div {
    position: relative;
    font-weight: bold;
    cursor: pointer;
    width:60px;
    height: 24px;
  }
  .weui-div-1 {
    position: absolute;
    left: 6px;
    top: 0;
    line-height: 24px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.9);
  }
  .weui-div-2 {
    position: absolute;
    right: 8px;
    top: 0;
    line-height: 24px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.9);
  }
  .weui-switch {
    display: block;
    position: relative;
    width:60px;
    height: 24px;
    border: 1px solid rgba(255, 255, 255, 0);
    outline: 0;
    border-radius: 16px;
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, 0);
    transition: background-color 0.1s, border 0.1s;
    cursor: pointer;
  }
  .weui-switch:before {
    content: ' ';
    position: absolute;
    top: 0;
    left: 0;
    width: 58px;
    height: 22px;
    border-radius: 11px;
    background-color: #001a2c;
    transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
  }
  .weui-switch:after {
    content: ' ';
    position: absolute;
    top: 1px;
    left: 0;
    right: 0;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    background-color: #11809e;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
  }
  .weui-switch-on {
    border-color: #001a2c;
    background-color: #001a2c;
  }
  .weui-switch-on:before {
    border-color: #001a2c;
    background-color: #001a2c;
    border: 1px solid rgba(255, 255, 255, 0);
  }
  .weui-switch-on:after {
    background-color: #ecd7fa;
    transform: translateX(38px);
  }
}
  .weui-div {
    position: relative;
    font-weight: bold;
    cursor: pointer;
    width:60px;
    height: 24px;
  }
  .weui-div-1 {
    position: absolute;
    left: 6px;
    top: 0;
    line-height: 24px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.9);
  }
  .weui-div-2 {
    position: absolute;
    right: 8px;
    top: 0;
    line-height: 24px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.9);
  }
  .weui-switch {
    display: block;
    position: relative;
    width:60px;
    height: 24px;
    border: 1px solid #dfdfdf;
    outline: 0;
    border-radius: 16px;
    box-sizing: border-box;
    background-color: #dfdfdf;
    transition: background-color 0.1s, border 0.1s;
    cursor: pointer;
  }
  .weui-switch:before {
    content: ' ';
    position: absolute;
    top: 0;
    left: 0;
    width: 58px;
    height: 22px;
    border-radius: 11px;
    background-color: #c5c5c5;
    transition: transform 0.35s cubic-bezier(0.45, 1, 0.4, 1);
  }
  .weui-switch:after {
    content: ' ';
    position: absolute;
    top: 1px;
    left: 0;
    right: 0;
    width: 20px;
    height: 20px;
    border-radius: 10px;
    background-color: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    transition: transform 0.35s cubic-bezier(0.4, 0.4, 0.25, 1.35);
  }
  .weui-switch-on {
    border-color: #387DEE;
    background-color: #387DEE;
  }
  .weui-switch-on:before {
    border-color: #387DEE;
    background-color: #387DEE;
  }
  .weui-switch-on:after {
    transform: translateX(38px);
  }
</style>
