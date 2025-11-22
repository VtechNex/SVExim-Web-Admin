import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import QUOTES from '@/services/quoteService';

export function RecentActivity() {
  const [quotes, setQuotes] = useState(null);
  const [selectedRfq, setSelectedRfq] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(()=>{
    const fetchQuotes = async () => {
      const response = await QUOTES.GET();
      if (response.status!==200) {
        // error
        console.log('Error fetching quotes', response);
      } else {
        console.log('Quotes:', response.data);
        setQuotes(response.data.quotes);
      }
    }
    fetchQuotes();
  },[]);

  const recentQuotes = quotes?.slice(0, 5);

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

  const openDialog = (rfq) => {
    setSelectedRfq(rfq);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setSelectedRfq(null);
    setIsDialogOpen(false);
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-primary text-xl">Recent RFQs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {(recentQuotes && recentQuotes.map((q) => (
          <div
            key={q.id}
            className="bg-card border border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-primary text-base">
                      {q.id}
                      <span className="ml-3 font-medium">{q.name}</span>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {q.email} · {q?.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-semibold text-accent">
                      {q.budget}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openDialog(q)}
                    >
                      <Eye className="h-4 w-4 text-accent" />
                    </Button>
                  </div>
                </div>
                {/* <div className="flex items-center justify-end">
                  {getStatusBadge(rfq.status)}
                </div> */}
              </div>
            </div>
          </div>
        ))) || (
          (!quotes && (
            <div className="flex flex-col items-center justify-center h-[60vh] px-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
              No recent activity
            </h2>
          </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
