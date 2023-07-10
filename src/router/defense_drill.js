const Layout = () => import('@/layout')
const defense_record_referee = () =>
    import('@/pages/defense_drill/defense_record_referee.vue')
const record_referee = () =>
    import('@/pages/defense_drill/record_referee.vue')
const overview = () =>
    import('@/pages/defense_drill/overview.vue')
const match_list = () =>
    import('@/pages/defense_drill/match_list.vue')
const create_match = () =>
    import('@/pages/defense_drill/match/create_match.vue')
const edit_match = () =>
    import('@/pages/defense_drill/match/edit_match.vue')
const defense_detail = () =>
    import('@/pages/defense_drill/defense/attrack_detail.vue')
const attrack_detail = () =>
    import('@/pages/defense_drill/attrack/attrack_detail.vue')
const record = () =>
    import('@/pages/defense_drill/record.vue')
const create_attrack = () =>
    import('@/pages/defense_drill/attrack/create_attrack.vue')
const edit_attrack = () =>
    import('@/pages/defense_drill/attrack/edit_attrack.vue')
const defense_record = () =>
    import('@/pages/defense_drill/defense_record.vue')
const create_defense = () =>
    import('@/pages/defense_drill/defense/create_attrack.vue')
const edit_defense = () =>
    import('@/pages/defense_drill/defense/edit_attrack.vue')
const replay = () =>
    import('@/pages/defense_drill/replay.vue')
const replay_linkPicture = () =>
    import('@/pages/defense_drill/replay_linkPicture.vue')
const replay_inner = () =>
    import('@/pages/defense_drill/replay_inner.vue')
export default [
    {
        path: '/defense',
        name: 'defense',
        component: Layout,
        meta: {
            title: '演练中心'
        },
        redirect: '/defense/overview',
        children: [
            {
                path: 'record_referee',
                name: 'record_referee',
                component: defense_record_referee,
                meta: {
                    title: '防守方成果(裁判)'
                }
            },
            {
                path: 'referee',
                name: 'referee',
                component: record_referee,
                meta: {
                    title: '攻击方成果(裁判)'
                }
            },
            {
                path: 'overview',
                name: 'overview',
                component: overview,
                meta: {
                    title: '演练概览'
                }
            },
            {
                path: 'match',
                name: 'match',
                component: match_list,
                meta: {
                    title: '演练任务'
                }
            },
            {
                path: 'match/create',
                name: 'create_match',
                component: create_match,
                meta: {
                    title: '创建赛事',
                    guidePath: true,
                    jumpPath: '/defense/match'
                }
            },
            {
                path: 'match/edit',
                name: 'edit_match',
                component: edit_match,
                meta: {
                    title: '修改赛事',
                    guidePath: true,
                    jumpPath: '/defense/defense_drill_match'
                }
            },
            {
                path: 'defense_record/detail',
                name: 'defense_drill_defense_detail',
                component: defense_detail,
                meta: {
                    title: '防守方成果详情',
                    guidePath: true,
                    jumpPath: '/defense/defense_record_referee'
                }
            },
            {
                path: 'record/detail',
                name: 'defense_drill_attrack_detail',
                component: attrack_detail,
                meta: {
                    title: '攻击方成果详情',
                    guidePath: true,
                    jumpPath: '/defense/defense_drill_record'
                }
            },
            {
                path: 'record',
                name: 'record',
                component: record,
                meta: {
                    title: '攻击方成果'
                }
            },
            {
                path: 'record/create',
                name: 'defense_drill_create_attrack',
                component: create_attrack,
                meta: {
                    title: '添加攻击成果',
                    guidePath: true,
                    jumpPath: '/defense/defense_drill_record'
                }
            },
            {
                path: 'record/edit',
                name: 'defense_drill_edit_attrack',
                component: edit_attrack,
                meta: {
                    title: '编辑攻击成果',
                    guidePath: true,
                    jumpPath: '/defense/defense_drill_record'
                }
            },
            {
                path: 'defense_record',
                name: 'defense_drill_defense_record',
                component: defense_record,
                meta: {
                    title: '防守方成果'
                }
            },
            {
                path: 'defense_record/create',
                name: 'defense_drill_create_defense',
                component: create_defense,
                meta: {
                    title: '添加防守成果',
                    guidePath: true,
                    jumpPath: '/defense/defense_record'
                }
            },
            {
                path: 'defense_record/edit',
                name: 'defense_drill_edit_defense',
                component: edit_defense,
                meta: {
                    title: '编辑防守成果',
                    guidePath: true,
                    jumpPath: '/defense/defense_record'
                }
            },
            {
                path: 'replay',
                name: 'replay',
                component: replay,
                meta: {
                    title: '演练复盘'
                }
            },
            {
                path: 'replay/link',
                name: 'defense_drill_replay_linkPicture',
                component: replay_linkPicture,
                meta: {
                    title: '查看链路图',
                    guidePath: true,
                    jumpPath: '/defense/replay'
                }
            },
            {
                path: 'replay/inner',
                name: 'defense_drill_replay_inner',
                component: replay_inner,
                meta: {
                    title: '演练复盘',
                    guidePath: true,
                    jumpPath: '/home/replay'
                }
            }
        ]
    }
]
