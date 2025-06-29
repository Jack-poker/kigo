import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface User {
  id: string;
  name: string;
  email: string;
  type: "parent" | "student";
  status: "active" | "suspended";
  joinDate: string;
  lastActivity: string;
  phone_number?: string; // Added for backend compatibility
  account_balance?: number; // Added for backend compatibility
}

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch CSRF token on mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get(
          "https://api.kaascan.com/admin/get-csrf-token",
          {
            withCredentials: true, // Ensure session_id cookie is sent
          },
        );
        console.log("CSRF Token:", response.data.csrf_token); // Debug
        setCsrfToken(response.data.csrf_token);
      } catch (err) {
        setError("Failed to fetch CSRF token");
        console.error("CSRF token error:", err);
      }
    };
    fetchCsrfToken();
  }, []);

  // Fetch users when CSRF token is available
  useEffect(() => {
    if (!csrfToken) return;
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://api.kaascan.com/admin/parents",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
              "X-CSRF-Token": csrfToken,
            },
            withCredentials: true, // Ensure session_id cookie is sent
          },
        );
        // Map backend Parent model to User interface
        const mappedUsers: User[] = response.data.map((parent: any) => ({
          id: parent.parent_id,
          name: parent.fullnames,
          email: parent.email || "N/A",
          type: "parent", // Hardcoded as backend only returns parents
          status: "active", // Placeholder, no status in backend
          joinDate: parent.created_at.split(" ")[0], // Format date (YYYY-MM-DD)
          lastActivity: parent.created_at.split(" ")[0], // Placeholder, no lastActivity
          phone_number: parent.phone_number,
          account_balance: parent.account_balance,
        }));
        setUsers(mappedUsers);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users");
        console.error("Users error:", err);
        setLoading(false);
      }
    };
    fetchUsers();
  }, [csrfToken]);

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handle view user
  const handleView = (user: User) => {
    setSelectedUser(user);
  };

  // Handle toggle status (placeholder, requires backend endpoint)
  const handleToggleStatus = (user: User) => {
    setUsers(
      users.map((u) =>
        u.id === user.id
          ? { ...u, status: u.status === "active" ? "suspended" : "active" }
          : u,
      ),
    );
    setError("Status toggle not implemented in backend");
    // TODO: Add PUT /admin/parents/{parent_id}/status endpoint in main.py
  };

  // Handle more actions (placeholder)
  const handleMoreActions = (action: string, user: User) => {
    console.log(`Action ${action} on user ${user.name}`);
    // TODO: Implement actions (e.g., edit, delete) when backend endpoints are added
  };

  return (
    <Card data-oid="xb:sr2i">
      <CardHeader data-oid="m4lml32">
        <CardTitle
          className="flex items-center justify-between"
          data-oid="flx:324"
        >
          <span data-oid="ggzga:_">User Management</span>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            data-oid="emw8d6n"
          >
            Add User
          </Button>
        </CardTitle>
        <div className="flex items-center space-x-4" data-oid="hw.9gro">
          <div className="relative flex-1 max-w-sm" data-oid="b8v:6q9">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              data-oid="rn93lnh"
            />

            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-oid="ubr4qe7"
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            data-oid=":x-yjra"
          >
            <Filter className="w-4 h-4" data-oid=".kl-3et" />
            <span data-oid="cg:d31e">Filter</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent data-oid="ldcmd_z">
        {error && (
          <p className="text-red-500 mb-4" data-oid="nd94dkt">
            {error}
          </p>
        )}
        {loading ? (
          <p className="text-gray-600" data-oid="xp:i57p">
            Loading...
          </p>
        ) : (
          <div className="overflow-x-auto" data-oid="wth3cvj">
            <table className="w-full" data-oid="-xbny1x">
              <thead data-oid=":tk569o">
                <tr className="border-b" data-oid="_kvhkit">
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="g6s_lh8"
                  >
                    Name
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="_x969o9"
                  >
                    Email
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="ffo9z64"
                  >
                    Type
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="6sy8-.p"
                  >
                    Status
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="v6_jxee"
                  >
                    Join Date
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="btsj7n0"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody data-oid="ecrisxi">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-emerald-50/50"
                    data-oid="c_:jl-5"
                  >
                    <td className="p-4 font-medium" data-oid="8kn3bp6">
                      {user.name}
                    </td>
                    <td
                      className="p-4 text-muted-foreground"
                      data-oid="jfx_0sw"
                    >
                      {user.email}
                    </td>
                    <td className="p-4" data-oid="mg3b7a4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.type === "parent"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                        data-oid="d3qc_jc"
                      >
                        {user.type}
                      </span>
                    </td>
                    <td className="p-4" data-oid="fgjb682">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                        data-oid="vrttz09"
                      >
                        {user.status}
                      </span>
                    </td>
                    <td
                      className="p-4 text-muted-foreground"
                      data-oid="cx24dvv"
                    >
                      {user.joinDate}
                    </td>
                    <td className="p-4" data-oid="hb1hvf2">
                      <div
                        className="flex items-center space-x-2"
                        data-oid="gnlz1rg"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(user)}
                          data-oid="d8xoq:g"
                        >
                          <Eye className="w-4 h-4" data-oid="oul_:a_" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={
                            user.status === "active"
                              ? "text-red-600"
                              : "text-green-600"
                          }
                          onClick={() => handleToggleStatus(user)}
                          data-oid="3zty7jm"
                        >
                          {user.status === "active" ? (
                            <UserX className="w-4 h-4" data-oid="spo4qr6" />
                          ) : (
                            <UserCheck className="w-4 h-4" data-oid="0o6dnl9" />
                          )}
                        </Button>
                        <DropdownMenu data-oid="f9z-5vc">
                          <DropdownMenuTrigger asChild data-oid="c14sb6n">
                            <Button
                              variant="outline"
                              size="sm"
                              data-oid="v.gr8x8"
                            >
                              <MoreHorizontal
                                className="w-4 h-4"
                                data-oid="mnz38zl"
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent data-oid="d49bbc2">
                            <DropdownMenuItem
                              onClick={() => handleMoreActions("edit", user)}
                              data-oid="pzem3a2"
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleMoreActions("delete", user)}
                              data-oid="-4r-xp."
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      {/* View User Modal */}
      {selectedUser && (
        <Dialog
          open={!!selectedUser}
          onOpenChange={() => setSelectedUser(null)}
          data-oid="eq1rq13"
        >
          <DialogContent data-oid="s273sma">
            <DialogHeader data-oid="haapllc">
              <DialogTitle data-oid="0glcbl5">User Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4" data-oid="u76hytw">
              <p data-oid="vfblxcm">
                <strong data-oid="7nwwjwz">Name:</strong> {selectedUser.name}
              </p>
              <p data-oid="2c0e2j2">
                <strong data-oid="e7adcpg">Email:</strong> {selectedUser.email}
              </p>
              <p data-oid="uljoub.">
                <strong data-oid="ztk0qkm">Type:</strong> {selectedUser.type}
              </p>
              <p data-oid="x:qwrwq">
                <strong data-oid="okgy7t.">Status:</strong>{" "}
                {selectedUser.status}
              </p>
              <p data-oid="frov:dc">
                <strong data-oid="4bje186">Join Date:</strong>{" "}
                {selectedUser.joinDate}
              </p>
              <p data-oid="pj9zt8m">
                <strong data-oid="m1wfpr1">Last Activity:</strong>{" "}
                {selectedUser.lastActivity}
              </p>
              {selectedUser.phone_number && (
                <p data-oid=":xe11xm">
                  <strong data-oid="_y2dxqo">Phone:</strong>{" "}
                  {selectedUser.phone_number}
                </p>
              )}
              {selectedUser.account_balance !== undefined && (
                <p data-oid="7jdo.xm">
                  <strong data-oid="x1csj2v">Account Balance:</strong> $
                  {selectedUser.account_balance.toFixed(2)}
                </p>
              )}
              <Button
                onClick={() => setSelectedUser(null)}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                data-oid="r1m12ri"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default UserManagement;
