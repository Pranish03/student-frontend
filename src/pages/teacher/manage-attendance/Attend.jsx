import { useParams } from "react-router-dom";

export const Attend = () => {
  const { id: courseId } = useParams();

  return <div>Attend {courseId}</div>;
};
