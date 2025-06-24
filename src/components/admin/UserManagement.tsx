
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserPermissions } from '@/hooks/useUserPermissions';
import { Users, Plus, Edit2, Trash2, Shield, UserPlus } from 'lucide-react';

interface User {
  id: string;
  email: string;
  created_at: string;
  permissions?: UserPermissions;
}

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const [createUserData, setCreateUserData] = useState({ email: '', password: '' });
  const [createUserLoading, setCreateUserLoading] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      if (authError) throw authError;

      const { data: permissions, error: permError } = await supabase
        .from('user_permissions')
        .select('*');
      
      if (permError) throw permError;

      const usersWithPermissions = authUsers.users.map(user => ({
        id: user.id,
        email: user.email || '',
        created_at: user.created_at,
        permissions: permissions.find(p => p.user_id === user.id)
      }));

      setUsers(usersWithPermissions);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!createUserData.email || !createUserData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setCreateUserLoading(true);
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: createUserData.email,
        password: createUserData.password,
        email_confirm: true
      });

      if (error) throw error;

      // Create default permissions for the new user
      if (data.user) {
        const { error: permError } = await supabase
          .from('user_permissions')
          .insert({
            user_id: data.user.id,
            analytics_read: true,
            analytics_write: false,
            hero_read: true,
            hero_write: false,
            projects_read: true,
            projects_write: false,
            team_read: true,
            team_write: false,
            settings_read: false,
            settings_write: false,
            is_super_admin: false
          });

        if (permError) {
          console.error('Error creating permissions:', permError);
        }
      }

      await fetchUsers();
      setShowCreateUserDialog(false);
      setCreateUserData({ email: '', password: '' });
      
      toast({
        title: "Success",
        description: "User created successfully",
      });
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    } finally {
      setCreateUserLoading(false);
    }
  };

  const updateUserPermissions = async (userId: string, updates: Partial<UserPermissions>) => {
    try {
      const { error } = await supabase
        .from('user_permissions')
        .upsert({
          user_id: userId,
          ...updates,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      await fetchUsers();
      toast({
        title: "Success",
        description: "User permissions updated successfully",
      });
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast({
        title: "Error",
        description: "Failed to update user permissions",
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      await fetchUsers();
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const PermissionsDialog = () => {
    if (!selectedUser) return null;

    const permissions: Partial<UserPermissions> = selectedUser.permissions || {
      analytics_read: false,
      analytics_write: false,
      hero_read: false,
      hero_write: false,
      projects_read: false,
      projects_write: false,
      team_read: false,
      team_write: false,
      settings_read: false,
      settings_write: false,
      is_super_admin: false
    };

    return (
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield size={20} />
            Manage Permissions: {selectedUser.email}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-200">Analytics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">Read Access</Label>
                  <Switch
                    checked={permissions.analytics_read || false}
                    onCheckedChange={(checked) => 
                      updateUserPermissions(selectedUser.id, { ...permissions, analytics_read: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">Write Access</Label>
                  <Switch
                    checked={permissions.analytics_write || false}
                    onCheckedChange={(checked) => 
                      updateUserPermissions(selectedUser.id, { ...permissions, analytics_write: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-200">Hero Section</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">Read Access</Label>
                  <Switch
                    checked={permissions.hero_read || false}
                    onCheckedChange={(checked) => 
                      updateUserPermissions(selectedUser.id, { ...permissions, hero_read: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">Write Access</Label>
                  <Switch
                    checked={permissions.hero_write || false}
                    onCheckedChange={(checked) => 
                      updateUserPermissions(selectedUser.id, { ...permissions, hero_write: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-200">Projects</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">Read Access</Label>
                  <Switch
                    checked={permissions.projects_read || false}
                    onCheckedChange={(checked) => 
                      updateUserPermissions(selectedUser.id, { ...permissions, projects_read: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">Write Access</Label>
                  <Switch
                    checked={permissions.projects_write || false}
                    onCheckedChange={(checked) => 
                      updateUserPermissions(selectedUser.id, { ...permissions, projects_write: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-200">Team</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">Read Access</Label>
                  <Switch
                    checked={permissions.team_read || false}
                    onCheckedChange={(checked) => 
                      updateUserPermissions(selectedUser.id, { ...permissions, team_read: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">Write Access</Label>
                  <Switch
                    checked={permissions.team_write || false}
                    onCheckedChange={(checked) => 
                      updateUserPermissions(selectedUser.id, { ...permissions, team_write: checked })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-200">Super Administrator</h3>
                <p className="text-sm text-gray-400">Full access to all features and settings</p>
              </div>
              <Switch
                checked={permissions.is_super_admin || false}
                onCheckedChange={(checked) => 
                  updateUserPermissions(selectedUser.id, { ...permissions, is_super_admin: checked })
                }
              />
            </div>
          </div>
        </div>
      </DialogContent>
    );
  };

  const CreateUserDialog = () => (
    <DialogContent className="bg-gray-900 border-gray-800 text-white">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <UserPlus size={20} />
          Create New User
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleCreateUser} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="create-email" className="text-gray-300">Email</Label>
          <Input
            id="create-email"
            type="email"
            value={createUserData.email}
            onChange={(e) => setCreateUserData(prev => ({ ...prev, email: e.target.value }))}
            className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
            placeholder="user@example.com"
            required
            disabled={createUserLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="create-password" className="text-gray-300">Password</Label>
          <Input
            id="create-password"
            type="password"
            value={createUserData.password}
            onChange={(e) => setCreateUserData(prev => ({ ...prev, password: e.target.value }))}
            className="bg-gray-800 border-gray-700 text-white focus:border-blue-500"
            placeholder="Enter password"
            required
            disabled={createUserLoading}
            minLength={6}
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShowCreateUserDialog(false);
              setCreateUserData({ email: '', password: '' });
            }}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
            disabled={createUserLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createUserLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {createUserLoading ? 'Creating...' : 'Create User'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="text-center text-gray-400">Loading users...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Users size={20} />
            User Management
          </CardTitle>
          <Dialog open={showCreateUserDialog} onOpenChange={setShowCreateUserDialog}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <UserPlus size={16} className="mr-2" />
                Create User
              </Button>
            </DialogTrigger>
            <CreateUserDialog />
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Email</TableHead>
                <TableHead className="text-gray-300">Role</TableHead>
                <TableHead className="text-gray-300">Created</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-gray-700">
                  <TableCell className="text-white">{user.email}</TableCell>
                  <TableCell>
                    {user.permissions?.is_super_admin ? (
                      <Badge className="bg-red-600">Super Admin</Badge>
                    ) : (
                      <Badge variant="secondary">User</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Dialog open={showPermissionsDialog} onOpenChange={setShowPermissionsDialog}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            <Edit2 size={16} />
                          </Button>
                        </DialogTrigger>
                        <PermissionsDialog />
                      </Dialog>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteUser(user.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
