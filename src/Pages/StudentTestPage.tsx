import { IResult, ITest } from "../types/api";
import { apiGet, apiPost } from "../utls/api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const StudentTestPage = () => {
  const [isLoading, setIsLocaing] = useState(false);
  const [test, setTest] = useState<ITest | undefined>(undefined);
  const [time, setTime] = useState(-1);
  const [studentsAnswers, setStudentAnswers] = useState<{
    questionId: number;
    answerId: number;
    answer: number;
  }[]>([]);
  const { keyCode, studentName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => await apiGet<ITest[]>("http://localhost:3000/tests");
    try {
      fetchTests().then((tests) => {
        const test = tests.find((test: ITest) => test.keyCode === keyCode);
        if (test) {
          setTest(test);
                  console.log(test.time);
          setTime(test.time);
        }
      });
    } catch (error) {
      console.log(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (time === 1) {
        validateTest();
      }
      if (time > -1) setTime((seconds) => seconds - 1);
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  const validateTest = async () => {
    setIsLocaing(true)
    const result = (studentsAnswers.filter((answer) => answer.answerId === answer.answer).length)/(test?.questions.length || 1)*100
    try {
      const results = await apiGet<IResult[]>("http://localhost:3000/results");
      if(results && test?.id){
        var date = new Date();
        var dateStr =
          ("00" + (date.getMonth() + 1)).slice(-2) +
          "/" +
          ("00" + date.getDate()).slice(-2) +
          "/" +
          date.getFullYear() +
          " " +
          ("00" + date.getHours()).slice(-2) +
          ":" +
          ("00" + date.getMinutes()).slice(-2) +
          ":" +
          ("00" + date.getSeconds()).slice(-2);

        await apiPost<void, IResult>("http://localhost:3000/results", {
          date: dateStr,
          result: Math.floor(result),
          studentName: studentName || "",
          testId: test?.id,
        });
        navigate(`./${result}`);
      }
    } catch (error) {
      
    }
    setIsLocaing(false);
  }

  if (!test) return <></>;

  return (
    <div className="test">
      <div className="flex-between">
        <h2>Tytuł: {test.title}</h2>
        <h2>Student: {studentName}</h2>
      </div>
      <div className="flex-between">
        <h3>Test: {test.keyCode}</h3>
        <h3>
          Czas:{" "}
          {Math.floor(time / 60) < 10
            ? `0${Math.floor(time / 60)}`
            : Math.floor(time / 60)}
          :{time % 60 < 10 ? `0${time % 60}` : time % 60}
        </h3>
      </div>

      {test.questions.map((question) => (
        <div key={question.questionId}>
          <fieldset
            className="fieldset"
            onChange={({ target }) => {
              // @ts-ignore
              const { answerid, questionid } = target.dataset;
              const answerId = Number(answerid);
              const questionId = Number(questionid);

              const squestion = studentsAnswers.find(
                (a) => a.questionId === questionId
              );
              console.log(squestion);
              if (squestion) {
                // @ts-ignore
                setStudentAnswers((state) => {
                  return state
                    .map((item) => {
                      if (
                        item.questionId === questionId &&
                        item.answerId === answerId
                      ) {
                        return undefined;
                      } else if (item.questionId === questionId) {
                        item.answerId = answerId;
                      }
                      return item;
                    })
                    .filter((item) => !!item);
                });
              } else {
                setStudentAnswers((state) => [
                  ...state,
                  {
                    questionId: questionId,
                    answerId: answerId,
                    answer: question.answer,
                  },
                ]);
              }
            }}
          >
            <legend>{question.title}</legend>
            {question.answers.map((answer) => (
              <div key={answer.id} style={{ display: "flex" }}>
                <input
                  type="checkbox"
                  data-answerId={`${answer.id}`}
                  data-questionId={`${question.questionId}`}
                  disabled={isLoading}
                  name={question.title}
                  checked={
                    !!studentsAnswers.find(
                      (item) =>
                        item.answerId === answer.id &&
                        item.questionId === question.questionId
                    )
                  }
                />
                <label htmlFor={question.title}>{answer.title}</label>
              </div>
            ))}
          </fieldset>
        </div>
      ))}
      <button onClick={validateTest} disabled={isLoading}>
        Zakończ test
      </button>
    </div>
  );
};


