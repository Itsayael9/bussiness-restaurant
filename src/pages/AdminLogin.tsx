import { FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ADMIN_ROUTE } from "@/lib/adminConstants";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const AdminLogin = () => {
  const { ready, user, login } = useAdminAuth();
  const [username, setUsername] = useState("youssef");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (ready && user) return <Navigate to={ADMIN_ROUTE} replace />;

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-3xl border border-border bg-card shadow-elegant p-8 space-y-6"
      >
        <div className="text-center">
          <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-gold/10 flex items-center justify-center text-gold">
            <Lock />
          </div>
          <p className="text-gold text-xs tracking-[0.35em] uppercase mb-2">Admin</p>
          <h1 className="font-display text-4xl font-bold text-foreground">Restaurant Business</h1>
          <p className="text-sm text-muted-foreground mt-2">Protected dashboard</p>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium" htmlFor="admin-username">
            Username
          </label>
          <Input
            id="admin-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium" htmlFor="admin-password">
            Password
          </label>
          <Input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full rounded-full" disabled={loading || !ready}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>
    </main>
  );
};

export default AdminLogin;
