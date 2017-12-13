<template>
  <div>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <el-button v-on:click="toForm('add')">添加树</el-button>
    </p>
    <p>
      <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit
                highlight-current-row>
        <el-table-column align="center" label='ID' width="95">
          <template slot-scope="scope">
            {{scope.$index}}
          </template>
        </el-table-column>
        <el-table-column label="Title">
          <template slot-scope="scope">
            {{scope.row.title}}
          </template>
        </el-table-column>
        <el-table-column label="Name">
          <template slot-scope="scope">
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column label="Root">
          <template slot-scope="scope">
            {{scope.row.root}}
          </template>
        </el-table-column>
        <el-table-column label="Desc" width="110" align="center">
          <template slot-scope="scope">
            {{scope.row.desc}}
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="Status" width="110" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusFilter}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" label="创建时间" style="width:20%;">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{scope.row.addTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" label="修改时间" style="width:20%;">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{scope.row.updateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190">
          <template slot-scope="scope">
            <span>
              <input value="管理" type="button" class="el-button" v-on:click="toForm(scope.row)"/>&nbsp;&nbsp;
              <input value="删除" type="button" class="el-button" v-on:click="toDelete(scope.row.title)"/>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </p>


    <el-dialog :title="dialogMap[dialogStatus]" :visible.sync="dialogFormVisible">

      <el-form :model="tmp_object" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="Title">
          <el-input type="text" v-model="tmp_object.title" v-bind:readonly="this.isUpdate"/>
        </el-form-item>
        <el-form-item label="Name">
          <el-input type="text" v-model="tmp_object.name"/>
        </el-form-item>

        <el-form-item  label="Root" v-bind:hidden="isUpdate">
          <el-input type="text" v-model="tmp_object.root" />
        </el-form-item>
        <!--该树节点，点击后的样式-->
        <el-form-item  label="form" v-bind:hidden="isUpdate">
          <el-input type="text" v-model="tmp_object.form" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="tmp_object.desc" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="tmp_object.status" placeholder="请选择">
            <el-option :label="'有效'" :value="'VALID'"></el-option>
            <el-option :label="'无效'" :value="'INVALID'"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveModule()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="'是否确认删除'+operateTitle+'?'" :visible.sync="dialogDeleteVisible" :width="'30%'">
      <el-button v-on:click="deleteModule(operateTitle)">确认</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <el-button v-on:click="dialogDeleteVisible=false">取消</el-button>
    </el-dialog>
    <el-dialog >
      <el-tree class="filter-tree" :data="data" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree"></el-tree>
    </el-dialog>
  </div>
</template>


<script>
  import {getModuleList} from '@/api/permission/module.js'

  export default {
    data() {
      return {
        list: null,
        listLoading: true,
        dialogFormVisible: false,
        dialogStatus: '',
        dialogMap: {
          update: '编辑',
          add: '创建'
        },
        dialogDeleteVisible: false,
        tmp_object: {
          title: "",
          name: "",
          root: "",
          desc: "",
          status: ""
        },
        operateTitle: '',
        data:[{
          id: 1,
          label: 'Level one 1',
          children: [{
            id: 4,
            label: 'Level two 1-1',
            children: [{
              id: 9,
              label: 'Level three 1-1-1'
            }, {
              id: 10,
              label: 'Level three 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: 'Level one 2',
          children: [{
            id: 5,
            label: 'Level two 2-1'
          }, {
            id: 6,
            label: 'Level two 2-2'
          }]
        }, {
          id: 3,
          label: 'Level one 3',
          children: [{
            id: 7,
            label: 'Level two 3-1'
          }, {
            id: 8,
            label: 'Level two 3-2'
          }]
        }]
      }
    },
    filters: {
      statusFilter(status) {
        const statusMap = {
          VALID: '有效',
          INVALID: '失效'
        }
        console.log("status:" + status)
        return statusMap[status]
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      isUpdate: function () {
        console.log("isUpdate:" + this.dialogStatus === "update")
        return this.dialogStatus === "update";
      }
    },
    methods: {
      fetchData() {
        this.listLoading = true
        getModuleList(this.listQuery).then(response => {
          this.list = response.data
          this.listLoading = false
        })
      },
      saveModule() {
        console.log("save：")
        this.dialogStatus = "update";
        this.$router.go("/permission/module")
      },
      toDelete(title) {
        this.operateTitle = title
        this.dialogDeleteVisible = true
      },
      deleteModule(title) {
        console.log("delete title：" + title + "  this.$router:" + this.$router)
        this.$router.go("/permission/module")
      },
      toForm(o) {
        console.log("进入表单页面" + o);
        this.dialogFormVisible = true;
        if (o&&o.title) {
          this.dialogStatus = "update";
          this.tmp_object.title = o.title;
          this.tmp_object.name = o.name;
          this.tmp_object.desc = o.desc;
          this.tmp_object.status = o.status;
          this.tmp_object.root = o.root;
        } else {
          this.dialogStatus = "add";
          this.tmp_object.title = "";
          this.tmp_object.name = '';
          this.tmp_object.desc = "";
          this.tmp_object.status = "";
          this.tmp_object.root = "";
        }

      }
    }
  }
</script>
<style scoped>

</style>
