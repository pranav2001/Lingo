import { formatRelative } from "date-fns";
const convertToMsgTime=(date)=>{
    return formatRelative(date, new Date())
}
export default convertToMsgTime;
