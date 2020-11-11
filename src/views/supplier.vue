<template>
  <div>
    <div>文件存储供应商列表</div>
    <el-table :data="tableData" border style="width: 90%">
      <el-table-column prop="id" label="ID" width=""> </el-table-column>
      <el-table-column prop="supplierTypeStr" label="供应商" width="">
      </el-table-column>
      <el-table-column prop="createTimeStr" label="创建时间" width="">
      </el-table-column>
      <el-table-column prop="updateTimeStr" label="更新时间" width="">
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 作业批改 -->
    <el-dialog
      :visible.sync="showEvaluationDialog"
      title="修改供应商"
      width="500px"
    >
      <el-form :model="evaForm" ref="evaForm" :rules="evaRules">
        <el-form-item label="供应商类型" prop="supplierType">
          <el-select
            v-model="evaForm.supplierType"
            placeholder="请选择"
            @change="selectChanged"
          >
            <el-option
              v-for="item in supplierTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEvaluation">保存</el-button>
          <el-button @click="showEvaluationDialog = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {getSupplierList, updateSupplier} from '@/components/supplier/supplierApi'
export default {
  data() {
    return {
      tableData: [],
      evaForm: {
        supplierType: "",
      }, //修改供应商表单对象
      showEvaluationDialog: false, // 修改供应商弹窗
      supplierTypeList: [
        {
          value: 1,
          label: "阿里云oss",
        },
        {
          value: 2,
          label: "腾讯云cos",
        },
      ],
      evaRules: {
        supplierType: [
          {
            required: true,
            message: "供应商不能为空",
            trigger: ["change"],
          },
        ],
      },
    };
  },
  mounted() {
    this.searchList();
  },
  methods: {
    searchList() {
        getSupplierList('').then((res) => {
          if(res.status === 200){
              this.tableData = res.data;
          }
          else{
            console.log(error);
          }
        })
    },
    edit(row) {
      this.showEvaluationDialog = true;
      this.evaForm.id = row.id;
      this.evaForm.supplierType = row.supplierType;
    },
    selectChanged(value) {
      console.log("value===" + value);
    },
    submitEvaluation() {
      this.$refs.evaForm.validate((valid) => {
        if (valid) {
            updateSupplier(this.evaForm).then((res) => {
              if(res.status === 200){
                  this.showEvaluationDialog = false;
                  this.searchList();
                  this.$message.success("修改成功");
              }
              else{
                this.$message.error(res.message);
              }
            })
        } else {
          return false;
        }
      });
    },
  },
}
</script>