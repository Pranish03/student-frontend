import React from "react";

export default function StudentDashboard() {
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

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome to Student Dashboard
        </h1>
      </div>
    </div>
  );
}
