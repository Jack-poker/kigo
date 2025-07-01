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
    <Card data-oid="323cxj:">
      <CardHeader data-oid="1kx:uae">
        <CardTitle
          className="flex items-center justify-between"
          data-oid="tcsp:r_"
        >
          <span data-oid="4y3a:.l">User Management</span>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            data-oid="1pibltt"
          >
            Add User
          </Button>
        </CardTitle>
        <div className="flex items-center space-x-4" data-oid="f2kfaop">
          <div className="relative flex-1 max-w-sm" data-oid="tm35dc5">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              data-oid="y6z-fya"
            />

            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-oid="x4hg:.c"
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            data-oid="mst_yu1"
          >
            <Filter className="w-4 h-4" data-oid="u4nhprb" />
            <span data-oid="6.f.fbc">Filter</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent data-oid="_ihf4oy">
        {error && (
          <p className="text-red-500 mb-4" data-oid="q7_xg5n">
            {error}
          </p>
        )}
        {loading ? (
          <p className="text-gray-600" data-oid="94z_l6_">
            Loading...
          </p>
        ) : (
          <div className="overflow-x-auto" data-oid=".jdto-p">
            <table className="w-full" data-oid="b8h9y_x">
              <thead data-oid="0vaa6u0">
                <tr className="border-b" data-oid="5vug5_c">
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="c9tsklj"
                  >
                    Name
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid=".9u5h1c"
                  >
                    Email
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="jifj:4n"
                  >
                    Type
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="wjlrqho"
                  >
                    Status
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="2s0oni8"
                  >
                    Join Date
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="10dqt1v"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody data-oid="kepb2j.">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-emerald-50/50"
                    data-oid="ysbv:bp"
                  >
                    <td className="p-4 font-medium" data-oid="x_sk51m">
                      {user.name}
                    </td>
                    <td
                      className="p-4 text-muted-foreground"
                      data-oid="7oo1.5g"
                    >
                      {user.email}
                    </td>
                    <td className="p-4" data-oid="um870vx">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.type === "parent"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                        data-oid="dz_ca35"
                      >
                        {user.type}
                      </span>
                    </td>
                    <td className="p-4" data-oid="4qhm7u0">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                        data-oid="dq-wc3b"
                      >
                        {user.status}
                      </span>
                    </td>
                    <td
                      className="p-4 text-muted-foreground"
                      data-oid=".c1u.ct"
                    >
                      {user.joinDate}
                    </td>
                    <td className="p-4" data-oid="3sn.7ez">
                      <div
                        className="flex items-center space-x-2"
                        data-oid="ze-pvgc"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(user)}
                          data-oid="_ov8ezz"
                        >
                          <Eye className="w-4 h-4" data-oid="2zeomzi" />
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
                          data-oid="n5x_7m-"
                        >
                          {user.status === "active" ? (
                            <UserX className="w-4 h-4" data-oid="ugf.bh6" />
                          ) : (
                            <UserCheck className="w-4 h-4" data-oid="n5g.bzy" />
                          )}
                        </Button>
                        <DropdownMenu data-oid="9q:kumi">
                          <DropdownMenuTrigger asChild data-oid="nbpepo0">
                            <Button
                              variant="outline"
                              size="sm"
                              data-oid="9r-o:-."
                            >
                              <MoreHorizontal
                                className="w-4 h-4"
                                data-oid="v5rhuk6"
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent data-oid="oont_-c">
                            <DropdownMenuItem
                              onClick={() => handleMoreActions("edit", user)}
                              data-oid="3hus77q"
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleMoreActions("delete", user)}
                              data-oid="w041k5b"
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
          data-oid="4ao_w9k"
        >
          <DialogContent data-oid="1cl7e-j">
            <DialogHeader data-oid="35xpd9u">
              <DialogTitle data-oid="a5s0-l4">User Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4" data-oid="16a227s">
              <p data-oid="4z2iu51">
                <strong data-oid="odz:lm-">Name:</strong> {selectedUser.name}
              </p>
              <p data-oid="l035l9k">
                <strong data-oid=":t18gwq">Email:</strong> {selectedUser.email}
              </p>
              <p data-oid="uo_rcm3">
                <strong data-oid="09blgda">Type:</strong> {selectedUser.type}
              </p>
              <p data-oid="j-3wqol">
                <strong data-oid="_k1h_:8">Status:</strong>{" "}
                {selectedUser.status}
              </p>
              <p data-oid="0egxif0">
                <strong data-oid="nxam9bs">Join Date:</strong>{" "}
                {selectedUser.joinDate}
              </p>
              <p data-oid="9d57vra">
                <strong data-oid="pxqyuk-">Last Activity:</strong>{" "}
                {selectedUser.lastActivity}
              </p>
              {selectedUser.phone_number && (
                <p data-oid="xb-5cvv">
                  <strong data-oid="q:kbl.c">Phone:</strong>{" "}
                  {selectedUser.phone_number}
                </p>
              )}
              {selectedUser.account_balance !== undefined && (
                <p data-oid="umncmk:">
                  <strong data-oid="unv6xru">Account Balance:</strong> $
                  {selectedUser.account_balance.toFixed(2)}
                </p>
              )}
              <Button
                onClick={() => setSelectedUser(null)}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                data-oid="seskdk6"
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
