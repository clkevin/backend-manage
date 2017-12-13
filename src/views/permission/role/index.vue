<template>
  <div>
    <p>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <el-button v-on:click="toAdd('add')">添加角色</el-button>
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
            {{scope.row.title}}
          </template>
        </el-table-column>
        <el-table-column label="Desc" width="110" align="center">
          <template slot-scope="scope">
            {{scope.row.desc}}
          </template>
        </el-table-column>
        <!--<el-table-column label="modules" width="110" align="center">
          <template slot-scope="scope">
            <template v-for="module in scope.row.moduleNames">{{module}}&nbsp;&nbsp;</template>
          </template>
        </el-table-column>-->
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
          <input value="删除" type="button" class="el-button" v-on:click="toDelete(scope.row.title)"/>
        </span>
          </template>
        </el-table-column>
      </el-table>
    </p>

    <el-dialog :title="dialogMap[dialogStatus]" :visible.sync="dialogFormVisible">

      <el-form  :model="tmp_object" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="Title">
          <el-input type="text" v-model="tmp_object.title"/>
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
        <el-form-item label="模块">
          <el-tree
            :data="treeData"
            show-checkbox
            ref="module_tree"
            :default-checked-keys="tmp_object.defaultCheckedKeys"
            node-key="id"
          ></el-tree>
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
  </div>
</template>


<script>
  import {getList} from '@/api/permission/role.js'
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
        tmp_object:{
          title:"",
          titleReadOnly:false,
          desc:"",
          status:"",
          defaultCheckedKeys:[]
        },
        operateTitle:'',
        treeData:[{label:"tmp",children:[{label:"tmp11"},{label:"tmp2"}]}]

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
      this.initModuleTree();
    },
    methods: {
      initModuleTree() {
        getModuleList(this.listQuery).then(response => {
          console.log(response.data)
          this.treeData = response.data

          console.log(">>>>>>>>>>>>>>>>>>>>11111111111");
        })
      },
      fetchData() {
        this.listLoading = true
        getList(this.listQuery).then(response => {
          this.list = response.data
          this.listLoading = false
        })
      },
      toUpdate(data){
        console.log("toUpdate：" + data.title)
        this.dialogStatus = "update";
        this.dialogFormVisible=true;
        this.tmp_object.titleReadOnly=true;


        this.dialogFormVisible=true;
        this.tmp_object.title=data.title;
        this.tmp_object.desc=data.desc;
        this.tmp_object.status=data.status;

        //this.$refs.module_tree.setCheckedNodes([{id:3}])
        setTimeout(()=>{
          console.log(this.$refs.module_tree+"   "+data.moduleIds)
          this.$refs.module_tree.setCheckedKeys(data.moduleIds);
        },50)
      },
      save() {
        console.log("save：")
        console.log("checknode:"+this.$refs.module_tree.getCheckedNodes());

        //this.dialogStatus = "update";
        //this.$router.go("/permission/role")
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

        this.tmp_object.titleReadOnly=false;
        this.tmp_object.title="";
        this.tmp_object.desc="";
        this.tmp_object.status="";


        console.log(this.$refs.module_tree)

        //处理未渲染已赋值问题
        setTimeout(()=>{
          console.log(this.$refs.module_tree)
          this.$refs.module_tree.setCheckedNodes([]);
        },50)
        //this.$refs.module_tree.setCheckedNodes([{id:1}]);
        //this.$refs.module_tree.setCheckedKeys([1])
      }
    }
  }
</script>
<style scoped>

</style>
