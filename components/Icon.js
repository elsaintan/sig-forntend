/*
 * Icon 組件化統一管理
 */


// 這裡引入有的Icon
import Line from '@/public/icon/line.svg'
import RedBell from '@/public/icon/redBell.svg'
import ArrowLeft from '@/public/icon/arrowLeft.svg'
import Close from '@/public/icon/close.svg'
import Logout from '@/public/icon/logOut.svg'
import Success from '@/public/icon/success.svg'
import Setting from '@/public/icon/setting.svg'
import RechargeInfo from '@/public/icon/rechargeInfo.svg'
import Reserve from "@/public/icon/reserve.svg"
import Shopping from '@/public/icon/shopping.svg'
import Recharge from '@/public/icon/recharge.svg'
import Calendar from '@/public/icon/calendar.svg'
import Upload from '@/public/icon/upload.svg'
import AppointmentArrow from '@/public/icon/appointment-arrow-right.svg'


// 定義Icon的name
const iconTypes = {
  line:Line,
  redBell:RedBell,
  arrowLeft:ArrowLeft,
  close:Close,
  logout:Logout,
  success:Success,
  setting:Setting,
  rechargeInfo:RechargeInfo,
  reserve:Reserve,
  shopping:Shopping,
  recharge:Recharge,
  calendar:Calendar,
  upload:Upload,
  appointmentArrow:AppointmentArrow,
};

// 定義icon名稱和對應的引入路徑
// const iconDefinitions = [
// { name: "addCircle", path: "@public/images/icons/add-circle.svg" },
// ];

// 統一輸出組件
const IconComponent = ({ name, ...props }) => {
  let Icon = iconTypes[name];
  return <Icon {...props} />;
};

export default IconComponent;
