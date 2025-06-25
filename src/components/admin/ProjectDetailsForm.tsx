
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Project } from "@/hooks/useProjects";
import { Plus, X, Save } from "lucide-react";

interface ProjectDetailsFormProps {
  project: Project;
  onUpdate: (id: string, updatedProject: Omit<Project, 'id'>) => Promise<{ success: boolean }>;
}

export const ProjectDetailsForm = ({ project, onUpdate }: ProjectDetailsFormProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formData, setFormData] = useState({
    detailed_description: project.detailed_description || '',
    project_duration: project.project_duration || '',
    team_size: project.team_size || 1,
    project_status: project.project_status || 'completed',
    client_name: project.client_name || '',
    project_category: project.project_category || 'web-development',
    demo_video_url: project.demo_video_url || '',
    goals: project.goals || [],
    objectives: project.objectives || [],
    features: project.features || [],
    challenges: project.challenges || [],
    solutions: project.solutions || [],
    gallery_images: project.gallery_images || []
  });

  const [newGoal, setNewGoal] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newChallenge, setNewChallenge] = useState('');
  const [newSolution, setNewSolution] = useState('');
  const [newGalleryImage, setNewGalleryImage] = useState('');

  const addItem = (field: keyof typeof formData, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()]
      }));
      setter('');
    }
  };

  const removeItem = (field: keyof typeof formData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    const updatedProject = {
      ...project,
      ...formData
    };
    delete (updatedProject as any).id;
    
    const result = await onUpdate(project.id, updatedProject);
    if (result.success) {
      setIsExpanded(false);
    }
  };

  const renderArrayField = (
    title: string,
    field: keyof typeof formData,
    newValue: string,
    setter: (value: string) => void,
    placeholder: string
  ) => (
    <div>
      <Label className="text-gray-200 mb-2 block">{title}</Label>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            value={newValue}
            onChange={(e) => setter(e.target.value)}
            placeholder={placeholder}
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 flex-1"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addItem(field, newValue, setter);
              }
            }}
          />
          <Button
            type="button"
            onClick={() => addItem(field, newValue, setter)}
            size="sm"
            className="bg-gray-700 hover:bg-gray-600"
          >
            <Plus size={16} />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(formData[field] as string[]).map((item, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-gray-700 text-gray-200 flex items-center gap-1"
            >
              {item}
              <X
                size={12}
                className="cursor-pointer hover:text-red-400"
                onClick={() => removeItem(field, index)}
              />
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  if (!isExpanded) {
    return (
      <Card className="bg-gray-900 border-gray-800 mt-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Project Details Management
            <Button
              onClick={() => setIsExpanded(true)}
              variant="outline"
              size="sm"
              className="border-gray-600 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Edit Details
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">
            Click "Edit Details" to manage comprehensive project information including goals, features, gallery, and more.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-800 mt-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          Project Details Management
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              size="sm"
              className="bg-green-700 hover:bg-green-600 text-white"
            >
              <Save size={16} className="mr-1" />
              Save Details
            </Button>
            <Button
              onClick={() => setIsExpanded(false)}
              variant="outline"
              size="sm"
              className="border-gray-600 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Close
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Meta Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="project_duration" className="text-gray-200">Project Duration</Label>
            <Input
              id="project_duration"
              value={formData.project_duration}
              onChange={(e) => setFormData(prev => ({ ...prev, project_duration: e.target.value }))}
              placeholder="3-6 months"
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="team_size" className="text-gray-200">Team Size</Label>
            <Input
              id="team_size"
              type="number"
              value={formData.team_size}
              onChange={(e) => setFormData(prev => ({ ...prev, team_size: parseInt(e.target.value) || 1 }))}
              placeholder="3"
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="project_status" className="text-gray-200">Project Status</Label>
            <Select value={formData.project_status} onValueChange={(value) => setFormData(prev => ({ ...prev, project_status: value }))}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client_name" className="text-gray-200">Client Name</Label>
            <Input
              id="client_name"
              value={formData.client_name}
              onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
              placeholder="Client or Company Name"
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
          <div>
            <Label htmlFor="project_category" className="text-gray-200">Project Category</Label>
            <Select value={formData.project_category} onValueChange={(value) => setFormData(prev => ({ ...prev, project_category: value }))}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="web-development">Web Development</SelectItem>
                <SelectItem value="mobile-app">Mobile App</SelectItem>
                <SelectItem value="desktop-app">Desktop App</SelectItem>
                <SelectItem value="api-development">API Development</SelectItem>
                <SelectItem value="ui-ux-design">UI/UX Design</SelectItem>
                <SelectItem value="data-science">Data Science</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Detailed Description */}
        <div>
          <Label htmlFor="detailed_description" className="text-gray-200">Detailed Description</Label>
          <Textarea
            id="detailed_description"
            value={formData.detailed_description}
            onChange={(e) => setFormData(prev => ({ ...prev, detailed_description: e.target.value }))}
            placeholder="Comprehensive project description..."
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 min-h-24"
          />
        </div>

        {/* Demo Video URL */}
        <div>
          <Label htmlFor="demo_video_url" className="text-gray-200">Demo Video URL</Label>
          <Input
            id="demo_video_url"
            value={formData.demo_video_url}
            onChange={(e) => setFormData(prev => ({ ...prev, demo_video_url: e.target.value }))}
            placeholder="https://example.com/demo-video.mp4"
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          />
        </div>

        {/* Array Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderArrayField("Goals", "goals", newGoal, setNewGoal, "Add a project goal")}
          {renderArrayField("Objectives", "objectives", newObjective, setNewObjective, "Add an objective")}
          {renderArrayField("Features", "features", newFeature, setNewFeature, "Add a feature")}
          {renderArrayField("Challenges", "challenges", newChallenge, setNewChallenge, "Add a challenge")}
        </div>

        {renderArrayField("Solutions", "solutions", newSolution, setNewSolution, "Add a solution")}
        {renderArrayField("Gallery Images", "gallery_images", newGalleryImage, setNewGalleryImage, "https://example.com/image.jpg")}
      </CardContent>
    </Card>
  );
};
