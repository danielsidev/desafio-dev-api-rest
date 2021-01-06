
export class DateUtc{
    private data: Date;
    private day: string;    
    private month:string;
    private monthReal: number;
    private year: string;
    private hour: string;
    private minute: string;
    private second: string;

    constructor(data:Date){
        this.data      = data;        
        this.monthReal = this.data.getMonth()+1;
        this.month     = ((this.monthReal <10)?"0"+this.monthReal: this.monthReal).toString();
        this.day       = ((this.data.getDate()<10)?'0'+this.data.getDate():this.data.getDate()).toString();
        this.year      = (this.data.getFullYear()).toString();
        this.hour      = ((this.data.getHours() <10)?"0"+this.data.getHours():this.data.getHours()).toString();
        this.minute    = ((this.data.getMinutes()<10)?"0"+this.data.getMinutes():this.data.getMinutes()).toString(); 
        this.second    = ((this.data.getSeconds()<10)?"0"+this.data.getSeconds():this.data.getSeconds()).toString();
    }
    getDate():string{
        return `${this.year}-${this.month}-${this.day}`;

    }
    getDateTime():string{
        return `${this.year}-${this.month}-${this.day} ${this.hour}:${this.minute}:${this.second}`;
    }

    public getDay(): string {
        return this.day;
    }
    public getMonth(): string {
        return this.month;
    }
    public getYear(): string {
        return this.year;
    }
    public getHour(): string {
        return this.hour;
    }
    public getMinute(): string {
        return this.minute;
    }
    public getSecond(): string {
        return this.second;
    }
}