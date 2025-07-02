type UserDetails = {
  id:number,
  firstname: string;
  lastname: string;
  email: string;
  balance: number | null;
  budget: number | null;
};

type BalanceChartData = {
  balance: number;
  dates: any;
};

type PieChartData = {
  total: number;
  category: string;
  fill: string | undefined;
};

type featuresData = {
  title: string;
  descrption: string;
};

type Records = {
  transid: number;
  transtype: "income" | "expense";
  category: string;
  subcategory: string;
  note: string;
  payer: string;
  dates: Date;
  times: string;
  balance: number;
  userid: number;
  value: number;
};

type ChartData = {
  date: string;
  income?: number;
  expense?: number;
  balance?: number;
};

type BalanceData = {
  dates: string;
  balance: number;
};

type RecordFormData = {
  transid: number;
  userId: number;
  transType: 'income' | 'expense';
  category: string;
  subCategory : string;
  date: string;
  time: string;
  value: number;
  payer: string;
  note:string;
};