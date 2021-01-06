import { DateUtc } from "../../entities/DateUtc";

export class UtilsController{

    public static stringToDateUtc(data: string, addOneDay:boolean=false):string | null{
        let dataUtc: DateUtc;
        let dt = {day:0, month:0, year:0};
        let dtList:Array<string> = UtilsController.validateDateFormat(data);
        if(dtList && dtList.length > 0){
            dt.day = parseInt(dtList[2]) + ((addOneDay)?1:0);
            dt.month = parseInt(dtList[1]) -1;
            dt.year = parseInt(dtList[0]);
            dataUtc = new DateUtc(new Date(dt.year,dt.month, dt.day));
            return dataUtc.getDate();
        }
        return null;        
    }
    public static validateDateFormat(date: string):Array<string>{
        let dtList:Array<string>;
        let valid = date.match(/^(\d{4})\-(\d{1,2})\-(\d{1,2})$/);
        let validBarra = date.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
        if(date.includes("-") && valid){
            dtList = date.split("-");
        }else if(date.includes("/") && validBarra){
            dtList = date.split("/");
        }
        return dtList;
    }
}