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
          "http://localhost:8001/admin/get-csrf-token",
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
          "http://localhost:8001/admin/parents",
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
    <Card data-oid="5:vpd9d">
      <CardHeader data-oid="rm37fvf">
        <CardTitle
          className="flex items-center justify-between"
          data-oid="emss44_"
        >
          <span data-oid="j1nh32x">User Management</span>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            data-oid="ref7o4n"
          >
            Add User
          </Button>
        </CardTitle>
        <div className="flex items-center space-x-4" data-oid="digknfq">
          <div className="relative flex-1 max-w-sm" data-oid="vt7e.::">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              data-oid="jujzwgo"
            />

            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-oid="pf8ib1g"
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            data-oid="zdux-92"
          >
            <Filter className="w-4 h-4" data-oid="5fwfs:t" />
            <span data-oid="7csrkt-">Filter</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent data-oid="h6wakwt">
        {error && (
          <p className="text-red-500 mb-4" data-oid="14t931.">
            {error}
          </p>
        )}
        {loading ? (
          <p className="text-gray-600" data-oid="vlweyhl">
            Loading...
          </p>
        ) : (
          <div className="overflow-x-auto" data-oid="3spo3ih">
            <table className="w-full" data-oid="4szxtop">
              <thead data-oid=":0x:kjp">
                <tr className="border-b" data-oid="nfypjjz">
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="nqefki:"
                  >
                    Name
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="p639yrn"
                  >
                    Email
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="0f6ir3s"
                  >
                    Type
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="rrkhcdv"
                  >
                    Status
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="ni4cs90"
                  >
                    Join Date
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="tzsh_mb"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody data-oid="t2qsflb">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-emerald-50/50"
                    data-oid="8mx1jql"
                  >
                    <td className="p-4 font-medium" data-oid="lhcseu0">
                      {user.name}
                    </td>
                    <td
                      className="p-4 text-muted-foreground"
                      data-oid="1owy9k1"
                    >
                      {user.email}
                    </td>
                    <td className="p-4" data-oid="m0t54sk">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.type === "parent"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                        data-oid="ibddkad"
                      >
                        {user.type}
                      </span>
                    </td>
                    <td className="p-4" data-oid="xusd3p7">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                        data-oid="1_4jfun"
                      >
                        {user.status}
                      </span>
                    </td>
                    <td
                      className="p-4 text-muted-foreground"
                      data-oid=".o-x6_r"
                    >
                      {user.joinDate}
                    </td>
                    <td className="p-4" data-oid="21v874p">
                      <div
                        className="flex items-center space-x-2"
                        data-oid="_gw07sr"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(user)}
                          data-oid="--_371-"
                        >
                          <Eye className="w-4 h-4" data-oid="p81q5:w" />
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
                          data-oid=":a2n7n-"
                        >
                          {user.status === "active" ? (
                            <UserX className="w-4 h-4" data-oid="v981s51" />
                          ) : (
                            <UserCheck className="w-4 h-4" data-oid="ejzv255" />
                          )}
                        </Button>
                        <DropdownMenu data-oid="tnly4.3">
                          <DropdownMenuTrigger asChild data-oid="8hg08q4">
                            <Button
                              variant="outline"
                              size="sm"
                              data-oid="me.3-n7"
                            >
                              <MoreHorizontal
                                className="w-4 h-4"
                                data-oid=":45c.:t"
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent data-oid="u1hcf9b">
                            <DropdownMenuItem
                              onClick={() => handleMoreActions("edit", user)}
                              data-oid="bgdklxy"
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleMoreActions("delete", user)}
                              data-oid="z44ltj."
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
          data-oid="vfz8jn:"
        >
          <DialogContent data-oid="p0:k:cs">
            <DialogHeader data-oid="8b5lmd4">
              <DialogTitle data-oid="wamslr7">User Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4" data-oid="m-tlkdh">
              <p data-oid="9px1gza">
                <strong data-oid="kf4a7h.">Name:</strong> {selectedUser.name}
              </p>
              <p data-oid="8skw46v">
                <strong data-oid="_lu-:r2">Email:</strong> {selectedUser.email}
              </p>
              <p data-oid="3_csnci">
                <strong data-oid="kb6z_fw">Type:</strong> {selectedUser.type}
              </p>
              <p data-oid="ipz22u5">
                <strong data-oid="1wmt7sp">Status:</strong>{" "}
                {selectedUser.status}
              </p>
              <p data-oid="7nogk2r">
                <strong data-oid="c3fje4v">Join Date:</strong>{" "}
                {selectedUser.joinDate}
              </p>
              <p data-oid="nn6m9du">
                <strong data-oid="yj_ycq7">Last Activity:</strong>{" "}
                {selectedUser.lastActivity}
              </p>
              {selectedUser.phone_number && (
                <p data-oid="kgi5i.x">
                  <strong data-oid="6mvl1ah">Phone:</strong>{" "}
                  {selectedUser.phone_number}
                </p>
              )}
              {selectedUser.account_balance !== undefined && (
                <p data-oid="bh-ths7">
                  <strong data-oid="mpfk2u3">Account Balance:</strong> $
                  {selectedUser.account_balance.toFixed(2)}
                </p>
              )}
              <Button
                onClick={() => setSelectedUser(null)}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                data-oid="ilzvnz:"
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
