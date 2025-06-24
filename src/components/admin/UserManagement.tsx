import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
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
      // Instead of using admin.listUsers(), we'll get users from user_permissions table
      // This approach works with regular authenticated users who have super admin permissions
      const { data: permissions, error: permError } = await supabase
        .from('user_permissions')
        .select('*');
      
      if (permError) throw permError;

      // Transform the permissions data to match our User interface
      const usersWithPermissions = permissions.map(perm => ({
        id: perm.user_id,
        email: `User ${perm.user_id.substring(0, 8)}...`, // We can't get email from permissions table
        created_at: perm.created_at,
        permissions: perm
      }));

      setUsers(usersWithPermissions);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users. You may not have sufficient permissions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', createUserData);

    if (!createUserData.email || !createUserData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (createUserData.password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setCreateUserLoading(true);
    
    try {
      console.log('Creating user with email:', createUserData.email);
      
      // Use regular signUp instead of admin.createUser
      const { data, error } = await supabase.auth.signUp({
        email: createUserData.email,
        password: createUserData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('User created successfully:', data);

      // Note: The user permissions will be automatically created by the trigger
      // when the user confirms their email and signs in for the first time
      
      await fetchUsers();
      
      // Reset form and close dialog
      setCreateUserData({ email: '', password: '' });
      setShowCreateUserDialog(false);
      
      toast({
        title: "Success",
        description: "User invitation sent! They need to check their email to complete registration.",
      });
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
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
      // We can only delete the user permissions, not the actual user account
      // since that requires admin privileges
      const { error } = await supabase
        .from('user_permissions')
        .delete()
        .eq('user_id', userId);
        
      if (error) throw error;

      await fetchUsers();
      toast({
        title: "Success",
        description: "User permissions removed successfully",
      });
    } catch (error) {
      console.error('Error removing user permissions:', error);
      toast({
        title: "Error",
        description: "Failed to remove user permissions",
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
          <DialogDescription className="text-gray-400">
            Configure user access permissions for different sections of the admin panel.
          </DialogDescription>
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
        <DialogDescription className="text-gray-400">
          Send an invitation to a new user. They will receive an email to complete their registration.
        </DialogDescription>
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
            {createUserLoading ? 'Sending Invitation...' : 'Send Invitation'}
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
                Invite User
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
                <TableHead className="text-gray-300">User ID</TableHead>
                <TableHead className="text-gray-300">Role</TableHead>
                <TableHead className="text-gray-300">Created</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-gray-700">
                  <TableCell className="text-white font-mono text-sm">
                    {user.id.substring(0, 8)}...
                  </TableCell>
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
                      <Dialog open={showPermissionsDialog && selectedUser?.id === user.id} 
                             onOpenChange={(open) => {
                               setShowPermissionsDialog(open);
                               if (!open) setSelectedUser(null);
                             }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowPermissionsDialog(true);
                            }}
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
