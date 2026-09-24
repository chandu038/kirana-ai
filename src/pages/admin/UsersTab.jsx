import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/lib/api";

export default function UsersTab() {
  const [users, setUsers] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api("/admin/users").then(setUsers).catch((e) => toast.error(e.message));
  }, []);

  const q = search.toLowerCase();
  const shown = users?.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));

  return (
    <div className="space-y-3">
      <Input className="max-w-xs" placeholder="Search name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
      {users === null && <p className="text-muted-foreground">Loading...</p>}
      {shown?.length === 0 && <p className="text-muted-foreground">No users found.</p>}
      {shown?.length > 0 && (
        <div className="overflow-x-auto rounded-lg border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Orders</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shown.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.id}</TableCell>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge variant={u.role === "admin" ? "default" : "secondary"}>{u.role}</Badge>
                  </TableCell>
                  <TableCell>{u.orders}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}