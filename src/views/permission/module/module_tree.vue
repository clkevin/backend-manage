<template>
  <div style="width:100%;">

    <!--提示框-->
    <div>
      <el-popover
        ref="popover"
        placement="top"
        width="160"
        v-model="visible"
        :style="delDialogStyle"
      >
        <p>是否确认删除？</p>
        <div style="text-align: right; margin: 0;">
          <el-button size="mini" type="text" @click="visible = false">取消</el-button>
          <el-button type="primary;" size="mini" @click="remove">确定</el-button>
        </div>
      </el-popover>
    </div>
    <!--按钮-->
    <div v-show="isChecked">
      <div>&nbsp;</div>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <el-button @click="toForm('insertToFront')">在"{{nodeName}}"前新增节点</el-button>
      <el-button @click="toForm('insertToEnd')">在"{{nodeName}}"后新增节点</el-button>
      <el-button @click="toForm('look')">查看"{{nodeName}}"</el-button>
      <el-button @click="toForm('update')">修改"{{nodeName}}"</el-button>
      <el-button @click="displayDel">删除"{{nodeName}}"</el-button>
    </div>
    <!--tree-->
    <div>
      <el-tree
        :data="data"
        :props="defaultProps"
        accordion
        @node-click="handleNodeClick"
        style="position:relative;left:2%;top:15px;"
      >
      </el-tree>
    </div>
    <!--form-->
    <div>
      <el-dialog :visible.sync="formVisible">
        <el-form :model="form_data" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
          <el-form-item label="Title">
            <el-input type="text" v-model="form_data.title" :disabled="form_data.titleDisabled"/>
          </el-form-item>
          <el-input type="text" v-model="nodeTitle" :hidden="true"/>
          <el-input type="text" v-model="nodeTitle" :hidden="true"/>
          <el-form-item label="Path">
            <el-input type="text" v-model="form_data.path" :disabled="form_data.pathDisabled"/>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="form_data.desc" type="textarea" :disabled="form_data.descDisabled"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="form_data.status" placeholder="请选择" :disabled="form_data.statusDisabled">
              <el-option :label="'有效'" :value="'VALID'"></el-option>
              <el-option :label="'无效'" :value="'INVALID'"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="formVisible = false">取 消</el-button>
          <el-button type="primary" @click="save()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>

</template>


<script>
  import {getModuleList} from '@/api/permission/module.js'

  export default {
    data() {
      return {
        data: [],//树的数据
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        visible: false,//删除的提示框展示状态
        checkNode: null,
        formVisible: false, //form提示框
        form_data: {
          title: '',
          titleDisabled: false,
          path: '',
          pathDisabled: false,
          desc: '',
          descDisabled: false,
          status: '',
          statusDisabled: false,
          position: 0//1-前 2-后
        },
        delDialogStyle:{
          position:'relative',
          left: '760px',
          top:'60px'
        }
      };
    },
    computed: {
      isChecked: function () {
        if (this.checkNode != null && this.checkNode != undefined) {
          return true;
        } else {
          return false;
        }
      },
      nodeName: function () {
        if (this.checkNode != null && this.checkNode != undefined) {
          return this.checkNode.label;
        } else {
          return "";
        }
      },
      nodeTitle: function () {
        if (this.checkNode != null && this.checkNode != undefined) {
          return this.checkNode.data.title;
        } else {
          return "";
        }
      }
    },
    created: function () {
      this.init();
    },
    methods: {
      init() {
        getModuleList(this.listQuery).then(response => {
          console.log(response.data)
          this.data = response.data
        })
      },
      handleNodeClick(data, node) {
        this.checkNode = node
        console.log("checkNodeName:" + node.label)
        console.log(this.checkNode)
      },
      toForm(method) {
        this.formVisible = true;
        console.log("进入表单：-" + method)
        if (method === 'look' || method === 'update') {
          console.log("开始查看节点")
          this.form_data.title = this.checkNode.data.title;
          this.form_data.titleDisabled = true;
          this.form_data.path = this.checkNode.data.path;
          this.form_data.desc = this.checkNode.data.desc;
          this.form_data.status = this.checkNode.data.status;
          if (method === 'look') {
            this.form_data.descDisabled = true;
            this.form_data.pathDisabled = true;
            this.form_data.statusDisabled = true;
          } else {
            this.form_data.descDisabled = false;
            this.form_data.pathDisabled = false;
            this.form_data.statusDisabled = false;
          }
        } else if (method === 'insertToEnd' || method === 'insertToFront') {
          console.log("method:"+method)
          this.form_data.title = '';
          this.form_data.titleDisabled = false;
          this.form_data.path = '';
          this.form_data.desc = '';
          this.form_data.status = '';
          this.form_data.descDisabled = false;
          this.form_data.pathDisabled = false;
          this.form_data.statusDisabled = false;
          if (method === 'insertToEnd') {
            this.form_data.position = 2;
          } else {
            this.form_data.position = 1;
          }
        }
      },
      save() {
        this.formVisible = false;
        console.log("save")
        //todo
        //this.$router.go("/permission/module")
        this.init();
      },
      displayDel(event){
        console.log(event.clientX+"   "+(event.clientX-50)+'px')
        this.visible=true;
        this.delDialogStyle.left=(event.clientX-150)+'px'

      },
      remove(event) {
        this.visible = false;
        //this.delDialogStyle.left='100px';
        //console.log("this.delDialogStyle.left:"+this.delDialogStyle.left)
        //todo
        //this.$router.go("/permission/module")
        this.init();
      }
    }
  };
</script>

<style scoped>

</style>



