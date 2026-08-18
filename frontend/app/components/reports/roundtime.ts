// app/components/reports/roundtime.ts

export interface RoundTime {
  start: string;
  end: string;
}

export const ROUND_TIMES: Record<number, RoundTime> = {

  1:{start:"12:00 AM",end:"02:00 AM"},
  2:{start:"02:00 AM",end:"04:00 AM"},
  3:{start:"04:00 AM",end:"06:00 AM"},
  4:{start:"06:00 AM",end:"08:00 AM"},
  5:{start:"08:00 AM",end:"10:00 AM"},
  6:{start:"10:00 AM",end:"12:00 PM"},
  7:{start:"12:00 PM",end:"02:00 PM"},
  8:{start:"02:00 PM",end:"04:00 PM"},
  9:{start:"04:00 PM",end:"06:00 PM"},
 10:{start:"06:00 PM",end:"08:00 PM"},
 11:{start:"08:00 PM",end:"10:00 PM"},
 12:{start:"10:00 PM",end:"12:00 AM"},
};
