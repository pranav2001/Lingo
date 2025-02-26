import { formatRelative } from "date-fns";
const convertToMsgTime=(date)=>{
    return formatRelative(date, new Date())
}
export default convertToMsgTime;
// console.log(formatRelative("2025-02-18T13:35:11.126Z", new Date()));