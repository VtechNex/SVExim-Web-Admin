import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

const Clients = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Clients</h1>
          <p className="text-muted-foreground mt-1">
            Manage your client relationships and contacts.
          </p>
        </div>
        <Button className="gap-2 bg-secondary hover:bg-secondary/90">
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No clients yet. Add your first client to get started.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Clients;
