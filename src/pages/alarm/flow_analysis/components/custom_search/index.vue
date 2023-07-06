<!-- eslint-disable no-caller -->
<template>
    <div class="custom-search" ref="selfRegion">
        <el-input
            class="custom-input"
            ref="customInput"
            size="small"
            placeholder="直接输入IP或输入单词或短语"
            v-model="inputData"
            @focus="inputFocus"
            @blur="inputBlur"
            @input="input"
            @keyup.up.native="selectUp"
            @keyup.down.native="selectDown"
            @keyup.enter.native="selectEnter">
            <!-- <template slot="prepend">
                <i style="font-size: 12px" class="iconfont icon-guizeyuju"></i>
            </template> -->
            <i v-if="type===2" @click="handleSave" slot="suffix" style="font-size: 12px;margin-right: 5px;cursor: pointer;" class="iconfont icon-wenjianjiazheqi"></i>
        </el-input>
        <transition name="el-zoom-in-top">
            <div class="select ub" v-show="selectShow" :style="getWidth()">
                <div class="select-left" id="out" ref="tagsCtn">
                    <div class="title" v-if="inputData == ''">{{ '历史记录' }}</div>
                    <div class="title" v-else>{{ '搜索提示' }}</div>
                    <div class="cell" :class="{ acitve: now == index }" @click="handleSelect(item)" @mouseenter="handleHover(item)" v-for="( item , index ) in  searchHintList" :key="index" v-html="item.name">{{  }}
                    </div>
                </div>
                <div class="select-right">
                    <div class="title">语法帮助</div>
                    <div class="grammar-help" v-for="(item,index) in grammarHelpList " :key="index">
                        <div class="cell-title">描述：</div>
                        <div class="cell-content">{{ item.describe }}</div>
                        <div class="cell-title">语法：</div>
                        <div v-for="(val,inx) in item.content" :key="inx">{{ val }}</div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="el-zoom-in-top">
            <div class="select-two" v-show="selectTwoShow">
                <div class="select-cell" @click="saveTask(1)">保存查询记录</div>
                <div class="select-cell" @click="saveTask(2)">保存离线任务</div>
                <div class="select-cell" @click="saveTask(3)">保存输出图表</div>
            </div>
        </transition>
    </div>
</template>

<script>
// import fieldAttr from '@/pages/data_center/dataAnalysis/fieldAttr'
import { getAllField, getGroupField, pageSearchHistory } from '@/server/data_manage/new_search.js'
import PinyinMatch from 'pinyin-match'

