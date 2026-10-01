"use client";

import {
    Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend,
    Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

// teal, sky, indigo, amber, emerald, rose
export const COLORS = ["#1f7c82", "#38bdf8", "#6366f1", "#f59e0b", "#10b981", "#f43f5e"];

const axis = { stroke: "#94a3b8", fontSize: 12, tickLine: false, axisLine: false };
const tooltipStyle = {
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    fontSize: 12,
    boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)",
};

const shortDate = (s) =>
    new Date(`${s}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

const truncate = (s, n = 16) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

export function TrendChart({ data }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="patientsFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={COLORS[0]} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={COLORS[0]} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="date" tickFormatter={shortDate} minTickGap={28} {...axis} />
                <YAxis allowDecimals={false} {...axis} />
                <Tooltip contentStyle={tooltipStyle} labelFormatter={shortDate} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="patients" name="New patients" stroke={COLORS[0]} strokeWidth={2} fill="url(#patientsFill)" />
                <Area type="monotone" dataKey="doctors" name="New doctors" stroke={COLORS[1]} strokeWidth={2} fill="none" />
            </AreaChart>
        </ResponsiveContainer>
    );
}

// Horizontal bars: good for names, which are long
export function HBarChart({ data, nameKey, valueKey = "count", color = COLORS[0], label = "Patients" }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" allowDecimals={false} {...axis} />
                <YAxis type="category" dataKey={nameKey} width={110} tickFormatter={(v) => truncate(v)} {...axis} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f1f5f9" }} />
                <Bar dataKey={valueKey} name={label} fill={color} radius={[0, 4, 4, 0]} barSize={18} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function VBarChart({ data, nameKey, valueKey = "count", color = COLORS[2], label = "Patients" }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey={nameKey} {...axis} />
                <YAxis allowDecimals={false} {...axis} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f1f5f9" }} />
                <Bar dataKey={valueKey} name={label} fill={color} radius={[4, 4, 0, 0]} maxBarSize={44} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function DonutChart({ data, nameKey = "label", valueKey = "count" }) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    dataKey={valueKey}
                    nameKey={nameKey}
                    innerRadius="55%"
                    outerRadius="80%"
                    paddingAngle={2}
                    stroke="none"
                >
                    {data.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
        </ResponsiveContainer>
    );
}