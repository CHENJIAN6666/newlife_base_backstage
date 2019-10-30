<template>
  <div>
    <table width="700px">
      <tr>
				<td style="text-align:center"><h2>中山市坚信汽车贸易有限公司</h2></td>
			</tr>
      <tr>
        <td style="text-align:center"><h2>购车合同</h2></td>
      </tr>
       <tr>
        <td>购车日期：_________ 年 ______月 ______日                          合同号：NO0000001</td>
      </tr>
      <tr>
        <td>买方：（全称）：{{tempModel.customerName}} </td>
      </tr>
       <tr>
        <td>卖方：（全称）： 中山市坚信汽车贸易有限公司   </td>
      </tr>
      <tr>
        <td>经买卖双方充分协商，根据国家有关法律法规，特订立本合同，以便共同遵守。</td>
      </tr>
      <tr>
        <td>购车品牌：{{tempModel.carBrandID}}    车辆型号：{{tempModel.carModelID}}</td>
      </tr>
       <tr>
        <td>数量：_____1_____ 台       颜色：{{tempModel.carColorID}}     车架码：{{tempModel.vINCode}} </td>
      </tr>
      <tr>
        <td>1、单价：￥ {{balanceFmt(tempModel.carSettlementPrice)}}人民币(小写)</td>
      </tr>
      <tr>
        <td>2、上牌费：                     保险费：</td>
      </tr>
      <tr>
        <td>3、合计金额：<span style="border:1px solid #000000;" >小写</span>￥{{balanceFmt(tempModel.receivableTotal)}} 人民币                □包牌      □净车价</td>
      </tr>
      <tr>
        <td><span style="border:1px solid #000000;" > 大写</span>￥     佰     拾     万     仟     佰      拾      元人民币</td>
      </tr>
      <tr>
        <td>4、预付款：<span style="border:1px solid #000000;" >小写</span>￥___{{balanceFmt(tempModel.receivableTotal)}}____                        
        <span style="border:1px solid #000000;" >大写</span>￥__{{convertCurrency(tempModel.receivableTotal)}}___    □现金   □转帐</td>
      </tr>
       <tr>
        <td>5、交货日期：                            交货地点：___{{tempModel.deliveryPlace}}____   </td>
      </tr>
      <tr>
        <td>（注：①本合同一式三联：1、财务（白）；2、客户（红）； 3、存根（黄），转第三者无效；②入户时需交齐车款，车款金额到帐后可提车；③买方如未按有关规定办理手续或因提交证件资料失真、不齐全导致损失，卖方概不负责）； ④任何一方若无故违约，则需向对方赔偿违约金人民币3000元； ⑤买方保证本合同所提供地址为买方有效的地址，买方承诺：卖方按概地址邮寄的文件，皆视为买方能够收到。⑥若须向厂家预定特定车型，订金不低于人民币小写￥                 元，任何一方违约则需向对方赔违约金人民币小写￥                 元。</td>
      </tr>
      <tr>
        <td>6、车牌号是否自己选 择：       □是              □否             □电话通知选好</td>
      </tr>
      <tr>
        <td>7、附件：1、含精品：     </td>
      </tr>
      <tr>
        <td> 2、含保险：</td>
      </tr>
       <tr>
        <td>3、含加装：    </td>
      </tr>
       <tr>
        <td>8、其它约定:  </td>
      </tr>
       <tr>
        <td>买方：                              （章）   卖方：中山市坚信汽车贸易有限公司（章）</td>
      </tr>
       <tr>
        <td>委托代理人：                                 委托代理人：</td>
      </tr>
       <tr>
        <td>身份证号/组织代码：                          联系电话：</td>
      </tr>
      <tr>
        <td>联系电话：                                   开户银行：中国农业银行中山开发区支行（章）</td>
      </tr>
      <tr>
        <td>客户详细地址：                               公司账号：44319101040013320 </td>
      </tr
      ><tr>
        <td>温馨提示：请客户妥善保管此合同，提车时凭单取车，卖方将回收此单。</td>
      </tr>
      <tr>
        <td>第一联：财务（白）         第二联：客户（红）           第三联：存根（黄）</td>
      </tr>
    </table>
	</div>
</template>

