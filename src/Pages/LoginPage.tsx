import { useForm } from "react-hook-form";
import { IUser } from "../types/api";
import { apiGet } from "../utls/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


interface ILoginForm {
  username: string
  password: string
}

export const LoginPage = () => {
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<ILoginForm>();
  const navigate = useNavigate()
  const onSubmit = async (data: ILoginForm) => {
    setError(false);
    setIsLoading(true);
    try {
      const users = await apiGet<IUser[]>("http://localhost:3000/users");
      const isUser = users.find((user) => user.name === data.username && user.password === data.username);
      if (isUser) {
        navigate(`/admin`);
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Zaloguj się</h2>
      <input
        disabled={isLoading}
        type="text"
        placeholder="Username"
        {...register("username", { required: true })}
      />
      <input
        disabled={isLoading}
        type="password"
        placeholder="Hasło"
        {...register("password", { required: true })}
      />
      <input
        type="submit"
        value="Zaloguj sie"
        disabled={isLoading || !isValid}
      />
      {error && <div className="error">Login lub haslo niepoprawne</div>}
    </form>
  );
}