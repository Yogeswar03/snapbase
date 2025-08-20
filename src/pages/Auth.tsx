import { useState, useEffect } from "react";
// Add phone login/signup support
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BarChart3, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const redirectTo = "/dashboard";
  const [resetOpen, setResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResetLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast({
          title: "Reset failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password reset email sent!",
          description: "Check your inbox for a reset link.",
        });
        setResetOpen(false);
        setResetEmail("");
      }
    } finally {
      setResetLoading(false);
    }
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [authMode, setAuthMode] = useState<'email' | 'phone'>("email");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
  if (authMode === "email") {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const firstName = formData.get("firstName") as string;
      const lastName = formData.get("lastName") as string;
      const redirectUrl = `${window.location.origin}/dashboard`;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        toast({
          title: "Account created successfully!",
          description: "Please check your email to verify your account.",
        });
      }
    } else {
      // Phone signup (requires password)
      const phoneVal = formData.get("phone") as string;
      const passwordVal = formData.get("phonePassword") as string;
      const { error } = await supabase.auth.signUp({
        phone: phoneVal,
        password: passwordVal,
      });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        setOtpSent(true);
        toast({
          title: "OTP sent!",
          description: "Check your phone for the verification code.",
        });
      }
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    if (authMode === "email") {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        toast({
          title: "Welcome back!",
          description: "You've been signed in successfully.",
        });
        navigate("/dashboard");
      }
    } else {
      // Phone login
      const phoneVal = formData.get("phone") as string;
      if (!otpSent) {
        // Request OTP
        const { error } = await supabase.auth.signInWithOtp({
          phone: phoneVal
        });
        setLoading(false);
        if (error) {
          setError(error.message);
        } else {
          setOtpSent(true);
          toast({
            title: "OTP sent!",
            description: "Check your phone for the verification code.",
          });
        }
      } else {
        // Verify OTP
        const { error } = await supabase.auth.verifyOtp({
          phone: phoneVal,
          token: otp,
          type: 'sms',
        });
        setLoading(false);
        if (error) {
          setError(error.message);
        } else {
          toast({
            title: "Welcome back!",
            description: "You've been signed in successfully.",
          });
          navigate("/dashboard");
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">ScaleLens</h1>
          </div>
          <p className="text-muted-foreground">Your AI Co-Founder for Startup Success</p>
        </div>

        <Card className="shadow-elegant">
          <CardHeader className="text-center">
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <button
                  type="button"
                  className={`text-xs px-2 py-1 rounded ${authMode === 'email' ? 'bg-primary text-white' : 'bg-muted'}`}
                  onClick={() => { setAuthMode(authMode === 'email' ? 'phone' : 'email'); setOtpSent(false); setOtp(''); }}
                  style={{ marginLeft: 8 }}
                >
                  {authMode === 'email' ? 'Use Phone' : 'Use Email'}
                </button>
              </TabsList>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  {authMode === 'email' ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="signin-email">Email</Label>
                        <Input
                          id="signin-email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password">Password</Label>
                        <Input
                          id="signin-password"
                          name="password"
                          type="password"
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          className="text-xs text-primary hover:underline"
                          onClick={() => setResetOpen(true)}
                        >
                          Forgot Password?
                        </button>
                      </div>
                      {/* Password Reset Dialog */}
                      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Reset Password</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handlePasswordReset} className="space-y-4">
                            <div>
                              <Label htmlFor="reset-email">Email</Label>
                              <Input
                                id="reset-email"
                                type="email"
                                value={resetEmail}
                                onChange={e => setResetEmail(e.target.value)}
                                required
                                autoFocus
                              />
                            </div>
                            <DialogFooter>
                              <Button type="button" variant="outline" onClick={() => setResetOpen(false)}>
                                Cancel
                              </Button>
                              <Button type="submit" disabled={resetLoading}>
                                {resetLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Send Reset Link
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="signin-phone">Phone Number</Label>
                        <Input
                          id="signin-phone"
                          name="phone"
                          type="tel"
                          placeholder="+1 555 123 4567"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          required
                        />
                      </div>
                      {otpSent && (
                        <div className="space-y-2">
                          <Label htmlFor="signin-otp">OTP</Label>
                          <Input
                            id="signin-otp"
                            name="otp"
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            required
                          />
                        </div>
                      )}
                    </>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {authMode === 'email' ? 'Sign In' : (otpSent ? 'Verify OTP' : 'Send OTP')}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  {authMode === 'email' ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            placeholder="John"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            type="text"
                            placeholder="Doe"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          name="password"
                          type="password"
                          placeholder="Create a password"
                          required
                          minLength={6}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="signup-phone">Phone Number</Label>
                        <Input
                          id="signup-phone"
                          name="phone"
                          type="tel"
                          placeholder="+1 555 123 4567"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-phone-password">Password</Label>
                        <Input
                          id="signup-phone-password"
                          name="phonePassword"
                          type="password"
                          placeholder="Create a password"
                          required
                          minLength={6}
                        />
                      </div>
                      {otpSent && (
                        <div className="space-y-2">
                          <Label htmlFor="signup-otp">OTP</Label>
                          <Input
                            id="signup-otp"
                            name="otp"
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={e => setOtp(e.target.value)}
                            required
                          />
                        </div>
                      )}
                    </>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {authMode === 'email' ? 'Create Account' : (otpSent ? 'Verify OTP' : 'Send OTP')}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}