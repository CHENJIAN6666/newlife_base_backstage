<template>
  <div class="dashboard-container">
    <img :src="img_dashboard" class="dashboard-img">
  </div>
</template>
<script>
  import img_dashboard from '@/assets/img_dashboard.jpg'
  import { Notification } from 'element-ui'
  import { hasRole } from "@/utils/hasPermission";
  import { roleConstants } from "@/utils/index";

  export default {
    name: 'dashboard',

    data() {
      return {
        img_dashboard,
        roleConstants
      }
    },
    created(){
      //清除通知
      Notification.closeAll()
    },
    mounted(){
      if(this.hasRole(this.roleConstants.SALEMANAGER)){ //销售经理
        this.getCarSalesPreDeliverAudit()
        this.getSalesOrderAudit()
        this.getCarSalesRefundAudit()
        // this.getCarSalesOrderDecorateAudit()
        this.getDefeatAudit()
      }else if(this.hasRole(this.roleConstants.AFTERSALES)){ //售后
        // this.getCarSalesOrderDecorateAudit()
      }else if(this.hasRole(this.roleConstants.FINANCE)){ //财务
        this.getCarSalesPreDeliverAudit()
        // this.getCarSalesRefundAudit()
      }else if(this.hasRole(this.roleConstants.GM)){ //总经理
        this.getCarSalesPreDeliverAudit()
        this.getCarSalesRefundAudit()
      }
    },
    methods: {
      hasRole,
      msgNotify(title,message,clickCallback){
        let notify
        let cb
        if(typeof clickCallback !== 'function'){
          cb = function(){
            notify.close()
          }
        }else{
          cb = function(){
            clickCallback()
            notify.close()
          }
        }
        notify = this.$notify({
          title: title,
          message: message,
          duration: 0,
          offset: 50,
          onClick: cb 
        })
      },
      //交车申请审核
      getCarSalesPreDeliverAudit(){
        let listQuery = {}
        listQuery.deliveryAuditState = 0
        listQuery.deliveryState ='3'
        this.api({
          url: "/carSalesPreDeliver/listCarSalesPreDeliver",
          method: "get",
          params: listQuery
        }).then(data => {
          if(this.checkListNotEmpty(data.list)){
            let that = this
            this.msgNotify('待办工作','交车申请审核',function(){
              that.$router.push("/car_sales_sale/carSalesPreDeliver")
            })
          }
				})
      },
      //订单审核
      getSalesOrderAudit(){
        let listQuery = {}
        listQuery.orderAuditable = 0
        this.api({
          url: "/carSalesOrder/listCarSalesOrder",
          method: "get",
          params: listQuery
        }).then(data => {
          if(this.checkListNotEmpty(data.list)){
            let that = this
            this.msgNotify('待办工作','订单审核',function(){
              // that.$router.push("/car_sales_sale/carSalesOrder")
              that.$router.push({ path: '/car_sales_sale/carSalesOrder', 
               query: { auditState: 0 }})
               })
          }
        });
      },
      //退款审核
      getCarSalesRefundAudit(){
        let listQuery = {}
        listQuery._refundState = 3
        this.api({
          url: "/carSalesRefund/listCarSalesRefund",
          method: "get",
          params: listQuery
        }).then(data => {
          if(this.checkListNotEmpty(data.list)){
            let that = this
            this.msgNotify('待办工作','退款审核',function(){
              that.$router.push("/car_sales_sale/carSalesRefund")
            })
          }
				})
      },
      //追加装潢审核
      getCarSalesOrderDecorateAudit(){
        let listQuery = {}
        listQuery.auditState = 2
        this.api({
          url: "/carSalesOrderDecorate/listCarSalesOrderDecorate",
          method: "get",
          params: listQuery
        }).then(data => {
          if(this.checkListNotEmpty(data.list)){
            let that = this
            this.msgNotify('待办工作','追加装潢审核',function(){
              that.$router.push("/car_sales_sale/carSalesOrderDecorate")
            })
          }
				})
      },
      //战败
      getDefeatAudit(){
        let listQuery = {}
        listQuery.notesState = 0
        listQuery.isReturnVisit = 0
        this.api({
          url: "/returnVisit/listReturnVisit",
          method: "get",
          params: listQuery
        }).then(data => {
          if(this.checkListNotEmpty(data.list)){
            let that = this
            this.msgNotify('待办工作','战败审核',function(){
              that.$router.push("/car_sales_pre/returnVisit/0")
            })
          }
        })
      },
      checkListNotEmpty(list){
        return list && list.length > 0
      },
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  @import "../../styles/mixin.scss";

  .dashboard-container {
    text-align: center;
    @include relative;
    height: calc(100vh - 50px);
    padding-top: 120px;
    background-color: #282828;
    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
      -webkit-text-fill-color: #fff !important;
    }
  }
  .dashboard-img {
    margin: 0 auto;
  }
</style>
