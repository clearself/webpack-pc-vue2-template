import request from '@/utils/server'
// form表单五返回code
var getAjaxVal = result => {
    return new Promise((resolve, reject) => {
        if (result.status == 200) {
            resolve('success')
        } else {
            // eslint-disable-next-line no-undef
            Message({
                message: result.data.message,
                type: 'warning'
            })
            reject(result.data)
        }
    })
}

// 获取赛事配置信息
export const get_match_sets = (data) => {
    return request({
        url: 'defense-drill/manage/gameEvent/getDeployInfo',
        method: 'get',
        params: data
    })
}
// 获取赛事组织列表
export const get_match_group = (data) => {
    return request({
        url: 'defense-drill/manage/gameEvent/getTissueList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取赛事裁判列表
export const get_match_referee = (data) => {
    return request({
        url: 'defense-drill/manage/gameEvent/page',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 发布赛事
export const public_match = (data) => {
    return request({
        url: 'defense-drill/manage/gameEvent/addGameEvent',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 发布赛事
export const edit_match = (data) => {
    return request({
        url: 'defense-drill/manage/gameEvent/updateGameEventInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 赛事列表
export const get_match_list = (data) => {
    return request({
        url: 'defense-drill/manage/gameEvent/findGameEventInfoList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 删除赛事
export const delete_match = (data) => {
    return request({
        url: 'defense-drill/manage/gameEvent/deleteGameEventInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 关闭赛事
export const close_match = (data) => {
    return request({
        url: 'defense-drill/manage/gameEvent/closeGameEvent',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 赛事详情
export const get_match_info = (data) => {
    return request({
        url: 'defense-drill/manage/gameEvent/getEventInfo',
        method: 'get',
        params: data
    })
}

// 获取战绩配置信息
export const get_record_sets = (data) => {
    return request({
        url: 'defense-drill/manage/record/getDeployInfo',
        method: 'get',
        params: data
    })
}

export const get_record_attrack_sets = (data) => {
    return request({
        url: 'defense-drill//manage/rehearsal/getDeployInfo',
        method: 'get',
        params: data
    })
}

// 获取所有赛事信息
export const get_all_matchs = (data) => {
    return request({
        url: 'defense-drill/manage/record/getAllGameEvent',
        method: 'get',
        params: data
    })
}
// 创建战绩
export const add_record = (data) => {
    return request({
        url: 'defense-drill/manage/record/addRecord',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取银行城市信息
export const get_bank_city = (data) => {
    return request({
        url: 'defense-drill/manage/record/getAllBankCityInfo',
        method: 'get',
        params: data
    })
}

// 查询战绩
export const get_records = (data) => {
    return request({
        url: 'defense-drill/manage/record/findRecordList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 查询战绩
export const change_attack_record = (data) => {
    return request({
        url: 'defense-drill/manage/record/modifyRecord',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 删除战绩
export const delete_record = (data) => {
    return request({
        url: 'defense-drill/manage/record/deleteRecord',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 审核战绩
export const sure_check = (data) => {
    return request({
        url: 'defense-drill/manage/record/verifyRecord',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 管理中心顶部数据
export const get_num_data = (data) => {
    return request({
        url: 'defense-drill/manage/statistics/getCountData',
        method: 'get',
        params: data
    })
}
// 管理中心获取所有赛事
export const get_all_achievement_matchs = (data) => {
    return request({
        url: 'defense-drill/manage/statistics/getAllGameEvent',
        method: 'get',
        params: data
    })
}
// 统计
export const get_statistic_data = (data) => {
    return request({
        url: 'defense-drill/manage/statistics/recordCount',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 获取小组
export const get_chat_list = (data) => {
    return request({
        url: 'defense-drill/manage/greeting/findGameEventInfoList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
/* 聊天接口*/
// 获取赛事人员列表
export const get_match_users_list = (data) => {
    return request({
        url: 'defense-drill/manage/greeting/getGameUsers',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_match_team_users_list = (data) => {
    return request({
        url: 'defense-drill/manage/greeting/getTeamUsers',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_small_team_users_list = (data) => {
    return request({
        url: 'defense-drill/manage/greeting/getSmallTeamUsers',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_teamType = (data) => {
    return request({
        url: 'defense-drill/manage/greeting/findUserTeamType',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_historyTeam = (data) => {
    return request({
        url: 'defense-drill/manage/gameEvent/findHistoryTeam',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 新郑接口
// 获取 登录账号 所在的赛事信息list
export const get_attract_defense_match_list = (data) => {
    return request({
        url: 'defense-drill/manage/rehearsal/getMyGameEvent',
        method: 'get',
        params: data
    })
}

export const get_attract_defense_match_list_select = (data) => {
    return request({
        url: 'defense-drill/manage/record/getMyGameEvent',
        method: 'get',
        params: data
    })
}
// 添加成果
export const add_attrack_defense_record = (data) => {
    return request({
        url: 'defense-drill/manage/record/addRecord',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const edit_attrack_defense_record = (data) => {
    return request({
        url: 'defense-drill/manage/record/modifyRecord',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 赛事列表
export const get_replay_match_list = (data) => {
    return request({
        url: 'defense-drill/manage/rehearsal/findRehearsalList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 赛事列表
export const add_Attrack_relay = (data) => {
    return request({
        url: 'defense-drill/manage/rehearsal/addStep',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_Attrack_defense_relay = (data) => {
    return request({
        url: 'defense-drill/manage/rehearsal/refreshStepData',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_replay_record = (data) => {
    return request({
        url: 'defense-drill/manage/rehearsal/getDefenseGainList',
        method: 'get',
        params: data
    })
}
export const edit_defense_relay = (data) => {
    return request({
        url: 'defense-drill/manage/rehearsal/modifyDefenseStep',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const edit_Attrack_relay = (data) => {
    return request({
        url: 'defense-drill/manage/rehearsal/modifyAttackStep',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const deleteReplay = (data) => {
    return request({
        url: 'defense-drill/manage/rehearsal/deleteStep',
        method: 'get',
        params: data
    })
}
export const add_say = (data) => {
    return request({
        url: 'defense-drill/manage/rehearsal/stateGain',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const voer_replay = (data) => {
    return request({
        url: 'defense-drill/manage/rehearsal/overRehearsal',
        method: 'get',
        params: data
    })
}
export const get_link = (data) => {
    return request({
        url: 'defense-drill/manage/rehearsal/linkGraph',
        method: 'post',
        data: data
    })
}
//
export const get_record_referee = (data) => {
    return request({
        url: 'defense-drill/manage/defenseReferee/findRecordList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_attrack_referee = (data) => {
    return request({
        url: 'defense-drill/manage/attackReferee/findRecordList',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const sure_attrack_check = (data) => {
    return request({
        url: 'defense-drill/manage/attackReferee/verifyRecord',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const sure_defense_check = (data) => {
    return request({
        url: 'defense-drill/manage/defenseReferee/verifyRecord',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const get_attrack_match_list = (data) => {
    return request({
        url: 'defense-drill/manage/attackReferee/getMyGameEvent',
        method: 'get',
        params: data
    })
}
export const get_defense_match_list = (data) => {
    return request({
        url: 'defense-drill/manage/defenseReferee/getMyGameEvent',
        method: 'get',
        params: data
    })
}

// 添加常用语
export const add_common_wordds = (data) => {
    return request({
        url: 'defense-drill/manage/greeting/saveWords',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_common_wordds = (data) => {
    return request({
        url: 'defense-drill/manage/greeting/getOftenWords',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const delete_common_wordds = (data) => {
    return request({
        url: 'defense-drill/manage/greeting/deleteWords',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_current_team_info = (data) => {
    return request({
        url: 'defense-drill/manage/gameEvent/findTeamUsers',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 聊天图片上传

export const chat_upload = (data) => {
    return request({
        url: 'defense-drill/manage/greeting/upload',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 导出防守方成果裁判
export const defenseRefereeExportExcel = (data) => {
    return request({
        url: 'defense-drill/manage/defenseReferee/exportExcel',
        method: 'get',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}
// 导出攻击方成果裁判
export const attackRefereeExportExcel = (data) => {
    return request({
        url: 'defense-drill/manage/attackReferee/exportExcel',
        method: 'get',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}
// 下载模板
export const recordTemplate = (data) => {
    return request({
        url: 'defense-drill/manage/record/template',
        method: 'get',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}
// 导出成果
export const recordExportExcel = (data) => {
    return request({
        url: 'defense-drill/manage/record/exportExcel',
        method: 'get',
        params: data.queryData,
        data: data.paramsData,
        responseType: 'blob'
    })
}
