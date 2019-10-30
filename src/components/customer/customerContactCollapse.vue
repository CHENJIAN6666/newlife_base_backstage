<template>
  <el-collapse v-model="collapseActiveNames">

    <el-collapse-item name="0">
       <template slot="title">
       <i class="header-icon el-icon-info"></i> 
       </template>

      <el-row>
      <el-col :span="7">
              <el-form-item label="客户" prop="customerID">
                <customInput v-model="tempModel.customerID"></customInput>
              </el-form-item>

              <el-form-item label="联系人等级" prop="contactLevel">
                <dictSelect v-model="tempModel.contactLevel" dictTypeCode="ContactLevel" ></dictSelect>
              </el-form-item>

              <el-form-item label="是否主要联系人" prop="isMain">
                  <el-radio v-model="tempModel.isMain" :label="0">否</el-radio>
                  <el-radio v-model="tempModel.isMain" :label="1">是</el-radio>
              </el-form-item>

              <el-form-item label="不接受短信" prop="notAcceptSms">
                  <el-radio v-model="tempModel.notAcceptSms" :label="0">否</el-radio>
                  <el-radio v-model="tempModel.notAcceptSms" :label="1">是</el-radio>
              </el-form-item>
      </el-col>
      <el-col :span="7" :offset="1">

              <el-form-item label="联系人姓名" prop="contactName">
                <el-input type="text" v-model="tempModel.contactName">
                </el-input>
              </el-form-item>
              <!-- <el-form-item label="性别" prop="sex">
                <dictSelect v-model="tempModel.sex" dictTypeCode="Sex" ></dictSelect>
              </el-form-item>
              <el-form-item label="婚姻" prop="marriage">
              <dictSelect v-model="tempModel.marriage" dictTypeCode="Marriage" ></dictSelect>
              </el-form-item> -->
              <el-form-item label="联系人手机" prop="mobile">
                <el-input type="text" v-model="tempModel.mobile">
                </el-input>
              </el-form-item>
              <el-form-item label="联系人固定电话" prop="telephone">
                <el-input type="text" v-model="tempModel.telephone">
                </el-input>
              </el-form-item>
              <el-form-item label="不接受回访" prop="notAcceptReturnVisit">
                  <el-radio v-model="tempModel.notAcceptReturnVisit" :label="0">否</el-radio>
                  <el-radio v-model="tempModel.notAcceptReturnVisit" :label="1">是</el-radio>
              </el-form-item>
      </el-col>
      <el-col :span="7" :offset="1">
              <el-form-item label="证件类型" prop="iDType">
                <dictSelect v-model="tempModel.iDType" dictTypeCode="ID_Type"></dictSelect>
              </el-form-item>
              <el-form-item label="证件号码" prop="iDNumber">
                <el-input type="text" v-model="tempModel.iDNumber">
                </el-input>
              </el-form-item>
              <el-form-item label="换证日" prop="exchangeDate">
                <el-date-picker type="date" placeholder="选择日期" v-model="tempModel.exchangeDate" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
              <el-form-item label="备注" prop="remarks">
                <el-input type="text" v-model="tempModel.remarks">
                </el-input>
              </el-form-item>
      </el-col>
    </el-row>
    </el-collapse-item>
      <el-collapse-item name="1">
          <template slot="title">
            <i class="header-icon el-icon-info"></i> 
          </template>

          <el-row>
          <el-col :span="7">
                  <el-form-item label="生日" prop="birthday">
                    <el-date-picker type="date" placeholder="选择日期" v-model="tempModel.birthday" value-format="yyyy-MM-dd"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="年龄" prop="age">
                    <el-input type="text" v-model="tempModel.age">
                    </el-input>
                  </el-form-item>
                  <el-form-item label="区域" prop="region">
                    <dictSelect v-model="tempModel.region" dictTypeCode="Region" ></dictSelect>
                  </el-form-item>
                  <el-form-item label="地址" prop="address">
                    <el-input type="text" v-model="tempModel.address">
                    </el-input>
                  </el-form-item>
                  <el-form-item label="邮政编码" prop="postalCode">
                    <el-input type="text" v-model="tempModel.postalCode">
                    </el-input>
                  </el-form-item>
          </el-col>

          <el-col :span="7" :offset="1">
                  <el-form-item label="学历" prop="education">
                    <dictSelect v-model="tempModel.education" dictTypeCode="Education"></dictSelect>
                  </el-form-item>
                  <el-form-item label="专业" prop="major">
                    <dictSelect v-model="tempModel.major" dictTypeCode="Major"></dictSelect>
                  </el-form-item>
                  <el-form-item label="职业" prop="occupation">
                    <dictSelect v-model="tempModel.occupation" dictTypeCode="Occupation" ></dictSelect>
                  </el-form-item>
                  <el-form-item label="工作单位" prop="workUnit">
                    <el-input type="text" v-model="tempModel.workUnit">
                    </el-input>
                  </el-form-item>
                  <el-form-item label="职务" prop="post">
                    <dictSelect v-model="tempModel.post" dictTypeCode="Post" ></dictSelect>
                  </el-form-item>
                  <el-form-item label="收入" prop="income">
                    <el-input type="text" v-model="tempModel.income">
                    </el-input>
                  </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
                  <el-form-item label="微信号" prop="wechatNumber">
                    <el-input type="text" v-model="tempModel.wechatNumber">
                    </el-input>
                  </el-form-item>
                  <el-form-item label="Email" prop="email">
                    <el-input type="text" v-model="tempModel.email">
                    </el-input>
                  </el-form-item>
                  <el-form-item label="QQ" prop="qq">
                    <el-input type="text" v-model="tempModel.qq">
                    </el-input>
                  </el-form-item>
                  <el-form-item label="消费习惯" prop="consumptionHabits">
                    <el-input type="text" v-model="tempModel.consumptionHabits">
                    </el-input>
                  </el-form-item>
                  <el-form-item label="专长" prop="expertise">
                    <dictSelect v-model="tempModel.expertise" dictTypeCode="Expertise" ></dictSelect>
                  </el-form-item>

                  <el-form-item label="兴趣爱好" prop="hobby">
                    <dictSelect v-model="tempModel.hobby" dictTypeCode="Hobby" ></dictSelect>
                  </el-form-item>
          </el-col>
        </el-row>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  name:"customerContactCollapse",
  props:['value'],
  data(){
    return {
      collapseActiveNames:['0','1'],
      tempModel:this.value,
    }
  },
  watch:{
    value(newValue){
      this.tempModel = newValue
    }
  }
}
</script>
