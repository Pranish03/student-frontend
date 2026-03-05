import { useQuery } from "@tanstack/react-query";
import { LuChevronRight } from "react-icons/lu";
import { Link, useParams } from "react-router-dom";
import { fetchClass } from "../../../../api/manageClasses";

export const ManageClass = () => {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["class", id],
    queryFn: () => fetchClass(id),
  });

  console.log(data);

  return (
    <div>
      <div className="flex items-center gap-1 mb-4">
        <Link
          className="text-zinc-500 hover:underline hover:text-zinc-900"
          to="/admin"
        >
          admin
        </Link>

        <LuChevronRight />

        <Link
          className="text-zinc-500 hover:underline hover:text-zinc-900"
          to="/admin/manage-classes"
        >
          classes
        </Link>

        <LuChevronRight />

        <span className="text-zinc-900">{data?.data?.name}</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 mb-1">Classes</h1>
        {/* <p className="text-zinc-800">Total classes</p> */}
      </div>
    </div>
  );
};
