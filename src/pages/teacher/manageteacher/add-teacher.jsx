import React from "react";

export default function AddTeacher() {
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

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white p-5 rounded shadow-md w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Add Teacher</h2>

          <form>
            <label className="block mb-2 font-medium">Name</label>
            <input
              type="text"
              placeholder="Enter name"
              className="w-full mb-4 px-3 py-2 border rounded"
            />

            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full mb-4 px-3 py-2 border rounded"
            />

            <label className="block mb-2 font-medium">Department</label>
            <input
              type="text"
              placeholder="Enter department"
              className="w-full mb-4 px-3 py-2 border rounded"
            />

            <label className="block mb-2 font-medium">Course</label>
            <input
              type="string"
              placeholder="Enter semester"
              className="w-full mb-6 px-3 py-2 border rounded"
            />

            <div className="flex gap-6">
              <button
                type="submit"
                className="w-full bg-red-400 text-white py-2 rounded hover:bg-red-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full bg-green-400 text-white py-2 rounded hover:bg-green-600 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
