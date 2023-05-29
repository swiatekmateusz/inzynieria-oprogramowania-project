import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom"


interface IStudentNameForm {
  name: string;
}


export const TestWaittingRoomPage = () => {
  const { keyCode } = useParams()

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<IStudentNameForm>();

  const navigate = useNavigate();
  const onSubmit = async (data: IStudentNameForm) => {
    navigate(`/test/${keyCode}/${data.name}`)
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Wproawdź smój numer identyfikacyjny</h2>
      <input
        type="text"
        {...register("name", { required: true, maxLength: 6 })}
      />
      <input
        type="submit"
        value="Rozpocznij"
        disabled={!isValid}
      />
    </form>
  );
}