<script>
export default {
  props:['tempModel'],
  methods:{
    balanceFmt(num) {
      if (null == num || num == "") return;
      let n = this.toMoney(num);
      return n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    },
    toMoney(s) {
      return this.isMoney(s) ? parseFloat(s) : 0;
    },
    isMoney(s) {
      if (null == s || s == "") return 0;
      return /^[0-9]*(\.[0-9]{1,2})?$/.test(s);
    },
    //金额大小写转换
    convertCurrency(currencyDigits) {
      // Constants:
      if (null == currencyDigits || currencyDigits == "") return;
      var MAXIMUM_NUMBER = 99999999999.99;
      // Predefine the radix characters and currency symbols for output:
      var CN_ZERO = "零";
      var CN_ONE = "壹";
      var CN_TWO = "贰";
      var CN_THREE = "叁";
      var CN_FOUR = "肆";
      var CN_FIVE = "伍";
      var CN_SIX = "陆";
      var CN_SEVEN = "柒";
      var CN_EIGHT = "捌";
      var CN_NINE = "玖";
      var CN_TEN = "拾";
      var CN_HUNDRED = "佰";
      var CN_THOUSAND = "仟";
      var CN_TEN_THOUSAND = "万";
      var CN_HUNDRED_MILLION = "亿";
      var CN_SYMBOL = "人民币";
      var CN_DOLLAR = "元";
      var CN_TEN_CENT = "角";
      var CN_CENT = "分";
      var CN_INTEGER = "整";

      // Variables:
      var integral; // Represent integral part of digit number.
      var decimal; // Represent decimal part of digit number.
      var outputCharacters; // The output result.
      var parts;
      var digits, radices, bigRadices, decimals;
      var zeroCount;
      var i, p, d;
      var quotient, modulus;

      // Validate input string:
      currencyDigits = currencyDigits.toString();
      if (currencyDigits == "") {
        alert("Empty input!");
        return "";
      }
      if (currencyDigits.match(/[^,.\d]/) != null) {
        alert("Invalid characters in the input string!");
        return "";
      }
      if (
        currencyDigits.match(
          /^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/
        ) == null
      ) {
        alert("Illegal format of digit number!");
        return "";
      }

      // Normalize the format of input digits:
      currencyDigits = currencyDigits.replace(/,/g, ""); // Remove comma delimiters.
      currencyDigits = currencyDigits.replace(/^0+/, ""); // Trim zeros at the beginning.
      // Assert the number is not greater than the maximum number.
      if (Number(currencyDigits) > MAXIMUM_NUMBER) {
        alert("Too large a number to convert!");
        return "";
      }
      // http://www.knowsky.com/ Process the coversion from currency digits to characters:
      // Separate integral and decimal parts before processing coversion:
      parts = currencyDigits.split(".");
      if (parts.length > 1) {
        integral = parts[0];
        decimal = parts[1];
        // Cut down redundant decimal digits that are after the second.
        decimal = decimal.substr(0, 2);
      } else {
        integral = parts[0];
        decimal = "";
      }
      // Prepare the characters corresponding to the digits:
      digits = new Array(
        CN_ZERO,
        CN_ONE,
        CN_TWO,
        CN_THREE,
        CN_FOUR,
        CN_FIVE,
        CN_SIX,
        CN_SEVEN,
        CN_EIGHT,
        CN_NINE
      );
      radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
      bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
      decimals = new Array(CN_TEN_CENT, CN_CENT);
      // Start processing:
      outputCharacters = "";
      // Process integral part if it is larger than 0:
      if (Number(integral) > 0) {
        zeroCount = 0;
        for (i = 0; i < integral.length; i++) {
          p = integral.length - i - 1;
          d = integral.substr(i, 1);
          quotient = p / 4;
          modulus = p % 4;
          if (d == "0") {
            zeroCount++;
          } else {
            if (zeroCount > 0) {
              outputCharacters += digits[0];
            }
            zeroCount = 0;
            outputCharacters += digits[Number(d)] + radices[modulus];
          }
          if (modulus == 0 && zeroCount < 4) {
            outputCharacters += bigRadices[quotient];
          }
        }
        outputCharacters += CN_DOLLAR;
      }
      // Process decimal part if there is:
      if (decimal != "") {
        for (i = 0; i < decimal.length; i++) {
          d = decimal.substr(i, 1);
          if (d != "0") {
            outputCharacters += digits[Number(d)] + decimals[i];
          }
        }
      }
      // Confirm and return the final output string:
      if (outputCharacters == "") {
        outputCharacters = CN_ZERO + CN_DOLLAR;
      }
      if (decimal == "") {
        outputCharacters += CN_INTEGER;
      }
      //outputCharacters = CN_SYMBOL + outputCharacters;
      outputCharacters = outputCharacters;
      return outputCharacters;
    } //
  }
}
</script>
