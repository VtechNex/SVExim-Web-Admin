import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const metrics = [
  {
    category: "Sales Performance",
    items: [
      { name: "Conversion Rate", value: 78, trend: "up", change: "+12%" },
      { name: "Average Order Value", value: 65, trend: "up", change: "+8%" },
      { name: "Cart Abandonment", value: 32, trend: "down", change: "-5%" },
    ],
  },
  {
    category: "Customer Satisfaction",
    items: [
      { name: "Customer Satisfaction Score", value: 92, trend: "up", change: "+3%" },
      { name: "Net Promoter Score", value: 68, trend: "neutral", change: "0%" },
      { name: "Response Time", value: 85, trend: "up", change: "+15%" },
    ],
  },
  {
    category: "Operational Efficiency",
    items: [
      { name: "Process Automation", value: 71, trend: "up", change: "+20%" },
      { name: "Resource Utilization", value: 88, trend: "up", change: "+7%" },
      { name: "Error Rate", value: 15, trend: "down", change: "-10%" },
    ],
  },
];

const Performance = () => {
  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-success" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getProgressColor = (value: number) => {
    if (value >= 80) return "bg-success";
    if (value >= 60) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Performance</h1>
        <p className="text-muted-foreground mt-1">
          Track key performance indicators and metrics.
        </p>
      </div>

      <div className="space-y-6">
        {metrics.map((section, idx) => (
          <Card key={idx}>
            <CardHeader>
              <CardTitle>{section.category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.name}</span>
                      {getTrendIcon(item.trend)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.change}</Badge>
                      <span className="font-bold">{item.value}%</span>
                    </div>
                  </div>
                  <Progress value={item.value} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Performance;
