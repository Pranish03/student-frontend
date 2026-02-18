import { Link } from "react-router-dom";

export default function ManageTeacher() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-70 bg-white text-gray-800 p-4 border-r border-gray-200">
        <div className="mb-6">
          <h1 className="text-4xl text-green-600 font-black tracking-wide pl-4 mb-20">
            S.M.S
          </h1>
        </div>

        <div className="cursor-pointer block font-semibold text-lg px-4 rounded-md py-3 hover:text-white hover:bg-green-300 transition-colors mb-8">
          Logout
        </div>
        <div className="cursor-pointer block font-semibold text-lg px-4 rounded-md py-3 hover:text-white hover:bg-green-300 transition-colors mb-8">
          Logout
        </div>
        <div className="cursor-pointer block font-semibold text-lg px-4 rounded-md py-3 hover:text-white hover:bg-green-300 transition-colors mb-8">
          Logout
        </div>
        <div className="cursor-pointer block font-semibold text-lg px-4 rounded-md py-3 hover:text-white hover:bg-green-300 transition-colors mb-8">
          Logout
        </div>
        <div className="cursor-pointer block font-semibold text-lg px-4 rounded-md py-3 hover:text-white hover:bg-green-300 transition-colors mb-8">
          Logout
        </div>
        <div className="cursor-pointer block font-semibold text-lg px-4 rounded-md py-3 hover:text-white hover:bg-green-300 transition-colors mb-8">
          Logout
        </div>
        <div className="border-t mt-8">
          <div className="cursor-pointer block font-semibold text-lg px-4 rounded-md py-3 hover:text-white hover:bg-green-300 transition-colors mt-4">
            Logout
          </div>
        </div>
      </aside>

      <div className="w-full min-h-screen p-6">
        <button class="px-2 py-1 bg-green-600 text-white rounded mb-4  ">Back</button>
        <h2 className="text-3xl font-bold text-gray-800 mb-10">Teacher</h2>

        <div className="flex justify-between items-center mb-5">
          <input
            type="text"
            placeholder="Search"
            className="w-75 mb-4 px-4 py-2 border border-gray-400 rounded"
          />

          <Link to="/add-teacher">
            <button className="px-4 py-2 bg-green-600 text-white rounded">
              Add Teacher
            </button>
          </Link>
        </div>

        <div className="bg-white w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-3 border">S.N.</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Department</th>
                <th className="p-3 border">Courses</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="p-3 border">1</td>
                <td className="p-3 border">Black Mamba</td>
                <td className="p-3 border">mamba@gmail.com</td>
                <td className="p-3 border">CSIT</td>
                <td className="p-3 border">AI</td>
                <td className="p-3 border text-center">
                  <button className="px-3 py-1 bg-green-600 text-white rounded mr-2">
                    View
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded mr-2">
                    Edit
                  </button>
                  <button className="px-3 py-1 bg-red-600 text-white rounded">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
