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
    <Card data-oid="h7_wxt5">
      <CardHeader data-oid="gga4_w:">
        <CardTitle
          className="flex items-center justify-between"
          data-oid="cdsm5r8"
        >
          <span data-oid="dtkbc9j">User Management</span>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            data-oid="aq_nfdd"
          >
            Add User
          </Button>
        </CardTitle>
        <div className="flex items-center space-x-4" data-oid="s8n9_wf">
          <div className="relative flex-1 max-w-sm" data-oid="gqsmmpj">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              data-oid="q8ul.:u"
            />

            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-oid="hat3yrt"
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            data-oid="ncrb-lq"
          >
            <Filter className="w-4 h-4" data-oid="wh2akfr" />
            <span data-oid="cwyjg.x">Filter</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent data-oid="0iwm9z3">
        {error && (
          <p className="text-red-500 mb-4" data-oid="y-s1fop">
            {error}
          </p>
        )}
        {loading ? (
          <p className="text-gray-600" data-oid="b7a3she">
            Loading...
          </p>
        ) : (
          <div className="overflow-x-auto" data-oid="lyui41_">
            <table className="w-full" data-oid=":oqao-l">
              <thead data-oid="o4d3lbu">
                <tr className="border-b" data-oid="-8fvax9">
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid=":dxu5vp"
                  >
                    Name
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="uz1zz6s"
                  >
                    Email
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="apf6:iq"
                  >
                    Type
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="9t71e.4"
                  >
                    Status
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="tgpu666"
                  >
                    Join Date
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="3k..292"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody data-oid=":m4ahy.">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-emerald-50/50"
                    data-oid="aq1t3p4"
                  >
                    <td className="p-4 font-medium" data-oid="112cdbo">
                      {user.name}
                    </td>
                    <td
                      className="p-4 text-muted-foreground"
                      data-oid="ey6.y7."
                    >
                      {user.email}
                    </td>
                    <td className="p-4" data-oid="r-2k-v8">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.type === "parent"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                        data-oid="kb7qmht"
                      >
                        {user.type}
                      </span>
                    </td>
                    <td className="p-4" data-oid="toukgj1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                        data-oid="_dwobaq"
                      >
                        {user.status}
                      </span>
                    </td>
                    <td
                      className="p-4 text-muted-foreground"
                      data-oid="o9vvdt-"
                    >
                      {user.joinDate}
                    </td>
                    <td className="p-4" data-oid="87he1qs">
                      <div
                        className="flex items-center space-x-2"
                        data-oid="gpa5wct"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(user)}
                          data-oid="d99te7y"
                        >
                          <Eye className="w-4 h-4" data-oid="5a:b20w" />
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
                          data-oid="k70qefw"
                        >
                          {user.status === "active" ? (
                            <UserX className="w-4 h-4" data-oid="nugqglp" />
                          ) : (
                            <UserCheck className="w-4 h-4" data-oid="-hjvm2-" />
                          )}
                        </Button>
                        <DropdownMenu data-oid="gesz_q6">
                          <DropdownMenuTrigger asChild data-oid="793c9dp">
                            <Button
                              variant="outline"
                              size="sm"
                              data-oid="8qop:5m"
                            >
                              <MoreHorizontal
                                className="w-4 h-4"
                                data-oid="1tn1oci"
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent data-oid="9a18oa0">
                            <DropdownMenuItem
                              onClick={() => handleMoreActions("edit", user)}
                              data-oid="08tq7.k"
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleMoreActions("delete", user)}
                              data-oid="cgw3e-e"
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
          data-oid="8d1-4il"
        >
          <DialogContent data-oid="lfsdya2">
            <DialogHeader data-oid="._c3ag8">
              <DialogTitle data-oid="wc0wxo6">User Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4" data-oid="lnn.0a2">
              <p data-oid="lhu-c_k">
                <strong data-oid=":mh9awf">Name:</strong> {selectedUser.name}
              </p>
              <p data-oid="fwliu.9">
                <strong data-oid="6g_m1.4">Email:</strong> {selectedUser.email}
              </p>
              <p data-oid=":dgoqbd">
                <strong data-oid="jexh8q6">Type:</strong> {selectedUser.type}
              </p>
              <p data-oid="cel6hew">
                <strong data-oid="5n.ucnz">Status:</strong>{" "}
                {selectedUser.status}
              </p>
              <p data-oid="t.yof30">
                <strong data-oid="aa14:xu">Join Date:</strong>{" "}
                {selectedUser.joinDate}
              </p>
              <p data-oid="d38r5:x">
                <strong data-oid=":xy3j3o">Last Activity:</strong>{" "}
                {selectedUser.lastActivity}
              </p>
              {selectedUser.phone_number && (
                <p data-oid="vtkst4r">
                  <strong data-oid="9ollcy7">Phone:</strong>{" "}
                  {selectedUser.phone_number}
                </p>
              )}
              {selectedUser.account_balance !== undefined && (
                <p data-oid="ssrd65d">
                  <strong data-oid="074m-yd">Account Balance:</strong> $
                  {selectedUser.account_balance.toFixed(2)}
                </p>
              )}
              <Button
                onClick={() => setSelectedUser(null)}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                data-oid="9vn6uq7"
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
