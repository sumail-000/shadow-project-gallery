
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
import { Users, Plus, Edit2, Trash2, Shield, UserPlus, Mail, Calendar, Lock, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
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
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    try {
      // Get all user permissions first
      const { data: permissions, error: permError } = await supabase
        .from('user_permissions')
        .select('*');
      
      if (permError) throw permError;

      // Since we can't access user emails directly, we'll show user IDs with a fallback display
      const usersWithFallbackEmails = permissions.map((perm) => ({
        id: perm.user_id,
        email: `User ${perm.user_id.substring(0, 8)}...`,
        created_at: perm.created_at,
        last_sign_in_at: null,
        permissions: perm
      }));

      setUsers(usersWithFallbackEmails);
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
      
      // Use regular signUp to create the user
      const { data, error } = await supabase.auth.signUp({
        email: createUserData.email,
        password: createUserData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });

      if (error) {
        console.error('Auth signup error:', error);
        throw error;
      }

      console.log('User created:', data.user?.id);

      if (data.user) {
        // Wait a moment for the user to be fully created in the auth system
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create default permissions for the new user
        const permissionsData = {
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
        };

        console.log('Creating permissions:', permissionsData);

        const { error: permError } = await supabase
          .from('user_permissions')
          .insert(permissionsData);

        if (permError) {
          console.error('Error creating permissions:', permError);
          // Don't throw here as the user was created successfully
          toast({
            title: "Warning",
            description: "User created but permissions setup failed. Please set permissions manually.",
            variant: "destructive",
          });
        }
      }
      
      await fetchUsers();
      
      setCreateUserData({ email: '', password: '' });
      setShowCreateUserDialog(false);
      
      toast({
        title: "Success",
        description: "User created successfully! They can now sign in with their credentials.",
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

  const handlePermissionChange = async (userId: string, permissionKey: keyof UserPermissions, value: boolean) => {
    // Prevent users from modifying their own permissions
    if (userId === currentUser?.id) {
      toast({
        title: "Action Not Allowed",
        description: "You cannot modify your own permissions.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_permissions')
        .update({ [permissionKey]: value, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (error) throw error;

      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId && user.permissions
            ? {
                ...user,
                permissions: {
                  ...user.permissions,
                  [permissionKey]: value
                }
              }
            : user
        )
      );

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
    // Prevent users from deleting themselves
    if (userId === currentUser?.id) {
      toast({
        title: "Action Not Allowed",
        description: "You cannot delete your own account.",
        variant: "destructive",
      });
      return;
    }

    // Prevent deleting super admins
    const userToDelete = users.find(u => u.id === userId);
    if (userToDelete?.permissions?.is_super_admin) {
      toast({
        title: "Action Not Allowed",
        description: "Cannot delete super admin users.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Delete user permissions first
      const { error: permError } = await supabase
        .from('user_permissions')
        .delete()
        .eq('user_id', userId);
        
      if (permError) throw permError;

      await fetchUsers();
      
      toast({
        title: "Success",
        description: "User removed successfully",
      });
    } catch (error) {
      console.error('Error removing user:', error);
      toast({
        title: "Error",
        description: "Failed to remove user",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const PermissionsDialog = () => {
    if (!selectedUser || !selectedUser.permissions) return null;

    const permissions = selectedUser.permissions;
    const isCurrentUser = selectedUser.id === currentUser?.id;

    return (
      <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Shield size={24} />
            Manage Permissions
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure user access permissions for different sections of the admin panel.
            {isCurrentUser && (
              <span className="block mt-2 text-amber-400 font-medium">
                ⚠️ Note: You cannot modify your own permissions
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PermissionSection
              title="Analytics"
              icon="📊"
              permissions={permissions}
              onPermissionChange={(key, value) => handlePermissionChange(selectedUser.id, key, value)}
              readKey="analytics_read"
              writeKey="analytics_write"
              disabled={isCurrentUser}
            />

            <PermissionSection
              title="Hero Section"
              icon="🏠"
              permissions={permissions}
              onPermissionChange={(key, value) => handlePermissionChange(selectedUser.id, key, value)}
              readKey="hero_read"
              writeKey="hero_write"
              disabled={isCurrentUser}
            />

            <PermissionSection
              title="Projects"
              icon="📁"
              permissions={permissions}
              onPermissionChange={(key, value) => handlePermissionChange(selectedUser.id, key, value)}
              readKey="projects_read"
              writeKey="projects_write"
              disabled={isCurrentUser}
            />

            <PermissionSection
              title="Team"
              icon="👥"
              permissions={permissions}
              onPermissionChange={(key, value) => handlePermissionChange(selectedUser.id, key, value)}
              readKey="team_read"
              writeKey="team_write"
              disabled={isCurrentUser}
            />

            <PermissionSection
              title="Settings"
              icon="⚙️"
              permissions={permissions}
              onPermissionChange={(key, value) => handlePermissionChange(selectedUser.id, key, value)}
              readKey="settings_read"
              writeKey="settings_write"
              disabled={isCurrentUser}
            />
          </div>

          <div className="border-t border-gray-700 pt-6">
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                  <Shield size={20} />
                  Super Administrator
                </h3>
                <p className="text-sm text-gray-400">Full access to all features and user management</p>
              </div>
              <Switch
                checked={permissions.is_super_admin}
                onCheckedChange={(checked) => 
                  handlePermissionChange(selectedUser.id, 'is_super_admin', checked)
                }
                disabled={isCurrentUser}
                className={isCurrentUser ? "opacity-50" : ""}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    );
  };

  const PermissionSection = ({ 
    title, 
    icon, 
    permissions, 
    onPermissionChange, 
    readKey, 
    writeKey, 
    disabled 
  }: {
    title: string;
    icon: string;
    permissions: UserPermissions;
    onPermissionChange: (key: keyof UserPermissions, value: boolean) => void;
    readKey: keyof UserPermissions;
    writeKey: keyof UserPermissions;
    disabled: boolean;
  }) => (
    <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2 mb-4">
        <span className="text-xl">{icon}</span>
        {title}
      </h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-gray-300 font-medium">Read Access</Label>
          <Switch
            checked={permissions[readKey] as boolean}
            onCheckedChange={(checked) => onPermissionChange(readKey, checked)}
            disabled={disabled}
            className={disabled ? "opacity-50" : ""}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-gray-300 font-medium">Write Access</Label>
          <Switch
            checked={permissions[writeKey] as boolean}
            onCheckedChange={(checked) => onPermissionChange(writeKey, checked)}
            disabled={disabled}
            className={disabled ? "opacity-50" : ""}
          />
        </div>
      </div>
    </div>
  );

  const CreateUserDialog = () => (
    <DialogContent className="bg-gray-900 border-gray-800 text-white">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-xl">
          <UserPlus size={24} />
          Create New User
        </DialogTitle>
        <DialogDescription className="text-gray-400">
          Create a new admin user account. They will be able to sign in immediately with these credentials.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleCreateUser} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="create-email" className="text-gray-300 flex items-center gap-2 font-medium">
            <Mail size={16} />
            Email Address
          </Label>
          <Input
            id="create-email"
            type="email"
            value={createUserData.email}
            onChange={(e) => setCreateUserData(prev => ({ ...prev, email: e.target.value }))}
            className="bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
            placeholder="user@example.com"
            required
            disabled={createUserLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="create-password" className="text-gray-300 flex items-center gap-2 font-medium">
            <Lock size={16} />
            Password
          </Label>
          <Input
            id="create-password"
            type="password"
            value={createUserData.password}
            onChange={(e) => setCreateUserData(prev => ({ ...prev, password: e.target.value }))}
            className="bg-gray-800 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter password (min 6 characters)"
            required
            disabled={createUserLoading}
            minLength={6}
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
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
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {createUserLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating User...
              </>
            ) : (
              <>
                <UserPlus size={16} className="mr-2" />
                Create User
              </>
            )}
          </Button>
        </div>
      </form>
    </DialogContent>
  );

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-8">
          <div className="text-center text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-4"></div>
            <p>Loading users...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-3 text-white text-xl">
              <Users size={24} />
              User Management
            </CardTitle>
            <p className="text-gray-400 mt-1">Manage admin users and their permissions</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-gray-700 text-gray-300 px-3 py-1">
              {users.length} {users.length === 1 ? 'User' : 'Users'}
            </Badge>
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
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700 bg-gray-800/50">
                <TableHead className="text-gray-300 font-medium px-6 py-4">User</TableHead>
                <TableHead className="text-gray-300 font-medium px-6 py-4">Role</TableHead>
                <TableHead className="text-gray-300 font-medium px-6 py-4">Active Permissions</TableHead>
                <TableHead className="text-gray-300 font-medium px-6 py-4">Created</TableHead>
                <TableHead className="text-gray-300 font-medium px-6 py-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-gray-700/50 hover:bg-gray-800/30 transition-colors">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full">
                        <User size={20} className="text-gray-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{user.email}</span>
                          {user.id === currentUser?.id && (
                            <Badge variant="outline" className="text-xs text-blue-400 border-blue-400">
                              You
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">ID: {user.id.substring(0, 8)}...</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {user.permissions?.is_super_admin ? (
                      <Badge className="bg-red-600 hover:bg-red-700">
                        <Shield size={12} className="mr-1" />
                        Super Admin
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                        <User size={12} className="mr-1" />
                        Admin User
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {user.permissions?.analytics_write && (
                        <Badge className="bg-green-600 text-xs">Analytics</Badge>
                      )}
                      {user.permissions?.hero_write && (
                        <Badge className="bg-blue-600 text-xs">Hero</Badge>
                      )}
                      {user.permissions?.projects_write && (
                        <Badge className="bg-purple-600 text-xs">Projects</Badge>
                      )}
                      {user.permissions?.team_write && (
                        <Badge className="bg-orange-600 text-xs">Team</Badge>
                      )}
                      {user.permissions?.settings_write && (
                        <Badge className="bg-gray-600 text-xs">Settings</Badge>
                      )}
                      {!user.permissions?.analytics_write && 
                       !user.permissions?.hero_write && 
                       !user.permissions?.projects_write && 
                       !user.permissions?.team_write && 
                       !user.permissions?.settings_write && (
                        <Badge variant="outline" className="text-xs text-gray-400">Read Only</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Dialog 
                        open={showPermissionsDialog && selectedUser?.id === user.id} 
                        onOpenChange={(open) => {
                          setShowPermissionsDialog(open);
                          if (!open) setSelectedUser(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowPermissionsDialog(true);
                            }}
                            className="text-blue-400 hover:text-blue-300 hover:bg-gray-800 h-8 w-8 p-0"
                          >
                            <Edit2 size={14} />
                          </Button>
                        </DialogTrigger>
                        <PermissionsDialog />
                      </Dialog>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteUser(user.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-gray-800 h-8 w-8 p-0"
                        disabled={user.id === currentUser?.id || user.permissions?.is_super_admin}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {users.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Users size={48} className="mx-auto mb-4 text-gray-600" />
            <p className="text-lg font-medium">No users found</p>
            <p className="text-sm">Create your first admin user to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
