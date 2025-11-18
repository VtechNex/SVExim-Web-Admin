import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { month: "Jan", value: 4000, previous: 2400 },
  { month: "Feb", value: 3000, previous: 1398 },
  { month: "Mar", value: 2000, previous: 9800 },
  { month: "Apr", value: 2780, previous: 3908 },
  { month: "May", value: 1890, previous: 4800 },
  { month: "Jun", value: 2390, previous: 3800 },
  { month: "Jul", value: 3490, previous: 4300 },
];

export function AnalyticsChart() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fillOpacity={1}
              fill="url(#colorValue)"
              strokeWidth={2}
              name="Current Period"
            />
            <Area
              type="monotone"
              dataKey="previous"
              stroke="hsl(var(--accent))"
              fillOpacity={1}
              fill="url(#colorPrevious)"
              strokeWidth={2}
              name="Previous Period"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
