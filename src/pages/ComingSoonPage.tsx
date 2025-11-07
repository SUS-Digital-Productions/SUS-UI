import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router";
import { Construction, Clock, Lightbulb } from "lucide-react";

export const ComingSoonPage = () => {
  return (
    <div className="w-full mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-8 max-w-2xl">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <Construction className="h-24 w-24 text-primary" />
            <div className="absolute -top-2 -right-2">
              <Clock className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Coming Soon</h1>
          <p className="text-muted-foreground text-lg">
            This feature is currently under development and will be available soon.
          </p>
        </div>

        <Card className="text-left">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              What's Next?
            </CardTitle>
            <CardDescription>
              We're working hard to bring you new features and improvements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">In Progress</Badge>
                <span className="text-sm">Enhanced user interface</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Planning</Badge>
                <span className="text-sm">Advanced blockchain features</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Soon</Badge>
                <span className="text-sm">Mobile app integration</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link to="/">
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/settings">
              View Settings
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};