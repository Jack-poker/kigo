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
          "http://localhost:8002/admin/get-csrf-token",
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
          "http://localhost:8002/admin/parents",
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
    <Card data-oid=":elzl0z">
      <CardHeader data-oid="vg56sbj">
        <CardTitle
          className="flex items-center justify-between"
          data-oid="-crm7om"
        >
          <span data-oid=":nt:l16">User Management</span>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            data-oid="tw-4x-7"
          >
            Add User
          </Button>
        </CardTitle>
        <div className="flex items-center space-x-4" data-oid="wmnw-9v">
          <div className="relative flex-1 max-w-sm" data-oid="_szi6u8">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
              data-oid="3:yihf0"
            />

            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-oid="qcr.4z7"
            />
          </div>
          <Button
            variant="outline"
            className="flex items-center space-x-2"
            data-oid="mnftpjz"
          >
            <Filter className="w-4 h-4" data-oid="1-el2hd" />
            <span data-oid="jp3zdig">Filter</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent data-oid="ybv6h0v">
        {error && (
          <p className="text-red-500 mb-4" data-oid="uhm8m10">
            {error}
          </p>
        )}
        {loading ? (
          <p className="text-gray-600" data-oid="zosftp2">
            Loading...
          </p>
        ) : (
          <div className="overflow-x-auto" data-oid="djn7.lw">
            <table className="w-full" data-oid="96bcmzj">
              <thead data-oid="6mvp_kf">
                <tr className="border-b" data-oid="zf2yu67">
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="fdv.spd"
                  >
                    Name
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="vnjaaig"
                  >
                    Email
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="p.d9a4x"
                  >
                    Type
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="ptfo19u"
                  >
                    Status
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="lsr46fb"
                  >
                    Join Date
                  </th>
                  <th
                    className="text-left p-4 font-medium text-emerald-700"
                    data-oid="8c-ojeq"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody data-oid="yx0wfww">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-emerald-50/50"
                    data-oid="0v73zeg"
                  >
                    <td className="p-4 font-medium" data-oid="0lmkzjq">
                      {user.name}
                    </td>
                    <td
                      className="p-4 text-muted-foreground"
                      data-oid="lb_z4-c"
                    >
                      {user.email}
                    </td>
                    <td className="p-4" data-oid="0l9:2-8">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.type === "parent"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                        data-oid="apt2gk0"
                      >
                        {user.type}
                      </span>
                    </td>
                    <td className="p-4" data-oid="si7j:qo">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                        data-oid="qk62qp7"
                      >
                        {user.status}
                      </span>
                    </td>
                    <td
                      className="p-4 text-muted-foreground"
                      data-oid="c3on5jr"
                    >
                      {user.joinDate}
                    </td>
                    <td className="p-4" data-oid="pafho7n">
                      <div
                        className="flex items-center space-x-2"
                        data-oid="tq3pgkn"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(user)}
                          data-oid="bqs:t61"
                        >
                          <Eye className="w-4 h-4" data-oid="b5kz3ad" />
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
                          data-oid="nad1gc2"
                        >
                          {user.status === "active" ? (
                            <UserX className="w-4 h-4" data-oid="u339ow2" />
                          ) : (
                            <UserCheck className="w-4 h-4" data-oid="tpfc2z3" />
                          )}
                        </Button>
                        <DropdownMenu data-oid="lp602pn">
                          <DropdownMenuTrigger asChild data-oid="sf94d91">
                            <Button
                              variant="outline"
                              size="sm"
                              data-oid="thh.4jo"
                            >
                              <MoreHorizontal
                                className="w-4 h-4"
                                data-oid="5vlgey_"
                              />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent data-oid="gx-jo0v">
                            <DropdownMenuItem
                              onClick={() => handleMoreActions("edit", user)}
                              data-oid="j_22ehb"
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleMoreActions("delete", user)}
                              data-oid="38ijr:n"
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
          data-oid="0kr8.o5"
        >
          <DialogContent data-oid="jh1dgns">
            <DialogHeader data-oid="55rbpd4">
              <DialogTitle data-oid="my17e08">User Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4" data-oid="_1dt_yy">
              <p data-oid="ive:kof">
                <strong data-oid="jhtz6.w">Name:</strong> {selectedUser.name}
              </p>
              <p data-oid="xz7u1rk">
                <strong data-oid="0o:h2q_">Email:</strong> {selectedUser.email}
              </p>
              <p data-oid="1i_e01v">
                <strong data-oid="rbze.ni">Type:</strong> {selectedUser.type}
              </p>
              <p data-oid="tpvnqcg">
                <strong data-oid="elg:wda">Status:</strong>{" "}
                {selectedUser.status}
              </p>
              <p data-oid="5:nl8:8">
                <strong data-oid="t9h0vbr">Join Date:</strong>{" "}
                {selectedUser.joinDate}
              </p>
              <p data-oid="6ud6ucy">
                <strong data-oid="36kgz:e">Last Activity:</strong>{" "}
                {selectedUser.lastActivity}
              </p>
              {selectedUser.phone_number && (
                <p data-oid="arqs4kl">
                  <strong data-oid="x0v2.ka">Phone:</strong>{" "}
                  {selectedUser.phone_number}
                </p>
              )}
              {selectedUser.account_balance !== undefined && (
                <p data-oid="nynuc28">
                  <strong data-oid="8qn3xw2">Account Balance:</strong> $
                  {selectedUser.account_balance.toFixed(2)}
                </p>
              )}
              <Button
                onClick={() => setSelectedUser(null)}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                data-oid="d46clpd"
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
