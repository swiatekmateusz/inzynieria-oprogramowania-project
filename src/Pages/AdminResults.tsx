import { Link, useParams } from "react-router-dom"
import { useState, useEffect } from 'react' 
import { apiGet } from "../utls/api"
import { IResult } from "../types/api"

export const AdminResults = () => {
  const { testId } = useParams()
  const [results, setResults] = useState<IResult[] | undefined>(undefined);

  useEffect(()=> {
    const fetchResults = async () => await apiGet<IResult[]>(`http://localhost:3000/results`)
    try {
      fetchResults().then((data)=> setResults(data.filter(data => data.testId === Number(testId))));
    } catch (error) {
      
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if(!results) return <></>

  return (
    <div>
      <div>
        <Link to="/admin">&lt; Powrot</Link>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Nazwa studenta</th>
              <th>Rezultat</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id}>
                <td>{result.id}</td>
                <td>{result.studentName}</td>
                <td>{result.result}</td>
                <td>{result.date as unknown as string}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}