export default {
    props: {
        type: {
            type: [Number],
            default: 2
        },
        selectWidth: {
            type: [Number],
            default: 1400
        },
        auto: {
            default: false
        }
    },
    data() {
        return {
            delState: false,
            step: 23,
            now: 0,
            allData: [],
            lastField: '',
            inputData: '',
            selectTwoShow: false,
            selectShow: false,
            grammarHelpList: [],
            searchHintList: [],
            searchSumList: [],
            helpList: [
                { name: "''", describe: '用来标识字符串的开始和结束', content: ['字符串的开始和结尾需要用单引号包上', '表示这是一个整体'] },
                { name: '%%', describe: '"%" 可用于定义通配符（模式中缺少的字母）。', content: ['SELECT * FROM Persons', "WHERE City LIKE '%lon%'"] },
                { name: '=', describe: '等于', content: ['列 = 值'] },
                { name: '!=', describe: '不等于', content: ['列 != 值'] },
                { name: '>', describe: '大于', content: ['列 > 值'] },
                { name: '<', describe: '小于', content: ['列 < 值'] },
                { name: '>=', describe: '大于等于', content: ['列 >= 值'] },
                { name: '<=', describe: '小于等于', content: ['列 <= 值'] },
                {
                    name: "LIKE '%%'",
                    describe: 'LIKE表示模糊匹配',
                    content: ["LIKE '%SQL%' 将搜索在任何位置包含字母 SQL 的所有字符串（如 sssSQLsss）", "4、LIKE '_ack' 将搜索以字母 ack 结尾的所有4个字母的名称（如 jack、mack）。"]
                },
                { name: 'BETWEEN', describe: '操作符 BETWEEN ... AND... 会选取介于两个值之间的数据范围。这些值可以是数值、文本或者日期。', content: ['BETWEEN value1 AND value2'] },
                {
                    name: 'LIKE',
                    describe: 'LIKE表示模糊匹配',
                    content: [
                        "1、LIKE 'SQL%' 将搜索以字母 SQL 开头的所有字符串（如 SQLsss）。",
                        "2、LIKE '%SQL' 将搜索以字母 SQL 结尾的所有字符串（如 sssSQL）",
                        "3、LIKE '%SQL%' 将搜索在任何位置包含字母 SQL 的所有字符串（如 sssSQLsss）",
                        "4、LIKE '_ack' 将搜索以字母 ack 结尾的所有4个字母的名称（如 jack、mack）。"
                    ]
                },
                {
                    name: 'OR',
                    describe:
            'AND 和 OR 可在 WHERE 子语句中把两个或多个条件结合起来。如果第一个条件和第二个条件都成立，则 AND 运算符显示一条记录。如果第一个条件和第二个条件中只要有一个成立，则 OR 运算符显示一条记录。',
                    content: ["SELECT * FROM Persons WHERE firstname='Thomas' OR lastname='Carter'"]
                },
                {
                    name: 'AND',
                    describe:
            'AND 和 OR 可在 WHERE 子语句中把两个或多个条件结合起来。如果第一个条件和第二个条件都成立，则 AND 运算符显示一条记录。如果第一个条件和第二个条件中只要有一个成立，则 OR 运算符显示一条记录。',
                    content: ["SELECT * FROM Persons WHERE FirstName='Thomas' AND LastName='Carter'"]
                },
                {
                    name: 'NOT',
                    describe: '查询某个值不在什么范围之内、不存在的时候，可以使用NOT操作符，NOT操作符不单独使用，它经常和IN操作符、LIKE操作符、BETWEEN AND、EXISTS等一起使用。',
                    content: [
                        'NOT IN 用法',
                        "NAME NOT IN ('张三', '李四', '王五')",
                        '作用：查询姓名不等于张三、李四、王五的用户信息',
                        'NOT LIKE 用法',
                        "NAME NOT LIKE '李子%'",
                        '作用：查询姓名不是以李子开头的用户',
                        'NOT BETWEEN AND 用法',
                        'AGE NOT BETWEEN 20 AND 30',
                        '作用：查询年龄不属于20 - 30之间的用户',
                        'NOT EXISTS 用法',
                        'NOT EXISTS (SUBQUERY)',
                        '作用：用于判断当前括号中的结果是否应该返回'
                    ]
                }
            ],
            ipList: [],
            numList: [],
            historyList: []
        }
    },
    created() {
        document.addEventListener('click', e => {
            if (this.$refs.selfRegion) {
                let isSelf = this.$refs.selfRegion.contains(e.target)
                if (!isSelf) {
                    // this.selectShow = false
                    this.selectTwoShow = false
                }
            }
        })
    },
    mounted() {
        this.keyDown()
        this.$nextTick(() => {
            this.getGroupFieldData()
            this.getPageSearchHistory()
        })
    },
    methods: {
        keyDown() {
            document.onkeydown = (e) => {
                // 事件对象兼容
                // eslint-disable-next-line no-caller
                let e1 = e || event || window.event || arguments.callee.caller.arguments[0]
                // Backspace
                if (e1 && e1.keyCode == 8) {
                    this.delState = true
                } else {
                    this.delState = false
                }

                if (e1.keyCode == 38) {
                    e1.preventDefault()
                }
            }
        },
        // 向下方向键
        selectDown() {
            // if (this.inputData == '') return
            console.log('nowDown', this.now)
            // console.log('searchHintListLength', this.searchHintList[this.now])
            // 判断是否到达了最后一个 如果是则返回第一个
            if (this.now >= this.searchHintList.length - 1) {
                this.now = this.searchHintList.length - 1
                this.handleHover(this.searchHintList[this.now])
                return
            }
            this.now++
            // let data = this.allData.slice(0, -1)
            // data.push(this.searchHintList[this.now].name)
            // this.inputData = data.join(' ')
            console.log('searchHintListLength', this.searchHintList[this.now])
            this.$refs.tagsCtn.scrollTop += this.step
            this.handleHover(this.searchHintList[this.now])
            // this.inputData = this.searchHintList[this.now].name
        },
        // 向上方向键
        selectUp() {
            // 使光标一直在最后面
            // let a = this.$refs.customInput.$el.querySelector('input')
            // a.focus()
            // a.selectionEnd = this.inputData.length
            // if (this.inputData == '') return

            // 判断是否到达了第一个如果是就返回最后一个
            // if (this.now == this.searchHintList.length || this.now <= -1) { this.now = this.searchHintList.length - 1 }
            console.log('now', this.now)
            console.log('searchHintListLength', this.searchHintList[this.now])
            if (this.now <= 0) {
                this.now = 0
                this.handleHover(this.searchHintList[this.now])
                return
            }
            if (this.now >= this.searchHintList.length - 1) {
                this.now = this.searchHintList.length - 1
            }
            this.now--
            // let data = this.allData.slice(0, -1)
            // data.push(this.searchHintList[this.now].name)
            // this.inputData = data.join(' ')

            this.$refs.tagsCtn.scrollTop -= this.step
            this.handleHover(this.searchHintList[this.now])
            // this.inputData = this.searchHintList[this.now].name
        },
        selectEnter(val) {
            let data = this.allData.slice(0, -1)
            data.push(this.searchHintList[this.now].name)
            this.inputData = data.join(' ')
        },
        getWidth() {
            if (this.auto) {
                return { width: '100%' }
            } else {
                return { width: this.selectWidth + 'px' }
            }
        },
        getPageSearchHistory() {
            this.searchHintList = []
            let data = {
                queryData: {
                    page: 1,
                    pageSize: 10
                },
                paramsData: {
                    name: '',
                    typeId: ''
                }
            }
            pageSearchHistory(data)
                .then(res => {
                    console.log('历史查询字段', res)
                    if (res.records.length > 0) {
                        res.records.forEach(item => {
                            if (item.sqlStr !== '') {
                                // this.searchHintList.push({ name: item.sqlStr })
                                this.historyList.push({ name: item.sqlStr })
                            }
                        })
                    }
                })
                .catch(error => {
                    console.log(error + 'error')
                })
        },
        saveTask(val) {
            this.selectTwoShow = false
            this.$emit('saveTask', val)
        },
        handleSave() {
            this.selectTwoShow = !this.selectTwoShow
        },
        getGroupFieldData() {
            let data = {
                queryData: {},
                paramsData: {}
            }
            getGroupField(data)
                .then(res => {
                    let ipGroup, numGroup, strGroup
                    this.ipList = res.ipGroup
                    this.numList = res.numGroup
                    this.searchSumList = [...res.ipGroup, ...res.numGroup, ...res.strGroup]
                    console.log('所有字段', res)
                })
                .catch(error => {
                    console.log(error + 'error')
                })
        },
        searchIng(data) {
            this.searchHintList = []
            this.searchSumList.forEach(item => {
                if (JSON.stringify(item.name).indexOf(data) != -1) {
                    this.searchHintList.push(item)
                }
            })
            console.log('走没走', this.searchHintList)
        },
        searchIp(data) {
            this.searchHintList = []
            this.searchHintList = this.ipList.map(item => {
                return {
                    name: `${item.name}='${data}' `
                }
            })
        },
        searchNum(data) {
            this.searchHintList = []
            this.searchHintList = this.numList.map(val => {
                return {
                    name: `${val.name}='${data}' `
                }
            })
        },
        searchHistory() {
            this.searchHintList = []
            this.searchHintList = this.historyList
        },
        searchHelp(data) {
            this.grammarHelpList = []
            this.helpList.forEach(item => {
                if (item.name == data) {
                    this.grammarHelpList.push(item)
                }
            })
        },
        searchLet(data) {
            this.searchHintList = []
            this.searchSumList.forEach(item => {
                if (PinyinMatch.match(item.name, data)) {
                    this.searchHintList.push(item)
                }
            })
            console.log(this.searchHintList)
        },
        input(val) {
            this.selectShow = true
            this.getFieldLast(val)
        },
        handleSelect(val) {
            this.$refs.customInput.focus()
            let data = this.allData.slice(0, -1)
            data.push(val.name)
            this.inputData = data.join(' ')
            // this.$nextTick(() => {
            //     this.$refs.customInput.focus()
            // })
            // this.selectShow = true
        },
        handleHover(val) {
            // alert(val.name)
            this.grammarHelpList = []
            this.helpList.forEach(item => {
                if (item.name == val.name) {
                    this.grammarHelpList.push(item)
                }
            })
        },
        inputFocus() {
            this.selectShow = true
            this.getFieldLast(this.inputData)
        },
        inputBlur() {
            this.getFieldLast(this.inputData)
            setTimeout(() => {
                this.selectShow = false
            }, 1000)
        },
        getFieldLast(val) {
            // let data = val.trim().split(' ')
            let data = val.replace(/(^\s*)/g, '').split(' ')
            let targetData = data[data.length - 1]
            let allStr = data.join(' ')
            this.lastField = targetData
            this.allData = data
            // let isIPv4 = this.lastField.indexOf('.') > 0
            let isIPv4 = this.isIPv4(this.lastField)
            let isIntNum = this.isIntNum(this.lastField)
            let isHelp = this.helpCondition(this.lastField)
            let isLet = this.isLetter(this.lastField)
            if (isIPv4) {
                this.searchIp(targetData)
                console.log('ip地址')
            } else if (isIntNum) {
                this.searchNum(targetData)
                console.log('数字')
            } else if (isLet) {
                console.log('字母')
                this.searchLet(targetData)
            } else if (isHelp) {
                this.searchHelp(targetData)
            } else if (targetData) {
                this.searchIng(targetData)
                this.grammarHelpList = []
            } else if (this.inputData === '') {
                console.log('啥也没输入')
                this.searchHistory()
            } else {
                this.searchHintList = this.helpList
            }

            if (this.delState === false) {
                this.autoComple()
            }

            console.log('输入的整个数组字段', data)
            console.log('输入的整个字符串', allStr)
            console.log('输入空格后的字段', this.lastField)
            this.$emit('getData', allStr)
            // else if (this.lastField.includes('like and or')) {
            //     debugger
            //     this.searchHelp(targetData)
            // }
        },
        autoComple() {
            if (this.lastField == 'LIKE' || this.lastField == 'like') {
                let data = this.allData.slice(0, -1)
                data.push("LIKE '%%'")
                this.inputData = data.join(' ')

                setTimeout(() => {
                    let a = this.$refs.customInput.$el.querySelector('input')
                    a.focus()
                    a.selectionStart = this.inputData.length - 2
                    a.selectionEnd = this.inputData.length - 2
                }, 500)
            }
            if (this.lastField == '=') {
                let data = this.allData.slice(0, -1)
                data.push("= ''")
                this.inputData = data.join(' ')

                setTimeout(() => {
                    let a = this.$refs.customInput.$el.querySelector('input')
                    a.focus()
                    a.selectionStart = this.inputData.length - 1
                    a.selectionEnd = this.inputData.length - 1
                }, 500)
            }
            if (this.lastField == '!=') {
                let data = this.allData.slice(0, -1)
                data.push("!= ''")
                this.inputData = data.join(' ')

                setTimeout(() => {
                    let a = this.$refs.customInput.$el.querySelector('input')
                    a.focus()
                    a.selectionStart = this.inputData.length - 1
                    a.selectionEnd = this.inputData.length - 1
                }, 500)
            }

            if (this.lastField == 'BETWEEN' || this.lastField == 'between') {
                let data = this.allData.slice(0, -1)
                data.push("BETWEEN '' AND ''")
                this.inputData = data.join(' ')

                setTimeout(() => {
                    let a = this.$refs.customInput.$el.querySelector('input')
                    a.focus()
                    a.selectionStart = this.inputData.length - 8
                    a.selectionEnd = this.inputData.length - 8
                }, 500)
            }
        },
        helpCondition(val) {
            let data = false
            this.helpList.forEach(item => {
                if (item.name === val) {
                    console.log('判断条件走了吗', true)
                    data = true
                }
            })
            // if (val == 'BY') {
            //     data = true
            // }
            return data
        },
        // 判断是否为整数
        isIntNum(val) {
            let regPos = /^[0-9]*[1-9][0-9]*$/
            if (regPos.test(val)) {
                return true
            } else {
                return false
            }
        },
        isIPv4(ip) {
            let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\./
            return reg.test(ip)
        },
        // 判断是不是字母
        isLetter(val) {
            console.log(val)
            let reg = /[a-zA-Z]+/
            return reg.test(val)
        }
    }
}
</script>

