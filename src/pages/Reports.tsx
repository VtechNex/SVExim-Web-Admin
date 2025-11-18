import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const reports = [
  {
    id: 1,
    title: "Monthly Sales Report",
    description: "Comprehensive overview of monthly sales performance",
    date: "March 2025",
    status: "completed",
  },
  {
    id: 2,
    title: "User Engagement Analytics",
    description: "Detailed analysis of user interaction metrics",
    date: "March 2025",
    status: "completed",
  },
  {
    id: 3,
    title: "Revenue Forecast Q2",
    description: "Projected revenue analysis for second quarter",
    date: "April 2025",
    status: "pending",
  },
  {
    id: 4,
    title: "Marketing Campaign Results",
    description: "Performance metrics from recent campaigns",
    date: "February 2025",
    status: "completed",
  },
];

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Access and download your business reports.
          </p>
        </div>
        <Button className="gap-2">
          <FileText className="h-4 w-4" />
          Generate New Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {report.description}
                  </p>
                </div>
                <Badge
                  variant={report.status === "completed" ? "default" : "secondary"}
                >
                  {report.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{report.date}</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-3 w-3" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-3 w-3" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reports;
