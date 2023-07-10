import request from '@/utils/server'
// 演练统计
export const getDrillStatistic = (data) => {
    return request({
        url: 'defense-drill/manage/overviewChart/getNum',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

export const getDrillBrokenLine = (data) => {
    return request({
        url: 'defense-drill/manage/overviewChart/getNumByMonth',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getAttrackRank = (data) => {
    return request({
        url: 'defense-drill/manage/overviewChart/getAttackTeamRanking',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const getDefenseRank = (data) => {
    return request({
        url: 'defense-drill/manage/overviewChart/getDefenseTeamRanking',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 演练指挥态势
export const get_screen_drill_static = (data) => {
    return request({
        url: 'defense-drill/terminal/getGameNum',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_rank_data = (data) => {
    return request({
        url: 'defense-drill/terminal/attackTeamRanking',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_attrack_result = (data) => {
    return request({
        url: 'defense-drill/terminal/getAttackResults',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_defense_data = (data) => {
    return request({
        url: 'defense-drill/terminal/getDefenseResults',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_link_data = (data) => {
    return request({
        url: 'defense-drill/terminal/linkGraph',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 成果提交分析
export const get_submit_result = (data) => {
    return request({
        url: 'defense-drill/terminal/getSubmitAnalysis',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

// 攻击手段统计
export const get_attack_way = (data) => {
    return request({
        url: 'defense-drill/terminal/getAttackModeNum',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 演练趋势
export const get_trend = (data) => {
    return request({
        url: 'defense-drill/terminal/getDrillTrend',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
// 顶部列表
export const get_topList = (data) => {
    return request({
        url: 'defense-drill/terminal/getHisTop20',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_drill_team_detail = (data) => {
    return request({
        url: 'defense-drill/terminal/attackTeamRankingInfo',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_attrack_defense_detail = (data) => {
    return request({
        url: 'defense-drill/terminal/getRecordPage',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}
export const get_matchTime = (data) => {
    return request({
        url: 'defense-drill/terminal/getGameTime',
        method: 'post',
        params: data.queryData,
        data: data.paramsData
    })
}

