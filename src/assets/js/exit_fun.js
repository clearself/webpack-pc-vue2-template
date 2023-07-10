
import router from '../../router'
const elementResizeDetectorMaker = require('element-resize-detector')// 引入监听dom变化的组件
import _ from 'lodash'
import {
    getTime,
    isClick,
    setsessionStorage,
    removesessionStorage,
    getQueryString,
    getsessionStorage,
    removelocalStorage,
    setlocalStorage,
    getlocalStorage,
    typeOf,
    hasClass,
    addClass,
    removeClass,
    uni,
    numChange,
    setCookie,
    getCookie,
    formatJSON,
    accMul,
    flatten,
    treeData,
    getAllButtons,
    uuid
} from './public_fun.js'
export default {
    version: '0.0.1',
    install: function (Vue) {
        Vue.prototype.$getTime = getTime;
        Vue.prototype.$isClick = isClick;
        Vue.prototype.$setsessionStorage = setsessionStorage;
        Vue.prototype.$removesessionStorage = removesessionStorage;
        Vue.prototype.$getQueryString = getQueryString;
        Vue.prototype.$getsessionStorage = getsessionStorage;
        Vue.prototype.$removelocalStorage = removelocalStorage;
        Vue.prototype.$setlocalStorage = setlocalStorage;
        Vue.prototype.$getlocalStorage = getlocalStorage;
        Vue.prototype.$typeOf = typeOf;
        Vue.prototype.$uni = uni;
        Vue.prototype.$accMul = accMul;
        Vue.prototype.$flatten = flatten;
        Vue.prototype.$treeData = treeData;
        Vue.prototype.$getAllButtons = getAllButtons;
        Vue.prototype.$uuid = uuid;





        Vue.prototype.$hasClass = hasClass;
        Vue.prototype.$addClass = addClass;
        Vue.prototype.$removeClass = removeClass;
        Vue.prototype.$numChange = numChange;
        Vue.prototype.$getCookie = getCookie;
        Vue.prototype.$setCookie = setCookie;
        Vue.prototype.$formatJSON = formatJSON;

        Vue.prototype.$deepCopy = (obj) => {
            let strObj = JSON.stringify(obj);
            return JSON.parse(strObj);
        };
        Vue.prototype.$NullStr = (str) => {
            if ((str + '' === '') || (str == null) || (str == undefined)) {
                return '--';
            } else {
                return str;
            }
        };
        Vue.prototype.$NullToStr = (obj) => {
            if (obj == null) {
                return '';
            } else {
                return obj;
            }
        };
        //获取当前用户有没有某个菜单权限
        /*
        @params id模块modular
        */
        Vue.prototype.$isModular = (modular) => {
            modular = modular;
            let menuUrls = getsessionStorage('menuUrls');
            if (menuUrls !== '') {
                return menuUrls.includes(modular)
            } else {
                return false;
            }
        };
        Vue.prototype.$pushRouter = (path) => {
            window.open('http://' + window.location.host + '/#' + path)
            // router.push({
            //     path:path
            // })
        };
        Vue.prototype.$goRouter = (path) => {
            router.push({
                path: path
            })
        };
        Vue.prototype.$resizeEcharts = (echart, myChart) => {

            const erd = elementResizeDetectorMaker()
            // 监听id为echart的元素 大小变化
            erd.listenTo(echart, function(element) {
              // const width = element.offsetWidth
              // const height = element.offsetHeight
              myChart.resize()
            })
          }
          Vue.prototype.$handelNum = (value) => {
            console.log('value',value)
            value = parseInt(value);
            let num;
            if(value > 9999){//大于9999显示x.xx万
                num=(Math.floor(value/1000)/10)+'万';
            }else if( value <= 9999 && value>-9999){
                num=value
            }else if(value<=-9999){//小于-9999显示-x.xx万
                num = -(Math.floor(Math.abs(value)/1000)/10)+'万';
            }
            return num;
        }
        Vue.prototype.$fakeDelay = (time) => {
            return new Promise(resolve => {
                setTimeout(resolve, time)
            })
        }
        Vue.prototype.$_ = _
    },
}
