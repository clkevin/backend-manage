<template>
  <div>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <el-button v-on:click="toAdd('add')">添加模块</el-button>
    </p>
    <p>
      <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit
                highlight-current-row>
        <el-table-column align="center" label='ID' width="95" >
          <template slot-scope="scope">
            {{scope.$index}}
          </template>
        </el-table-column>
        <el-table-column label="Title">
          <template slot-scope="scope">
            <span v-if="scope.row.children && scope.row.children.length>0">+</span>
            {{scope.row.title}}
          </template>
        </el-table-column>
        <el-table-column label="Path" width="110" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.path}}</span>
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
        <el-table-column align="center" prop="created_at" label="创建时间" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{scope.row.addTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" label="修改时间" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{scope.row.updateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
        <span>
          <input value="编辑" type="button" class="el-button" v-on:click="toUpdate(scope.row)"/>&nbsp;&nbsp;
          <input value="删除" type="button" class="el-button" v-on:click="toDelete(scope.row.title)"/>
        </span>
          </template>
        </el-table-column>
      </el-table>
    </p>


    <el-dialog :title="dialogMap[dialogStatus]" :visible.sync="dialogFormVisible">

      <el-form  :model="module" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="Title">
          <el-input type="text" v-model="module.title"/>
        </el-form-item>
        <el-form-item label="Path">
          <el-input type="text" v-model="module.path"/>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="module.desc" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="module.status" placeholder="请选择">
            <el-option  :label="'有效'" :value="'VALID'"></el-option>
            <el-option :label="'无效'" :value="'INVALID'"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveModule()">确 定</el-button>
      </div>
    </el-dialog >
    <el-dialog :title="'是否确认删除'+operateTitle+'?'" :visible.sync="dialogDeleteVisible" :width="'30%'">
      <el-button v-on:click="deleteModule(operateTitle)">确认</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <el-button v-on:click="dialogDeleteVisible=false">取消</el-button>
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
        dialogDeleteVisible:false,
        module:{
          title:"",
          titleReadOnly:false,
          path:"",
          desc:"",
          status:""
        },
        operateTitle:''
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
    methods: {
      fetchData() {
        this.listLoading = true
        getModuleList(this.listQuery).then(response => {
          this.list = response.data
          this.listLoading = false
        })
      },
      toUpdate(module){
        console.log("toUpdate：" + module.title)
        this.dialogStatus = "update";
        this.dialogFormVisible=true;
        this.module.titleReadOnly=true;


        this.dialogFormVisible=true;
        this.module.title=module.title;
        this.module.path=module.path;
        this.module.desc=module.desc;
        this.module.status=module.status;
      },
      saveModule() {
        console.log("save：")
        this.dialogStatus = "update";
        this.$router.go("/permission/module")

      },
      toDelete(title){
        this.operateTitle = title
        this.dialogDeleteVisible = true
      },
      deleteModule(title) {
        console.log("delete title：" + title+"  this.$router:"+this.$router)
        this.$router.go("/permission/module")
        //this.$store.getters.router.push("/permission/module")
      },
      toAdd() {
        console.log("进入表单页面");
        this.dialogStatus = "add";
        this.dialogFormVisible=true;

        this.module.titleReadOnly=false;
        this.module.title="";
        this.module.path="";
        this.module.desc="";
        this.module.status="";
      }
    }
  }
</script>
<style scoped>

</style>
