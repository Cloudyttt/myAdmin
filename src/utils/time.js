//日期时间补零处理
let convert = s => {
  return s < 10 ? '0' + s : s;
}

//获取当前时间
let getDate = () => {
  let myDate = new Date();
  //获取当前年
  let year = myDate.getFullYear();
  //获取当前月
  let month = myDate.getMonth() + 1;
  //获取当前日
  let date = myDate.getDate();
  let h = myDate.getHours(); //获取当前小时数(0-23)
  let m = myDate.getMinutes(); //获取当前分钟数(0-59)
  let s = myDate.getSeconds();
  //获取当前时间
  return year + '-' + convert(month) + "-" + convert(date) + " " + convert(h) + ':' + convert(m) + ":" + convert(s);
}

export default getDate
