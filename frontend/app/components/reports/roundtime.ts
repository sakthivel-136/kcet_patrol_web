// app/components/reports/roundtime.ts

export interface RoundTime {
  start: string;
  end: string;
}

export const ROUND_TIMES: Record<number, RoundTime> = {

  1:{start:"12:00 AM",end:"1:00 AM"},
  2:{start:"1:00 AM",end:"2:00 AM"},
  3:{start:"2:00 AM",end:"3:00 AM"},
  4:{start:"3:00 AM",end:"4:00 AM"},
  5:{start:"4:00 AM",end:"5:00 AM"},
  6:{start:"5:00 AM",end:"6:00 AM"},
  7:{start:"6:00 AM",end:"7:00 AM"},
  8:{start:"7:00 AM",end:"8:00 AM"},
  9:{start:"8:00 AM",end:"9:00 AM"},
 10:{start:"9:00 AM",end:"10:00 AM"},
 11:{start:"10:00 AM",end:"11:00 AM"},
 12:{start:"11:00 AM",end:"12:00 PM"},
 13:{start:"12:00 PM",end:"1:00 PM"},
 14:{start:"1:00 PM",end:"2:00 PM"},
 15:{start:"2:00 PM",end:"3:00 PM"},
 16:{start:"3:00 PM",end:"4:00 PM"},
 17:{start:"4:00 PM",end:"5:00 PM"},
 18:{start:"5:00 PM",end:"6:00 PM"},
 19:{start:"6:00 PM",end:"7:00 PM"},
 20:{start:"7:00 PM",end:"8:00 PM"},
 21:{start:"8:00 PM",end:"9:00 PM"},
 22:{start:"9:00 PM",end:"10:00 PM"},
 23:{start:"10:00 PM",end:"11:00 PM"},
 24:{start:"11:00 PM",end:"12:00 AM"},
};
