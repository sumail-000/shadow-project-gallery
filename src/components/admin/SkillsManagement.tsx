
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Eye, Code, Database, Wrench, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUserPermissions } from "@/hooks/useUserPermissions";

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  created_at?: string;
  updated_at?: string;
}

const categories = ["Frontend", "Backend", "Tools & Others"];
const categoryIcons = {
  "Frontend": Code,
  "Backend": Database,
  "Tools & Others": Wrench,
};

export const SkillsManagement = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    level: [85],
    category: "Frontend"
  });
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();
  const { permissions } = useUserPermissions();

  const canWrite = permissions?.is_super_admin || permissions?.projects_write;

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true })
        .order('level', { ascending: false });

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setSkills(data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      toast({
        title: "Error",
        description: "Failed to fetch skills",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canWrite) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to modify skills",
        variant: "destructive",
      });
      return;
    }

    try {
      const skillData = {
        name: formData.name,
        level: formData.level[0],
        category: formData.category,
      };

      if (editingSkill) {
        const { error } = await supabase
          .from('skills')
          .update({ ...skillData, updated_at: new Date().toISOString() })
          .eq('id', editingSkill.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Skill updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('skills')
          .insert([skillData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Skill added successfully",
        });
      }

      fetchSkills();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving skill:', error);
      toast({
        title: "Error",
        description: "Failed to save skill",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!canWrite) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to delete skills",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Skill deleted successfully",
      });

      fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      level: [85],
      category: "Frontend"
    });
    setEditingSkill(null);
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      level: [skill.level],
      category: skill.category
    });
    setIsDialogOpen(true);
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-48 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Skills Management</h2>
          <p className="text-gray-400 mt-1">Manage your technical skills and expertise levels</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setPreviewMode(!previewMode)}
            variant="outline"
            className="border-gray-600 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700"
          >
            <Eye size={16} className="mr-2" />
            {previewMode ? "Edit Mode" : "Preview"}
          </Button>
          {canWrite && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={resetForm}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus size={16} className="mr-2" />
                  Add Skill
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>{editingSkill ? "Edit Skill" : "Add New Skill"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Skill Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., React, Node.js, Docker"
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {categories.map(category => (
                          <SelectItem key={category} value={category} className="text-white">
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="level">Skill Level: {formData.level[0]}%</Label>
                    <Slider
                      value={formData.level}
                      onValueChange={(value) => setFormData({ ...formData, level: value })}
                      max={100}
                      min={0}
                      step={5}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      <Save size={16} className="mr-2" />
                      {editingSkill ? "Update" : "Add"} Skill
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      className="border-gray-600 text-gray-300 hover:text-white"
                    >
                      <X size={16} className="mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <Tabs defaultValue="manage" className="space-y-6">
        <TabsList className="bg-gray-900 border-gray-800">
          <TabsTrigger value="manage" className="data-[state=active]:bg-gray-800">Manage Skills</TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-gray-800">By Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="manage" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <Card key={skill.id} className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-lg">{skill.name}</CardTitle>
                      <CardDescription className="text-gray-400">
                        <Badge variant="outline" className="mt-1 border-gray-600 text-gray-300">
                          {skill.category}
                        </Badge>
                      </CardDescription>
                    </div>
                    {canWrite && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(skill)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(skill.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Proficiency</span>
                      <span className="text-blue-400 font-semibold">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {skills.length === 0 && (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="text-center py-12">
                <p className="text-gray-400">No skills added yet. Click "Add Skill" to get started.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => {
            const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Code;
            
            return (
              <Card key={category} className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <IconComponent className="w-5 h-5 text-blue-400" />
                    {category} ({categorySkills.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <span className="text-gray-200">{skill.name}</span>
                        <Badge variant="outline" className="border-blue-500 text-blue-400">
                          {skill.level}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
};
