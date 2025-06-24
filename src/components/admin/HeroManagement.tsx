
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useHeroContent } from "@/hooks/useHeroContent";
import { Edit, Save, Eye } from "lucide-react";

export const HeroManagement = () => {
  const { heroContent, loading, updateHeroContent } = useHeroContent();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    main_heading: '',
    subtitle: '',
    description: '',
    github_url: '',
    linkedin_url: '',
    email_url: ''
  });

  useEffect(() => {
    if (heroContent) {
      setFormData({
        main_heading: heroContent.main_heading,
        subtitle: heroContent.subtitle,
        description: heroContent.description,
        github_url: heroContent.github_url || '',
        linkedin_url: heroContent.linkedin_url || '',
        email_url: heroContent.email_url || ''
      });
    }
  }, [heroContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await updateHeroContent(formData);
    if (result.success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (heroContent) {
      setFormData({
        main_heading: heroContent.main_heading,
        subtitle: heroContent.subtitle,
        description: heroContent.description,
        github_url: heroContent.github_url || '',
        linkedin_url: heroContent.linkedin_url || '',
        email_url: heroContent.email_url || ''
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <div className="text-white text-center">Loading hero content...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Edit Form */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Edit size={20} />
            Hero Section Content
          </CardTitle>
          {!isEditing && (
            <Button 
              onClick={() => setIsEditing(true)}
              variant="outline" 
              size="sm" 
              className="border-gray-600 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 hover:border-gray-500"
            >
              <Edit size={16} className="mr-2" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="main_heading" className="text-gray-200">Main Heading</Label>
              <Input
                id="main_heading"
                value={formData.main_heading}
                onChange={(e) => setFormData(prev => ({ ...prev, main_heading: e.target.value }))}
                placeholder="Full Stack Developer"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                disabled={!isEditing}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="subtitle" className="text-gray-200">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Passionate about creating innovative solutions..."
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 resize-none"
                rows={3}
                disabled={!isEditing}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-gray-200">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Welcome to my portfolio showcasing..."
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 resize-none"
                rows={2}
                disabled={!isEditing}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="github_url" className="text-gray-200">GitHub URL</Label>
                <Input
                  id="github_url"
                  value={formData.github_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                  placeholder="https://github.com/username"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="linkedin_url" className="text-gray-200">LinkedIn URL</Label>
                <Input
                  id="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                  placeholder="https://linkedin.com/in/username"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="email_url" className="text-gray-200">Email URL</Label>
                <Input
                  id="email_url"
                  value={formData.email_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, email_url: e.target.value }))}
                  placeholder="mailto:your.email@example.com"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            {isEditing && (
              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-gray-800 border border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500"
                >
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
                <Button 
                  type="button" 
                  onClick={handleCancel}
                  variant="outline" 
                  className="flex-1 border-gray-600 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 hover:border-gray-500"
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Eye size={20} />
            Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 p-4 bg-black rounded-lg border border-gray-700">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              {formData.main_heading}
            </h1>
            <p className="text-lg text-gray-300">
              {formData.subtitle}
            </p>
            <p className="text-base text-gray-400">
              {formData.description}
            </p>
            <div className="flex gap-4">
              {formData.github_url && formData.github_url !== '#' && (
                <div className="text-sm text-blue-400">GitHub: {formData.github_url}</div>
              )}
              {formData.linkedin_url && formData.linkedin_url !== '#' && (
                <div className="text-sm text-blue-500">LinkedIn: {formData.linkedin_url}</div>
              )}
              {formData.email_url && formData.email_url !== '#' && (
                <div className="text-sm text-purple-400">Email: {formData.email_url}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
