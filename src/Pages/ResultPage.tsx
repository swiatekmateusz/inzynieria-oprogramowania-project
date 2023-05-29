import { useParams } from "react-router-dom";


export const ResultPage = () => {
  const { keyCode, studentName, result } = useParams();

  return (
    <div>
      <h3>Test: {keyCode}</h3>
      <h3>Student: {studentName}</h3>
      <h3>Rezultat: {result}%</h3>
    </div>
  );
}