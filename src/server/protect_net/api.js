import request from '@/utils/server'
import { getAjaxFile } from '@/utils/http'

// 系统列表
export const get_menu = (data) => {
    return request({
        url: 'protective-net/manage/permission/getMenu',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const add_region = (data) => {
    return request({
        url: 'protective-net/manage/seatArea/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_region = (data) => {
    return request({
        url: 'protective-net/manage/seatArea/getSeatAreas',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const clear_region = (data) => {
    return request({
        url: 'protective-net/manage/seatArea/reset',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_team = (data) => {
    return request({
        url: 'protective-net/manage/seatArea/legendPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const add_team = (data) => {
    return request({
        url: 'protective-net/manage/seatArea/saveLegend',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const delete_team = (data) => {
    return request({
        url: 'protective-net/manage/seatArea/deleteLegend',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_region_team = (data) => {
    return request({
        url: 'protective-net/manage/seatArea/getAllSeatAreaLegend',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const add_region_team = (data) => {
    return request({
        url: 'protective-net/manage/seatArea/bindSeatAreas',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 作战室-- 清空坐席
export const cleanAgent = (data) => {
    return request('protective-net/manage/seatArea/cleanAgent', {
        method: 'get',
        params: data
    })
}
export const get_screen_data = (data) => {
    return request({
        url: 'protective-net/terminal/getSeatAreas',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_screen_teams = (data) => {
    return request({
        url: 'protective-net/terminal/getAllSeatAreaLegend',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_screen_static = (data) => {
    return request({
        url: 'protective-net/terminal/numByType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 组织管理--树控组件
export const get_tree_data = (data) => {
    return request({
        url: 'protective-net/manage/organization/getTree',
        method: 'post',
        data: data
    })
}

// 组织管理--allUser
export const get_allUser = (data) => {
    return request({
        url: 'protective-net/terminal/getAllUsers',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 组织管理--添加、修改组件架构
export const add_organizationGroup = (data) => {
    return request({
        url: 'protective-net/manage/organization/save',
        method: 'post',
        data: data
    })
}

// 组织管理--删除组件架构
export const del_organizationGroup = (data) => {
    return request({
        url: 'protective-net/manage/organization/del',
        method: 'post',
        data: data
    })
}

// 组织管理--获取组织列表
export const get_organization_data = (data, page, pageSize) => {
    return request({
        url: `protective-net/manage/organization/getUser?page=${page}&pageSize=${pageSize}`,
        method: 'post',
        data: data
    })
}

// 组织管理--添加组织人员
export const add_organization_user = (data) => {
    return request({
        url: `protective-net/manage/organization/saveOrganizer`,
        method: 'post',
        data: data
    })
}

// 组织管理--编辑组织人员
export const edit_organization_user = (data) => {
    return request({
        url: `protective-net/manage/organization/saveOrganizer`,
        method: 'post',
        data: data
    })
}

// 组织管理--删除组织人员
export const del_organization_user = (data) => {
    return request({
        url: 'protective-net/manage/organization/delUser',
        method: 'post',
        data: data
    })
}
// 组织管理--删除组织人员--多选
export const del_muiti_user = (data) => {
    return request({
        url: 'protective-net/manage/organization/delUserByIds',
        method: 'post',
        data: data
    })
}

// 作战室排班--获取列表
export const get_fightSchedule_data = (data, page, pageSize) => {
    return request({
        url: `protective-net/manage/workforcemanage/page?page=${page}&pageSize=${pageSize}`,
        method: 'post',
        data: data
    })
}

// 作战室排班-- 添加
export const add_userTable = (data) => {
    return request({
        url: 'protective-net/manage/workforcemanage/save',
        method: 'post',
        data: data
    })
}

// 作战室排班-- 删除
export const del_userTable = (data) => {
    return request({
        url: 'protective-net/manage/workforcemanage/del',
        method: 'post',
        data: data
    })
}

// 作战室排班--多选删除
export const del_muti_usertable = (data) => {
    return request({
        url: 'protective-net/manage/workforcemanage/delByIds',
        method: 'post',
        data: data
    })
}

// 规则规范列表--获取列表
export const get_ruleStandard_data = (data) => {
    return request({
        url: `protective-net/manage/discilinrule/getAll`,
        method: 'post',
        data: data
    })
}

// 规则规范列表--修改规则
export const edit_ruleStandard = (data) => {
    return request({
        url: `protective-net/manage/discilinrule/update`,
        method: 'post',
        data: data
    })
}

// 导出组织架构
export const downOrganization = (data) => {
    return request({
        url: `protective-net/manage/organization/downloadByIds`,
        method: 'get',
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        data: data.paramsData,
        params: data.queryData
    }).then(result => {
        console.log(result)
        return getAjaxFile(result)
    })
}

// 导出我的任务
export const exportMyTask = (data) => {
    return request({
        url: `protective-net/manage/myTask/exportExcel`,
        method: 'get',
        responseType: 'blob',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        data: data.paramsData,
        params: data.queryData
    }).then(result => {
        console.log(result)
        return getAjaxFile(result)
    })
}

// 回收站--获取列表
export const get_recoverList = (data, page, pageSize) => {
    return request({
        url: `protective-net/manage/recovery/page?page=${page}&pageSize=${pageSize}`,
        method: 'post',
        data: data
    })
}
// 回收站--恢复
export const recoverData = (data) => {
    return request({
        url: `protective-net/manage/recovery/recover`,
        method: 'post',
        data: data
    })
}
// 我的任务--列表
export const get_myTaskData = (data) => {
    return request({
        url: `protective-net/manage/myTask/page`,
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 我的任务--处理任务
export const disposal_myTask = (data) => {
    return request({
        url: `protective-net/manage/myTask/disposal`,
        method: 'post',
        data: data
    })
}

export const get_set_time = (data) => {
    return request({
        url: 'protective-net/manage/timeSet/getTimeSet',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const add_set_time = (data) => {
    return request({
        url: 'protective-net/manage/timeSet/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_match_all = (data) => {
    return request({
        url: 'protective-net/manage/msgSet/getMsgSet',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const add_match_set = (data) => {
    return request({
        url: 'protective-net/manage/msgSet/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 告警规则设置
export const add_rule = (data) => {
    return request({
        url: 'protective-net/manage/alarmRuleConfig/save',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_alarm_type = (data) => {
    return request({
        url: 'protective-net/manage/alarmRuleConfig/getAlarmType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_rule_list = (data) => {
    return request({
        url: 'protective-net/manage/alarmRuleConfig/getAllRules',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const delete_rule = (data) => {
    return request({
        url: 'protective-net/manage/alarmRuleConfig/delete',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const start_rule = (data) => {
    return request({
        url: 'protective-net/manage/alarmRuleConfig/updateStatus',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

