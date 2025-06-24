import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useTeamMembers, TeamMember } from "@/hooks/useTeamMembers";
import { Edit, Plus, Github, Linkedin, Mail } from "lucide-react";

export const TeamManagement = () => {
  const { teamMembers, addTeamMember } = useTeamMembers();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [teamForm, setTeamForm] = useState({
    name: '',
    role: '',
    bio: '',
    image: '/placeholder.svg',
    skills: '',
    github: '',
    linkedin: '',
    email: ''
  });

  const handleMemberSelect = (member: TeamMember) => {
    setSelectedMember(member);
    setTeamForm({
      name: member.name,
      role: member.role,
      bio: member.bio,
      image: member.image,
      skills: member.skills.join(', '),
      github: member.github || '',
      linkedin: member.linkedin || '',
      email: member.email || ''
    });
    setIsEditing(true);
  };

  const handleNewMember = () => {
    setSelectedMember(null);
    setTeamForm({
      name: '',
      role: '',
      bio: '',
      image: '/placeholder.svg',
      skills: '',
      github: '',
      linkedin: '',
      email: ''
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const skillsArray = teamForm.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
    
    const result = await addTeamMember({
      ...teamForm,
      skills: skillsArray,
      github: teamForm.github || undefined,
      linkedin: teamForm.linkedin || undefined,
      email: teamForm.email || undefined
    });

    if (result.success) {
      handleNewMember();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Form Section */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            {isEditing ? <Edit size={20} /> : <Plus size={20} />}
            {isEditing ? 'Edit Team Member' : 'Add New Team Member'}
          </CardTitle>
          {isEditing && (
            <Button 
              onClick={handleNewMember} 
              variant="outline" 
              size="sm" 
              className="border-gray-600 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700 hover:border-gray-500"
            >
              Add New
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="memberName" className="text-gray-200">Name</Label>
                <Input
                  id="memberName"
                  value={teamForm.name}
                  onChange={(e) => setTeamForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter team member name"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <Label htmlFor="memberRole" className="text-gray-200">Role</Label>
                <Input
                  id="memberRole"
                  value={teamForm.role}
                  onChange={(e) => setTeamForm(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="Enter role"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="memberBio" className="text-gray-200">Bio</Label>
              <textarea
                id="memberBio"
                value={teamForm.bio}
                onChange={(e) => setTeamForm(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Enter bio"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
                rows={3}
                required
              />
            </div>
            <div>
              <Label htmlFor="memberSkills" className="text-gray-200">Skills (comma separated)</Label>
              <Input
                id="memberSkills"
                value={teamForm.skills}
                onChange={(e) => setTeamForm(prev => ({ ...prev, skills: e.target.value }))}
                placeholder="React, Design, Leadership"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="memberGithub" className="text-gray-200">GitHub (optional)</Label>
                <Input
                  id="memberGithub"
                  value={teamForm.github}
                  onChange={(e) => setTeamForm(prev => ({ ...prev, github: e.target.value }))}
                  placeholder="https://github.com/username"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="memberLinkedin" className="text-gray-200">LinkedIn (optional)</Label>
                <Input
                  id="memberLinkedin"
                  value={teamForm.linkedin}
                  onChange={(e) => setTeamForm(prev => ({ ...prev, linkedin: e.target.value }))}
                  placeholder="https://linkedin.com/in/username"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
              <div>
                <Label htmlFor="memberEmail" className="text-gray-200">Email (optional)</Label>
                <Input
                  id="memberEmail"
                  value={teamForm.email}
                  onChange={(e) => setTeamForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@example.com"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gray-800 border border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500"
            >
              {isEditing ? 'Update Team Member' : 'Add Team Member'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Team Members Preview ({teamMembers.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-96">
            <div className="p-6 space-y-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedMember?.id === member.id
                      ? 'border-white bg-gray-800'
                      : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
                  }`}
                  onClick={() => handleMemberSelect(member)}
                >
                  <div className="flex gap-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">{member.name}</h3>
                        <span className="text-sm text-gray-400">{member.role}</span>
                      </div>
                      <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                        {member.bio}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {member.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {member.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{member.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {member.github && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-6 px-2 border-gray-600 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700"
                          >
                            <Github size={12} />
                          </Button>
                        )}
                        {member.linkedin && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-6 px-2 border-gray-600 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700"
                          >
                            <Linkedin size={12} />
                          </Button>
                        )}
                        {member.email && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-6 px-2 border-gray-600 bg-gray-800 text-gray-300 hover:text-white hover:bg-gray-700"
                          >
                            <Mail size={12} />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
