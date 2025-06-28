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
    <Card data-oid="gt9hvbl">
      <CardHeader data-oid="b40ve21">
        <CardTitle
          className="flex items-center justify-between"
          data-oid="gu57-q8"
        >
          <span data-oid="..kexwm">User Management</span>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            data-oid="7x-ghko"
          >
            Add User
          </Button>
        </CardTitle>
        <div className="flex items-center space-x-4" data-oid="ctbtam0">
          <div className="relative flex-1 max-w-sm" data-oid="7ns_vu3">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              data-oid="m9:911l"
            />

            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-oid="fof66fp"
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            data-oid="ladtis9"
          >
            <Filter className="w-4 h-4" data-oid="hlwf-gk" />
            <span data-oid="tyv-339">Filter</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent data-oid="ur3xwnd">
        {error && (
          <p className="text-red-500 mb-4" data-oid="hcporu-">
            {error}
          </p>
        )}
        {loading ? (
          <p className="text-gray-600" data-oid="p8tkxz-">
            Loading...
          </p>
        ) : (
          <div className="overflow-x-auto" data-oid="x1o6zu_">
            <table className="w-full" data-oid="kr6zney">
              <thead data-oid="p.w:s4e">
                <tr className="border-b" data-oid="kan_tk4">
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="m2dozwd"
                  >
                    Name
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="v1praf1"
                  >
                    Email
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="4-9ff2v"
                  >
                    Type
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="7_5hdo4"
                  >
                    Status
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="7vkfqxs"
                  >
                    Join Date
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="92j45j4"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody data-oid="48uwt8r">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-emerald-50/50"
                    data-oid="d6mm:yc"
                  >
                    <td className="p-4 font-medium" data-oid="w.18urc">
                      {user.name}
                    </td>
                    <td
                      className="p-4 text-muted-foreground"
                      data-oid="y-hpg-a"
                    >
                      {user.email}
                    </td>
                    <td className="p-4" data-oid="qjmbj6g">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.type === "parent"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                        data-oid="zqsxw96"
                      >
                        {user.type}
                      </span>
                    </td>
                    <td className="p-4" data-oid="u1hwbz9">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                        data-oid="f0ijzt:"
                      >
                        {user.status}
                      </span>
                    </td>
                    <td
                      className="p-4 text-muted-foreground"
                      data-oid="x7t6mpo"
                    >
                      {user.joinDate}
                    </td>
                    <td className="p-4" data-oid="zh8to3i">
                      <div
                        className="flex items-center space-x-2"
                        data-oid="hs.i9o_"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(user)}
                          data-oid="1vap_7l"
                        >
                          <Eye className="w-4 h-4" data-oid="f-_j-b1" />
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
                          data-oid="36e:s_k"
                        >
                          {user.status === "active" ? (
                            <UserX className="w-4 h-4" data-oid="j3ydbex" />
                          ) : (
                            <UserCheck className="w-4 h-4" data-oid=":a3jsx2" />
                          )}
                        </Button>
                        <DropdownMenu data-oid="4l5iq.a">
                          <DropdownMenuTrigger asChild data-oid=":wc7hq-">
                            <Button
                              variant="outline"
                              size="sm"
                              data-oid="e0ch3-."
                            >
                              <MoreHorizontal
                                className="w-4 h-4"
                                data-oid="nnz3v_w"
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent data-oid="g5w.a48">
                            <DropdownMenuItem
                              onClick={() => handleMoreActions("edit", user)}
                              data-oid="16:.215"
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleMoreActions("delete", user)}
                              data-oid=":1m21r3"
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
          data-oid="be3kw35"
        >
          <DialogContent data-oid="rhxls44">
            <DialogHeader data-oid="-ay97br">
              <DialogTitle data-oid="e9:enxf">User Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4" data-oid="107ypk_">
              <p data-oid="pwn79:o">
                <strong data-oid="zbgfdd3">Name:</strong> {selectedUser.name}
              </p>
              <p data-oid="q8iwz_.">
                <strong data-oid="cnaic9y">Email:</strong> {selectedUser.email}
              </p>
              <p data-oid="vxu5x7q">
                <strong data-oid="rqqs:k3">Type:</strong> {selectedUser.type}
              </p>
              <p data-oid="oe.7ly3">
                <strong data-oid="5u4xibt">Status:</strong>{" "}
                {selectedUser.status}
              </p>
              <p data-oid="fe-c6:7">
                <strong data-oid="g_1ktu0">Join Date:</strong>{" "}
                {selectedUser.joinDate}
              </p>
              <p data-oid="2yetvzu">
                <strong data-oid="ph_n03c">Last Activity:</strong>{" "}
                {selectedUser.lastActivity}
              </p>
              {selectedUser.phone_number && (
                <p data-oid="lhot4oi">
                  <strong data-oid="u90vnia">Phone:</strong>{" "}
                  {selectedUser.phone_number}
                </p>
              )}
              {selectedUser.account_balance !== undefined && (
                <p data-oid="criudmc">
                  <strong data-oid="b2p:hah">Account Balance:</strong> $
                  {selectedUser.account_balance.toFixed(2)}
                </p>
              )}
              <Button
                onClick={() => setSelectedUser(null)}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                data-oid="1nfj435"
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
