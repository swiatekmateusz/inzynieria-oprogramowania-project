
export interface IUser {
  id: number;
  name: string;
  password: string;
}

export interface IAnswer {
  id: number;
  title: string
}

export interface IQuestion {
  questionId: number;
  answer: number;
  title: string;
  answers: IAnswer[]
}

export interface IResult {
  id?: number;
  studentName: string;
  result: number;
  date: string;
  testId: number;
}

export interface ITest {
  id?: number;
  time: number;
  title: string;
  keyCode: string;
  questions: IQuestion[];
}