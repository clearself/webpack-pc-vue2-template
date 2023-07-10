<template>
    <div class="theme-manage">
        <div class="content event-wrapper">
            <div class="title">主题样式布局</div>
            <div class="subhead">自定义概览页面布局。选择最适合你需要的</div>
            <el-divider class="line">布局样式</el-divider>
            <div class="layout-style">
                <div class="cell" :class="{'active':item.typeData==layoutModeSettings}" v-for="(item,index) in layoutStyle" :key="index" @click="selectLaylout(item,index)">
                    <img class="image" :src="item.imgSrc" alt="">
                    <div class="text-sum">
                        <span class="text-one mr-1">{{ item.textOne }}</span>
                        <span class="text-two">{{ `(${item.textTwo})` }}</span>
                    </div>
                </div>
            </div>
            <el-divider class="line">导航样式</el-divider>
            <div class="layout-style">
                <div class="cell" :class="{active:item.typeData === navConfigValue  , 'top-disabled': layoutModeSettings === 'top'}" v-for="(item,index) in navStyle" :key="index" @click="selectNav(item,index)">
                    <img class="image" :src="item.imgSrc" alt="">
                    <div class="text-sum">
                        <span class="text-one mr-1">{{ item.textOne }}</span>
                        <span class="text-two">{{ `(${item.textTwo})` }}</span>
                    </div>
                </div>
            </div>
            <el-divider class="line">主题颜色</el-divider>
            <div class="layout-style">
                <div class="cell" :class="{'active':item.typeData == themeSettings}" v-for="(item,index) in themeColorStyle" :key="index" @click="selectThemeColor(item,index)">
                    <img class="image" :src="item.imgSrc" alt="">
                    <div class="text-sum">
                        <span class="text-one mr-1">{{ item.textOne }}</span>
                        <span class="text-two">{{ `(${item.textTwo})` }}</span>
                    </div>
                </div>
            </div>
            <el-divider class="line">LOGO名称更换</el-divider>
            <div class="form">
                <el-form :model="themeForm" ref="themeForm" :rules="rules" label-position="top">
                    <el-form-item label="系统名称：" prop="systemName" label-width="formLabelWidth">
                        <el-input maxlength="10" v-model="themeForm.systemName" placeholder="请输入内容" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="上传LOGO：" prop="logoAddress" :label-width="formLabelWidth">
                        <div class="ub ub-relative">
                            <el-upload
                                name="fileUpload"
                                class="upload-demo"
                                drag
                                :data="uploadToken"
                                accept=".jpg,.jpeg,.png,.JPG,.JPEG"
                                ref="upload1"
                                :limit="1"
                                action="/api/base-server/file/upload"
                                :before-upload="beforeAvatarUpload"
                                :on-success="uploadFileSuccess"
                                :on-error="uploadFileError"
                                :on-exceed="limitFun">
                                <i class="el-icon-plus"></i>
                                <div class="text">点击上传图片</div>
                            </el-upload>
                            <div v-if="logoSrc !== ''" style="width:120px;height:120px;margin-left:24px;position:absolute;left:150px">

                                <el-image  fit="fill"  style="width: 120px; height: 120px" :src="logoSrc" lazy> </el-image>
                            </div>
                        </div>
                        <div class="upload-tip"><span style="margin-right:6px" class="iconfont icon-zhushi"></span>上传logo尺寸为1:1，格式为png、jpg大小不超过5m</div>
                    </el-form-item>
                </el-form>
            </div>
            <div class="btn ub ub-pc">
                <el-button style="width:120px"  v-per="['base_theme_save']" type="primary" size="small" @click="submitThemeForm('themeForm')">保 存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import layout_default from '../../../assets/img/system/layout_default.png'
