
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 p-4">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <ShieldAlert className="h-24 w-24 text-destructive" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Unauthorized Access</h1>
        <p className="text-xl text-muted-foreground mb-6">
          You don't have permission to access this page.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link to="/board">Go to Dashboard</Link>
          </Button>
          <Button asChild>
            <Link to="/login">Login with Different Account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
