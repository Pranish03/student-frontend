import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuEllipsis } from "react-icons/lu";
import { IoCheckmarkCircle, IoCloseCircle, IoAddCircle } from "react-icons/io5";
import { ImSpinner8 } from "react-icons/im";
import { toast } from "sonner";
import { axios } from "../../../lib/axios";
import { createStudentSchema } from "../../../schemas/userSchema";
import { useFetch } from "../../../hooks/useFetch";
import { formatDate } from "../../../utils/formatDate";
import { Pagination } from "../../../components/Pagination";
import { Button } from "../../../components/Button";
import { Dialog } from "../../../components/Dialog";
import { Input } from "../../../components/Input";
import { zodResolver } from "@hookform/resolvers/zod";

export const ManageStudents = () => {
  const [page, setPage] = useState(1);
  const [showDialog, setShowDialog] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
    resolver: zodResolver(createStudentSchema),
  });

  const limit = 10;

  const { data, reFetch } = useFetch(`/users?page=${page}&limit=${limit}`);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await axios.post("/users", data);

      toast.success(res?.data?.message);
      reFetch();
      setShowDialog(false);
      reset();
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Students</h2>

        <div className=" flex justify-end mb-4">
          <Button
            className="flex items-center gap-2"
            onClick={() => setShowDialog(true)}
          >
            <IoAddCircle size={22} />
            Add Student
          </Button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full">
            <thead className="bg-gray-100 border-b border-gray-200 text-gray-900">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">SN</th>
                <th className="px-3 py-2 text-left font-semibold">Name</th>
                <th className="px-3 py-2 text-left font-semibold">Email</th>
                <th className="px-3 py-2 text-left font-semibold">Status</th>
                <th className="px-3 py-2 text-left font-semibold">
                  Created at
                </th>
                <th className="px-3 py-2 text-left font-semibold">
                  Updated at
                </th>
                <th className="px-3 py-2 text-left font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 text-gray-800">
              {data?.data?.map((student, index) => (
                <tr key={student._id}>
                  <td className="px-3 py-2">
                    {(page - 1) * limit + index + 1}
                  </td>
                  <td className="px-3 py-2">{student.name}</td>
                  <td className="px-3 py-2">{student.email}</td>
                  <td className="px-3 py-2">
                    {student.isActive ? (
                      <span className="py-0.5 px-2 rounded-full border border-gray-200 text-gray-500 text-sm flex items-center gap-1 max-w-min">
                        <IoCheckmarkCircle
                          size={14}
                          className="text-green-500"
                        />
                        Active
                      </span>
                    ) : (
                      <span className="py-0.5 px-2 rounded-full border border-gray-200 text-gray-500 text-sm flex items-center gap-1 max-w-min">
                        <IoCloseCircle size={14} className="text-red-600" />
                        Deactive
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">{formatDate(student.createdAt)}</td>
                  <td className="px-3 py-2">{formatDate(student.updatedAt)}</td>

                  <td className="px-3 py-2">
                    <button className="p-1.5 hover:bg-gray-100 cursor-pointer rounded-lg">
                      <LuEllipsis size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          totalPages={data?.pagination?.totalPages}
          onPageChange={setPage}
        />
      </div>

      {showDialog && (
        <Dialog
          heading="Add Student"
          desc="Enter student information below to create a new student."
          close={() => setShowDialog(false)}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-5">
              <label
                htmlFor="name"
                className={`block max-w-fit text-sm sm:text-base font-medium mb-2 ${errors.name ? "text-red-600" : "text-gray-900"}`}
              >
                Name
                <span className="text-red-600">*</span>
              </label>

              <Input
                className="w-full"
                type="text"
                id="name"
                placeholder="John Doe"
                {...register("name")}
                errors={errors.name}
              />

              {errors.name && (
                <p className="text-red-600 mt-2">{errors.name.message}</p>
              )}
            </div>

            <div className={`${error ? "mb-5" : "mb-7"}`}>
              <label
                htmlFor="email"
                className={`block max-w-fit text-sm sm:text-base font-medium mb-2 ${errors.email ? "text-red-600" : "text-gray-900"}`}
              >
                Email
                <span className="text-red-600">*</span>
              </label>

              <Input
                className="w-full"
                type="email"
                id="email"
                placeholder="m@example.com"
                {...register("email")}
                errors={errors.email}
              />

              {errors.email && (
                <p className="text-red-600 mt-2">{errors.email.message}</p>
              )}
            </div>

            {error && <p className="text-red-600 mt-0 mb-0">{error}</p>}

            <Button
              className="flex items-center justify-center gap-3 float-end"
              type="submit"
              disabled={loading}
            >
              {loading && <ImSpinner8 className="animate-spin text-lg" />}
              Add Student
            </Button>
          </form>
        </Dialog>
      )}
    </>
  );
};
