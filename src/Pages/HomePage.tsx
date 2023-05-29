import { useForm } from "react-hook-form";
import { ITest } from "../types/api";
import { apiGet } from "../utls/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


interface IKeyCodeForm {
  keyCode: string;
}

export const HomePage = () => {
  const [error, setError] = useState(false)
  const [isLoading, setIsLocaing] = useState(false)
  const {
    register,
    handleSubmit,
    formState: {isValid}
  } = useForm<IKeyCodeForm>();
  const navigate = useNavigate()
  const onSubmit = async (data: IKeyCodeForm) => {
    setError(false);
    setIsLocaing(true)
    try {
      const tests = await apiGet<ITest[]>("http://localhost:3000/tests")
      const isCodeRight = tests.find(test => test.keyCode === data.keyCode)
      if(isCodeRight) {
        navigate(`/test/${data.keyCode}`);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true)
    }
    setIsLocaing(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Wprowadź kod testu</h2>
      <input
      type="text"
        disabled={isLoading}
        {...register("keyCode", { required: true })}
      />
      <input
        type="submit"
        value="Szukaj testu"
        disabled={isLoading || !isValid}
      />
      {error && <div className="error">Kod jest nieprawidłowy</div>}
    </form>
  );
}