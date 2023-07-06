export default {
    data() {
        return {
            tableHeight: document.body.clientHeight - 260,
            multipleSelection: [],
            total: 0,
            listLoading: false,
            listQuery: {
                page: 1,
                limit: 20
            },
            tableData: []
        }
    },
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex % 2) {
                return 'table-row2'
            } else {
                return 'table-row1'
            }
        }
    }
}