<style scoped lang="scss">
  .custom-search {
    position: relative;
    margin-bottom: 10px;
    ::v-deep .el-input__suffix {
        line-height: 30px;
    }
    ::v-deep .el-input__suffix-inner:hover {
        color: #0052d9;
    }
    & ::v-deep .el-input-group__prepend {
      width: 30px;
      padding: 0;
      text-align: center;
      background: transparent;
      border: 1px solid #0052d9;
      border-right: none;
    //   box-shadow: 0px 0px 7px #389bf7 inset;
      color: #0052d9;
    }

    .select {
      position: absolute;
      top: 36px;
      z-index: 4000;
      // width: 1400px;
      height: 260px;
      background-color: #fff;
      box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      border: solid 1px #dcdcdc;
      box-sizing: border-box;

      .select-left {
        font-size: 12px;
        color: rgba(0, 0, 0, 0.9);
        box-sizing: border-box;
        padding: 10px 0px 0px 0px;
        border-right: 1px solid #dddddd;
        overflow-y: auto;
        overflow-x: hidden;
        // width: 1100px;
        width: 80%;

        .title {
          font-family: MicrosoftYaHei-Bold;
          font-size: 12px;
          line-height: 24px;
          letter-spacing: 1px;
          color: rgba(0,0,0,0.4);
          padding-left: 10px;
          //   margin-bottom: 4px;
          font-weight: bold;
        }

        .cell {
          // width: 100%;
          height: 24px;
          line-height: 24px;
          padding-left: 10px;

          &:hover {
            cursor: pointer;
            background-color:  #ECF2FE;
          }
        }
      }

      .select-right {
        overflow-y: auto;
        overflow-x: hidden;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.9);
        box-sizing: border-box;
        padding: 10px 10px 0px 10px;
        width: 300px;
        // widows: 20%;

        .title {
          font-family: MicrosoftYaHei-Bold;
          font-size: 12px;
          line-height: 24px;
          letter-spacing: 1px;
          color: rgba(0,0,0,0.4);
          font-weight: bold;
          //   margin-bottom: 10px;
        }
        .cell-title {
          font-weight: bold;
          margin-bottom: 10px;
        }
        .cell-content {
          margin-bottom: 10px;
        }
      }
    }
    .custom-input {

    }
    .select-two {
      position: absolute;
      right: 0;
      z-index: 1002;
      width: 90px;
      height: 88px;
      box-sizing: border-box;
      background-color: #fff;
    //   box-shadow: 0px 0px 10px 0px #000000, inset 0px 0px 6px 0px rgba(0, 186, 255, 0.73), inset 0px -1px 0px 0px rgba(40, 82, 124, 0.5);
      border-radius: 4px;
      border: solid 1px #dcdcdc;
      font-size: 12px;
      color:rgba(0,0,0,0.9);
      padding-top: 10px;
      .select-cell {
        text-align: center;
        width: 100%;
        height: 24px;
        line-height: 24px;
        &:hover {
          cursor: pointer;
          background-color: #ECF2FE;
          color: #0052d9;
        }
      }
    }
    .acitve {
        cursor: pointer;
        background-color:#ECF2FE;
    }
  }
</style>
