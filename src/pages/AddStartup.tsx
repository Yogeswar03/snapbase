import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateStartupDialog } from "../components/CreateStartupDialog";

export default function AddStartupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <div className="w-full max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Add Your Startup</h1>
        <p className="text-muted-foreground text-center mb-6">
          Welcome! Please fill out the form below to add your startup to ScaleLens.<br />
          The more details you provide, the better we can help you grow.
        </p>
        <Card className="shadow-2xl border border-gray-200 bg-white">
          <CardHeader>
            <CardTitle>Startup Details</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateStartupDialog />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
