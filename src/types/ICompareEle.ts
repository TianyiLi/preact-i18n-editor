export interface ICompareEle {
  id: number;
  fileName: string;
  expectedLocale: string;
  content: { [x: string]: string };
}
