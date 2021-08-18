<template>
    <div>
        <el-button type="primary" icon="el-icon-plus">添加</el-button>

        <el-table
            :data="data"
            style="width: 100%">
            <el-table-column
                prop="prop"
                label="label"
                width="width">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    name:""
}
</script>
<style lang="scss">
    
</style>