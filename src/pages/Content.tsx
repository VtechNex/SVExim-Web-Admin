import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";

const Content = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Content</h1>
          <p className="text-muted-foreground mt-1">
            Manage your website content and pages.
          </p>
        </div>
        <Button className="gap-2 bg-secondary hover:bg-secondary/90">
          <Plus className="h-4 w-4" />
          Add Content
        </Button>
      </div>

      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Edit className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No content yet. Add your first content to get started.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Content;
