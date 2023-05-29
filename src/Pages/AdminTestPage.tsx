import { Link, useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from 'react'
import { apiGet, apiPost, apiPut } from "../utls/api"
import { IQuestion, ITest } from "../types/api"
import { useFieldArray, useForm } from "react-hook-form";

interface ITestForm {
  title: string;
  time: number;
  keyCode: string;
  questions: IQuestion[]
}

export const AdminTestPage = ({isEditMode = false}: {isEditMode?: boolean}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { testId } = useParams()
  const navigate = useNavigate()
  const [test,setTest] = useState<ITest | undefined>(undefined)
  const {
    register,
    handleSubmit,
    formState: { isValid },
    reset,
    control,
  } = useForm<ITestForm>({
    defaultValues: {
      keyCode: "",
      questions: [
        {
          answer: 0,
          answers: [
            { id: 1, title: "" },
            { id: 2, title: "" },
            { id: 3, title: "" },
            { id: 4, title: "" },
          ],
          questionId: 0,
          title: "",
        },
      ],
    },
  });

  const { fields, append } =
      useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "questions", // unique name for your Field Array
      });
  
  useEffect(() => {
    if(isEditMode){
      try {
        apiGet<ITest>(`http://localhost:3000/tests/${testId}`).then(setTest);
      } catch (error) {}
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(()=>{
    if(test) reset({
      ...test,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [test])

  const onSubmit = (data: ITestForm) => {
    setIsLoading(true);
    try {
      const payload: ITest = {
        ...data,
        time: Number(data.time),
        questions: data.questions.map(item => {
          item.answer = Number(item.answer);
          return item;
        })
      }
      console.log(payload);
      if(!isEditMode) apiPost<void, ITest>("http://localhost:3000/tests", payload);
      else{
          delete payload.id
         apiPut(`http://localhost:3000/tests/${test?.id}`, payload);
      }
      navigate("/admin");
    } catch (error) {
      
    }
    setIsLoading(false)
  }

  if(isEditMode && !test) return <></>

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="test-form">
      <div>
        <Link to="/admin" className="back">
          &lt; Powrot
        </Link>
      </div>
      <div className="group">
        <label>Tytuł</label>
        <input
          type="text"
          disabled={isLoading}
          {...register("title", { required: true })}
        />
      </div>
      <div className="flex-between">
        <div className="group">
          <label>Kod dostępu</label>
          <input
            type="text"
            disabled={isLoading}
            {...register("keyCode", {
              required: true,
              validate: async (field) => {
                let tests = await apiGet<ITest[]>(
                  "http://localhost:3000/tests"
                );
                if (!isEditMode) {
                  const find = tests.find((test) => test.keyCode === field);
                  if (find) return false;
                  return true;
                } else {
                  tests = tests.filter((test) => test.id !== Number(testId));
                  const find = tests.find((test) => test.keyCode === field);
                  if (find) return false;
                  return true;
                }
              },
            })}
          />
        </div>
        <div className="group">
          <label>Czas trwania w sekundach</label>
          <input
            disabled={isLoading}
            type="number"
            {...register("time", { required: true })}
          />
        </div>
      </div>
      {fields.map((field, index) => (
        <div style={{ margin: "2rem 0" }} key={index}>
          <div className="group">
            <label>Pytanie {index + 1}</label>
            <input
              type="text"
              key={field.id}
              {...register(`questions.${index}.title`)}
            />
          </div>
          <div className="group">
            <label>Poprawna odpowiedz</label>
            <input
              key={field.id}
              type="number"
              {...register(`questions.${index}.answer`)}
            />
          </div>
          <div className="group answer">
            <label>1</label>
            <input
              key={field.id}
              {...register(`questions.${index}.answers.${0}.title`)}
            />
          </div>
          <div className="group answer">
            <label>2</label>
            <input
              key={field.id}
              {...register(`questions.${index}.answers.${1}.title`)}
            />
          </div>
          <div className="group answer">
            <label>3</label>
            <input
              key={field.id}
              {...register(`questions.${index}.answers.${2}.title`)}
            />
          </div>
          <div className="group answer">
            <label>4</label>
            <input
              key={field.id}
              {...register(`questions.${index}.answers.${3}.title`)}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          append({
            answer: 0,
            answers: [
              { id: 1, title: "" },
              { id: 2, title: "" },
              { id: 3, title: "" },
              { id: 4, title: "" },
            ],
            questionId: fields[fields.length - 1].questionId + 1,
            title: "",
          });
        }}
      >
        Dodaj pytanie
      </button>
      <div>
        <input
          type="submit"
          value={isEditMode ? "Edytuj test" : "Dodaj test"}
          className="add"
          disabled={isLoading || !isValid}
        />
      </div>
    </form>
  );
}