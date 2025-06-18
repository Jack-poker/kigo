import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, UserCheck, UserX, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'parent' | 'student';
  status: 'active' | 'suspended';
  joinDate: string;
  lastActivity: string;
  phone_number?: string; // Added for backend compatibility
  account_balance?: number; // Added for backend compatibility
}

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch CSRF token on mount
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:8001/admin/get-csrf-token', {
          withCredentials: true, // Ensure session_id cookie is sent
        });
        console.log('CSRF Token:', response.data.csrf_token); // Debug
        setCsrfToken(response.data.csrf_token);
      } catch (err) {
        setError('Failed to fetch CSRF token');
        console.error('CSRF token error:', err);
      }
    };
    fetchCsrfToken();
  }, []);

  // Fetch users when CSRF token is available
  useEffect(() => {
    if (!csrfToken) return;
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8001/admin/parents', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
            'X-CSRF-Token': csrfToken,
          },
          withCredentials: true, // Ensure session_id cookie is sent
        });
        // Map backend Parent model to User interface
        const mappedUsers: User[] = response.data.map((parent: any) => ({
          id: parent.parent_id,
          name: parent.fullnames,
          email: parent.email || 'N/A',
          type: 'parent', // Hardcoded as backend only returns parents
          status: 'active', // Placeholder, no status in backend
          joinDate: parent.created_at.split(' ')[0], // Format date (YYYY-MM-DD)
          lastActivity: parent.created_at.split(' ')[0], // Placeholder, no lastActivity
          phone_number: parent.phone_number,
          account_balance: parent.account_balance,
        }));
        setUsers(mappedUsers);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        console.error('Users error:', err);
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
          ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
          : u,
      ),
    );
    setError('Status toggle not implemented in backend');
    // TODO: Add PUT /admin/parents/{parent_id}/status endpoint in main.py
  };

  // Handle more actions (placeholder)
  const handleMoreActions = (action: string, user: User) => {
    console.log(`Action ${action} on user ${user.name}`);
    // TODO: Implement actions (e.g., edit, delete) when backend endpoints are added
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>User Management</span>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            Add User
          </Button>
        </CardTitle>
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-emerald-700">Name</th>
                  <th className="text-left p-4 font-medium text-emerald-700">Email</th>
                  <th className="text-left p-4 font-medium text-emerald-700">Type</th>
                  <th className="text-left p-4 font-medium text-emerald-700">Status</th>
                  <th className="text-left p-4 font-medium text-emerald-700">Join Date</th>
                  <th className="text-left p-4 font-medium text-emerald-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-emerald-50/50">
                    <td className="p-4 font-medium">{user.name}</td>
                    <td className="p-4 text-muted-foreground">{user.email}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.type === 'parent'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {user.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{user.joinDate}</td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(user)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={
                            user.status === 'active' ? 'text-red-600' : 'text-green-600'
                          }
                          onClick={() => handleToggleStatus(user)}
                        >
                          {user.status === 'active' ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => handleMoreActions('edit', user)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleMoreActions('delete', user)}
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
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Type:</strong> {selectedUser.type}
              </p>
              <p>
                <strong>Status:</strong> {selectedUser.status}
              </p>
              <p>
                <strong>Join Date:</strong> {selectedUser.joinDate}
              </p>
              <p>
                <strong>Last Activity:</strong> {selectedUser.lastActivity}
              </p>
              {selectedUser.phone_number && (
                <p>
                  <strong>Phone:</strong> {selectedUser.phone_number}
                </p>
              )}
              {selectedUser.account_balance !== undefined && (
                <p>
                  <strong>Account Balance:</strong> $
                  {selectedUser.account_balance.toFixed(2)}
                </p>
              )}
              <Button
                onClick={() => setSelectedUser(null)}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
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
