import { useState, useEffect } from "react"
import { ITest } from "../types/api"
import { apiDelete, apiGet } from "../utls/api";
import { Link } from "react-router-dom";


export const AdminDashboard = () => {
  const [tests, setTests] = useState<undefined | ITest[]>(undefined)

  useEffect(() => {
    const fetchTests = async () =>
      await apiGet<ITest[]>("http://localhost:3000/tests");
    try {
      fetchTests().then(setTests);
    } catch (error) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteTest = async (testId: number) => {
    try {
      await apiDelete(`http://localhost:3000/tests/${testId}`);
      setTests(state => state?.filter(item => item.id !== testId))
    } catch (error) {
      
    }
  }

  if (!tests) return <></>;



  return (
    <div>
      <div>
        <Link to="/add" className="back">+ Dodaj test</Link>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nazwa</th>
              <th>Kod dostępu</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test) => (
              <tr key={test.id}>
                <td>{test.id}</td>
                <td>{test.title}</td>
                <td>{test.keyCode}</td>
                <td className="actions">
                  <Link to={`/edit/${test.id}`}>Edytuj test</Link>
                  <button onClick={() => test.id && deleteTest(test.id)}>
                    Usuń
                  </button>
                  <Link to={`/results/${test.id}`}>Rezultaty</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}