import layout_left from '../../../assets/img/system/layout_left.png'
import layout_top from '../../../assets/img/system/layout_top.png'
import nav_unfold from '../../../assets/img/system/nav_unfold.png'
import nav_fold from '../../../assets/img/system/nav_fold.png'
import theme_color_default from '../../../assets/img/system/theme_color_default.png'
import theme_color_purple from '../../../assets/img/system/theme_color_purple.png'
import theme_color_dark from '../../../assets/img/system/theme_color_dark.png'
import { mapMutations, mapGetters } from 'vuex'
import { get_user_system_config } from '@/server/system/security_policy.js'
import { update_subject } from '@/server/system/theme_manage.js'
export default {
    data() {
        return {
            uploadToken: {
                token: ''
                // path: '/file_logos/files/'
            },
            layoutConfigValue: '',
            navConfigValue: '',
            themeConfigValue: '',
            layoutStyle: [
                {
                    imgSrc: layout_default,
                    textOne: '布局样式',
                    textTwo: '默认',
                    typeData: 'default',
                    isActive: false
                },
                {
                    imgSrc: layout_left,
                    textOne: '布局样式',
                    textTwo: '左侧',
                    typeData: 'left',
                    isActive: false
                },
                {
                    imgSrc: layout_top,
                    textOne: '布局样式',
                    textTwo: '顶部',
                    typeData: 'top',
                    isActive: false
                }
            ],
            navStyle: [
                {
                    imgSrc: nav_unfold,
                    textOne: '导航样式',
                    textTwo: '展开',
                    typeData: false,
                    isActive: false
                },
                {
                    imgSrc: nav_fold,
                    textOne: '导航样式',
                    textTwo: '折叠',
                    typeData: true,
                    isActive: false
                }
            ],
            themeColorStyle: [
                {
                    imgSrc: theme_color_default,
                    textOne: '主题颜色',
                    textTwo: '默认',
                    typeData: 'default',
                    isActive: false
                },
                {
                    imgSrc: theme_color_dark,
                    textOne: '主题颜色',
                    textTwo: '黑色',
                    typeData: 'dark',
                    isActive: false
                },
                {
                    imgSrc: theme_color_purple,
                    textOne: '主题颜色',
                    textTwo: '紫色',
                    typeData: 'purple',
                    isActive: false
                }
            ],
            formLabelWidth: '150px',
            rules: {
                systemName: [
                    {
                        required: true,
                        message: '请输入系统名称',
                        trigger: 'blur'
                    }
                ],
                logoAddress: [
                    {
                        required: true,
                        message: '请输入系统名称',
                        trigger: 'blur'
                    }
                ]
            },
            // 上传相关
            themeForm: {
                id: '',
                systemName: '',
                logoAddress: ''
            },
            logoSrc: '',
            path: {
                path: '/file_logos/files/'
            }
        }
    },
    computed: {
        ...mapGetters(['layoutModeSettings', 'themeSettings'])
    },
    mounted() {
        this.navConfigValue = this.$store.getters.navCollapseSettings
        this.getToken()
        this.initTheme()
        // this.layoutConfigValue = localStorage.getItem('layoutConfigValue')
    },
    methods: {
        ...mapMutations({
            changeSetting: 'settings/changeSetting',
            setLogo: 'common/setLogo',
            setName: 'common/setName'
        }),
        getToken() {
            let initInfo = this.$getlocalStorage('initInfo')
            this.uploadToken.token = initInfo.user.token
        },
        initTheme() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            get_user_system_config(data)
                .then(res => {
                    this.setLayout(res.style)
                    this.setColor(res.colour)
                    this.themeForm.id = res.id
                    this.themeForm.systemName = res.systemName
                    this.themeForm.logoAddress = res.logoAddress

                    this.logoSrc = '/api/base-server/file/download' + encodeURI(encodeURI(res.logoAddress)) + '?token=' + this.$getlocalStorage('initInfo').user.token
                })
                .catch(error => {
                    console.log('error' + error)
                })
        },
        styleNum(val) {
            if (val === 'default') {
                return 1
            } else if (val === 'left') {
                return 2
            } else if (val === 'top') {
                return 3
            }
        },
        colourNum(val) {
            if (val === 'default') {
                return 1
            } else if (val === 'dark') {
                return 2
            } else if (val === 'purple') {
                return 3
            }
        },
        setLayout(style) {
            if (style === 1) {
                this.layoutConfigValue = 'default'
            } else if (style === 2) {
                this.layoutConfigValue = 'left'
            } else if (style === 3) {
                this.layoutConfigValue = 'top'
            }
            this.changeSetting({
                key: 'layoutModeSettings',
                value: this.layoutConfigValue
            })
        },
        setColor(colour) {
            if (colour === 1) {
                this.themeConfigValue = 'default'
            } else if (colour === 2) {
                this.themeConfigValue = 'dark'
            } else if (colour === 3) {
                this.themeConfigValue = 'purple'
            }
            this.changeSetting({
                key: 'themeSettings',
                value: this.themeConfigValue
            })
        },
        selectLaylout(item, index) {
            if (this.layoutConfigValue == item.typeData) return
            this.layoutConfigValue = item.typeData
            localStorage.setItem('layoutConfigValue', item.typeData)
            this.changeSetting({
                key: 'layoutModeSettings',
                value: item.typeData
            })
        },
        selectNav(item, index) {
            if (this.navConfigValue === item.typeData) return
            this.navConfigValue = item.typeData
            this.changeSetting({
                key: 'navCollapseSettings',
                value: item.typeData
            })
        },
        selectThemeColor(item, index) {
            if (this.themeConfigValue === item.typeData) return
            this.themeConfigValue = item.typeData
            this.changeSetting({
                key: 'themeSettings',
                value: item.typeData
            })
        },
        // 上传图片相关
        limitFun(files, fileList) {
            this.$message({
                message: '附件只能上传一份！',
                type: 'warning'
            })
        },
        // beforeUpload() {
        //     this.uploading = this.$loading({
        //         lock: true,
        //         text: '上传中...',
        //         spinner: 'el-icon-loading',
        //         background: 'rgba(0, 0, 0, 0.7)'
        //     })
        // },
        uploadFileSuccess(response, file, fileList) {
            console.log('response', response)
            // this.uploading.close()
            if (response.code == 1) {
                this.$message({
                    message: '附件上传成功!',
                    type: 'success'
                })
                var path = response.data
                this.themeForm.logoAddress = path
                this.logoSrc = '/api/base-server/file/download' + encodeURI(encodeURI(path)) + '?token=' + this.$getlocalStorage('initInfo').user.token
                this.setLogo(path)
                console.log('图片地址' + this.logoSrc)
            } else {
                this.$message({
                    message: response.message,
                    type: 'warning'
                })
            }
        },
        uploadFileError(obj) {
            // this.uploading.close()
            this.$message({
                message: '上传失败！请重新上传。',
                type: 'warning'
            })
            console.log('error', obj)
        },
        beforeAvatarUpload(file) {
            let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
            const extension = testmsg === 'jpg' || testmsg === 'JPG' || testmsg === 'png' || testmsg === 'PNG' || testmsg === 'jpeg' || testmsg === 'JPEG'
            const isLt50M = file.size / 1024 / 1024 < 5
            if (!extension) {
                this.$message({
                    message: '上传图片只能是jpg / png 格式!',
                    type: 'error'
                })
                return false // 必须加上return false; 才能阻止
            }
            console.log(file)
            if (!isLt50M) {
                this.$message({
                    message: '上传文件大小不能超过 5MB!',
                    type: 'error'
                })
                return false
            }
            return extension || isLt50M
        },
        submitThemeForm(formName) {
            // let themeInfo = this.$getlocalStorage('themeInfo')
            // if (this.themeForm.logoAddress === '') {
            //     this.themeForm.logoAddress = themeInfo === '' ? '' : themeInfo.logoAddress
            // }
            // if (this.themeForm.logoAddress === '') {
            //     this.themeForm.logoAddress = themeInfo === '' ? '' : themeInfo.logoAddress
            // }
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let data = {
                        queryData: {},
                        paramsData: {
                            id: this.themeForm.id,
                            style: this.styleNum(this.layoutConfigValue),
                            colour: this.colourNum(this.themeConfigValue),
                            systemName: this.themeForm.systemName,
                            logoAddress: this.themeForm.logoAddress
                        }
                    }
                    update_subject(data)
                        .then(res => {
                            this.setName(this.themeForm.systemName)
                            document.title = this.themeForm.systemName ?? ''
                            // this.themeDialog = false
                            // this.$setlocalStorage('themeInfo', data.paramsData)
                            // if (this.themeForm.type === 0) {
                            //     this.$store.commit('switchTheme', 'black-theme')
                            // } else if (this.themeForm.type === 1) {
                            //     this.$store.commit('switchTheme', 'white-theme')
                            // } else {
                            //     this.$store.commit('switchTheme', 'black-theme')
                            // }
                            // if (this.themeForm.logoAddress) {
                            //     this.$store.commit('setlogoAddress', this.themeForm.logoAddress)
                            // }
                            // if (this.themeForm.logoAddress) {
                            //     this.$store.commit('setlogoAddress', this.themeForm.logoAddress)
                            // }
                            this.$message({
                                message: '设置成功',
                                type: 'success'
                            })
                        })
                        .catch(error => {
                            // this.themeDialog = false
                            console.log(error + 'error')
                        })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
  .theme-manage {
    .content {
      //   width: 100%;
      //   background: #fff;
      //   box-shadow: 0px 0px 10px 0px rgba(41, 48, 66, 0.1);
      //   border-radius: 4px;
      //   box-sizing: border-box;
      padding: 40px 178px 24px 178px;
      .title {
        font-family: PingFangSC-Medium;
        text-align: center;
        font-size: 20px;
        line-height: 28px;
        color: rgba(0, 0, 0, 0.9);
        margin-bottom: 8px;
      }
      .subhead {
        text-align: center;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.6);
        margin-bottom: 32px;
      }
      .line {
        margin-bottom: 24px;
      }
      .layout-style {
        display: flex;
        margin-bottom: 54px;
        .cell {
          width: 300px;
          height: 240px;
          background-color: #ffffff;
          box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
          border-radius: 6px;
          border: solid 1px #dddddd;
          margin-right: 40px;
          box-sizing: border-box;
          padding: 10px 10px 24px 10px;
          &:last-child {
            margin-right: 0;
          }
          &:hover {
            cursor: pointer;
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
          }
          &:hover .text-sum .text-one {
            color: $high-color;
          }
          &:hover .text-sum .text-two {
            color: $high-color;
          }
          &.active {
            cursor: pointer;
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
            border-color: $high-color;
            position: relative;
          }
            &.active::before {
                font-family: iconfont;
                content: '\e7e6';
                position: absolute;
                right: 5px;
                top: 5px;
                color: $high-color;
            }
          &.active .text-sum .text-one {
            color: $high-color;
          }
          &.active .text-sum .text-two {
            color: $high-color;
          }
          .image {
            width: 280px;
            height: 164px;
            margin-bottom: 20px;
          }
          .text-sum {
            font-size: 12px;
            text-align: center;
            .text-one {
              color: #999;
            }
            .text-two {
              color: #191919;
            }
          }
        }
        .top-disabled {
            // cursor: not-allowed !important;
            pointer-events: none!important;
           border-color: rgba(0, 0, 0, 0)!important;
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0)!important;
           &.active::before {
                content: '';
            }
            .image{
                opacity: 0.5;
            }
          .text-sum {
            .text-one {
              color: #999 !important;
              opacity: 0.5;
            }
            .text-two {
              color: #191919 !important;
              opacity: 0.5;
            }
          }
        }
      }
      .form {
        margin-bottom: 64px;
        .upload-tip {
          margin-top: 8px;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.26);
          line-height: 20px;
          .iconfont {
              font-size: 12px;
          }
        }
      }
    }
    .el-divider--horizontal {
      margin: 10px 0;
    }
    .el-divider__text,
    .el-link {
      font-weight: normal;
      font-size: 12px;
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .el-upload__tip {
      font-size: 12px;
      color: #bebebe;
      line-height: 20px;
      margin-top: 8px;
    }
    // ::v-deep .el-upload--picture-card {
    //   width: 120px;
    //   height: 120px;
    //   line-height: 118px;
    // }
    ::v-deep .el-upload-dragger {
        width: 120px;
        height: 120px;
        .el-icon-plus {
            margin-top: 40px;
            font-size: 16px;
            color: #387DEE;
        }
        .text {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.9);
            line-height:20px
        }
        &:hover .text{
            color: #387DEE
        }

    }
    ::v-deep.el-form--label-top .el-form-item__label {
        font-size: 12px;
    }
    ::v-deep .el-input--small .el-input__inner {
        font-size: 12px;
    }
  }
</style>
<style>
  /* .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap > .el-form-item__label:before,
  .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
    content: '';
    color: #f56c6c;
    margin-right: 0;
  }
  .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap > .el-form-item__label:before,
  .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label::after {
    content: '*';
    color: #f56c6c;
  } */
</style>
