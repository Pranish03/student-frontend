/* eslint-disable no-unused-vars */
import { LuTrendingUp } from "react-icons/lu";

export const StatCard = ({ title, value, icon: Icon, trend, subtitle }) => (
  <div className="bg-white border border-zinc-300 rounded-[10px] p-6">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-zinc-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-zinc-900">{value}</p>
        {subtitle && <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>}
      </div>
      <div className="p-3 bg-green-50 rounded-lg">
        <Icon className="w-6 h-6 text-green-600" />
      </div>
    </div>
    {trend && (
      <div className="mt-3 flex items-center gap-1 text-xs">
        <LuTrendingUp className="w-3 h-3 text-green-600" />
        <span className="text-green-600 font-medium">{trend}</span>
        <span className="text-zinc-500">vs last month</span>
      </div>
    )}
  </div>
);
