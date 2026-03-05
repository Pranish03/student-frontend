import { useParams } from "react-router-dom";

export const ManageClass = () => {
  const { id } = useParams;
  return <div>class {id}</div>;
};
