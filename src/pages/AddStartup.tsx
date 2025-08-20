import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateStartupDialog } from "../components/CreateStartupDialog";

export default function AddStartupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
      <Card className="w-full max-w-lg mx-auto shadow-2xl border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle>Add Your Startup</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateStartupDialog />
        </CardContent>
      </Card>
    </div>
  );
}
