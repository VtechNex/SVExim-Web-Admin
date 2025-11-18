import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const rfqs = [
  {
    id: "RFQ-2024-001",
    title: "Industrial Valve Set",
    company: "Marine Solutions Ltd",
    date: "2024-01-15",
    amount: "$15,000",
    status: "pending",
  },
  {
    id: "RFQ-2024-002",
    title: "Hydraulic Pump",
    company: "Ocean Logistics Inc",
    date: "2024-01-14",
    amount: "$8,500",
    status: "approved",
  },
  {
    id: "RFQ-2024-003",
    title: "Steel Fittings",
    company: "Port Authority",
    date: "2024-01-13",
    amount: "$22,000",
    status: "review",
  },
];

export function RecentActivity() {
  const getStatusBadge = (status: string) => {
    if (status === "approved") {
      return (
        <Badge className="bg-accent hover:bg-accent text-accent-foreground">
          <span className="mr-1">✓</span> Approved
        </Badge>
      );
    }
    if (status === "review") {
      return (
        <Badge className="bg-success hover:bg-success text-success-foreground">
          <span className="mr-1">⊙</span> Under Review
        </Badge>
      );
    }
    return null;
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-primary text-xl">Recent RFQs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {rfqs.map((rfq) => (
          <div
            key={rfq.id}
            className="bg-card border border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-primary text-base">
                      {rfq.id}
                      <span className="ml-3 font-medium">{rfq.title}</span>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {rfq.company} · {rfq.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-semibold text-accent">
                      {rfq.amount}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4 text-accent" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  {getStatusBadge(rfq.status)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
