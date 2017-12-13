<template>
  <div>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <el-button v-on:click="toAdd('add')">添加用户</el-button>
    </p>
    <p>
      <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit
                highlight-current-row>
        <el-table-column align="center" label='ID' width="95" >
          <template slot-scope="scope">
            {{scope.$index}}
          </template>
        </el-table-column>
        <el-table-column label="loginid">
          <template slot-scope="scope">
            {{scope.row.loginid}}
          </template>
        </el-table-column>
        <el-table-column label="name">
          <template slot-scope="scope">
            {{scope.row.name}}
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
        <el-table-column label="添加人">
          <template slot-scope="scope">
            {{scope.row.addUser}}
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
          <input value="删除" type="button" class="el-button" v-on:click="toDelete(scope.row.name)"/>
        </span>
          </template>
        </el-table-column>
      </el-table>
    </p>

    <el-dialog :title="dialogMap[dialogStatus]" :visible.sync="dialogFormVisible">

      <el-form  :model="tmp_object" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="loginid">
          <el-input type="text" v-model="tmp_object.loginid"/>
        </el-form-item>
        <el-form-item label="name">
          <el-input type="text" v-model="tmp_object.name"/>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="tmp_object.desc" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="tmp_object.status" placeholder="请选择">
            <el-option  :label="'有效'" :value="'VALID'"></el-option>
            <el-option :label="'无效'" :value="'INVALID'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-button size="mini" @click="checkRoles">配置角色</el-button>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save()">确 定</el-button>
      </div>
    </el-dialog >
    <el-dialog :title="'是否确认删除'+operateTitle+'?'" :visible.sync="dialogDeleteVisible" :width="'30%'">
      <el-button v-on:click="remove(operateTitle)">确认</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <el-button v-on:click="dialogDeleteVisible=false">取消</el-button>
    </el-dialog>
    <el-dialog :visible.sync="tmp_object.roleDialogVisible">
      <el-transfer
        filterable
        :filter-method="filterMethod"
        :titles="['未选中的角色', '已选中的角色']"
        filter-placeholder="search"
        v-model="tmp_object.roleValues"
        :data="tmp_object.roleData">
      </el-transfer>
      <el-button type="primary" v-on:click="tmp_object.roleDialogVisible=false" style="position:relative;top:10px;left:80%;">确认</el-button>&nbsp;&nbsp;
    </el-dialog>
  </div>
</template>


<script>
  import {getList} from '@/api/permission/user.js'
  import {getList as getRoleList} from '@/api/permission/role.js'

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
        tmp_object:{
          loginid:"",
          name:"",
          LoginidReadOnly:false,
          desc:"",
          status:"",
          defaultCheckedKeys:[],
          roleDialogVisible:false,
          roleData:[],
          roleValues:[]
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
      this.initRoles()
    },
    methods: {

      fetchData() {
        this.listLoading = true
        getList(this.listQuery).then(response => {
          this.list = response.data
          this.listLoading = false
        })
      },
      initRoles(){
        //this.tmp_object.roleData=['北京','上海','天津']
        //this.tmp_object.roleData=[{label:'北京',key:1,pinyin:'bj'},{label:'上海',key:2,pinyin:'sh'},{label:'天津',key:3,pinyin:'tj'}]
        getRoleList().then(response => {
          console.log(response.data)
          response.data.forEach((role, index)=>{
            console.log(role+"    "+index);
            this.tmp_object.roleData.push( {
              label:role.name,
              key:role.id,
              pinyin:role.title
            });
          })
        });
      },
      toUpdate(data){
        console.log("toUpdate：" + data.title)
        this.dialogStatus = "update";
        this.dialogFormVisible=true;
        this.tmp_object.LoginidReadOnly=true;

        this.dialogFormVisible=true;
        this.tmp_object.loginid=data.loginid;
        this.tmp_object.name=data.name;
        this.tmp_object.desc=data.desc;
        this.tmp_object.status=data.status;

      },
      save() {
        console.log("save："+this.tmp_object.roleValues)

        this.dialogFormVisible=false

      },
      toDelete(title){
        console.log("toDelete:"+title)
        this.operateTitle = title
        this.dialogDeleteVisible = true
      },
      remove(title) {
        console.log("delete title：" + title+"  this.$router:"+this.$router)

        this.dialogDeleteVisible = false
        this.fetchData();
      },
      toAdd() {
        console.log("进入表单页面");
        this.dialogStatus = "add";
        this.dialogFormVisible=true;

        this.tmp_object.LoginidReadOnly=false;
        this.tmp_object.loginid="";
        this.tmp_object.name="";
        this.tmp_object.desc="";
        this.tmp_object.status="";

        console.log(this.$refs.module_tree)

      },
      checkRoles(){
        console.log("checkRoles")
        this.tmp_object.roleDialogVisible=true;
      },
      filterMethod(query, item){
        return item.pinyin.indexOf(query) > -1;
      }
    }
  }
</script>
<style scoped>

</style>
