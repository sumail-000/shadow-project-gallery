
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePortfolioSettings } from "@/hooks/usePortfolioSettings";
import { useToast } from "@/hooks/use-toast";
import { Settings, Save } from "lucide-react";

export const SettingsManagement = () => {
  const { settings, updateSettings } = usePortfolioSettings();
  const { toast } = useToast();
  
  const [settingsForm, setSettingsForm] = useState({
    portfolio_title: '',
    contact_email: '',
    phone: ''
  });

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        portfolio_title: settings.portfolio_title,
        contact_email: settings.contact_email,
        phone: settings.phone
      });
    }
  }, [settings]);

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await updateSettings(settingsForm);
    if (result.success) {
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Form Section */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings size={20} />
            Portfolio Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateSettings} className="space-y-6">
            <div>
              <Label htmlFor="portfolioTitle">Portfolio Title</Label>
              <Input
                id="portfolioTitle"
                value={settingsForm.portfolio_title}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, portfolio_title: e.target.value }))}
                className="bg-gray-800 border-gray-700"
                required
              />
              <p className="text-sm text-gray-400 mt-1">
                This will be displayed as the main title of your portfolio
              </p>
            </div>
            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settingsForm.contact_email}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, contact_email: e.target.value }))}
                className="bg-gray-800 border-gray-700"
                required
              />
              <p className="text-sm text-gray-400 mt-1">
                Primary email for contact inquiries
              </p>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={settingsForm.phone}
                onChange={(e) => setSettingsForm(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-gray-800 border-gray-700"
                required
              />
              <p className="text-sm text-gray-400 mt-1">
                Contact phone number for business inquiries
              </p>
            </div>
            <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">
              <Save size={16} className="mr-2" />
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle>Settings Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="p-4 border border-gray-700 rounded-lg">
              <h3 className="font-semibold text-white mb-2">Current Configuration</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-400">Portfolio Title:</span>
                  <p className="text-white font-medium">{settings?.portfolio_title || 'Loading...'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Contact Email:</span>
                  <p className="text-white font-medium">{settings?.contact_email || 'Loading...'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-400">Phone Number:</span>
                  <p className="text-white font-medium">{settings?.phone || 'Loading...'}</p>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-700 rounded-lg">
              <h3 className="font-semibold text-white mb-2">Portfolio Impact</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• Title appears in the hero section and browser tab</p>
                <p>• Contact email is used in the contact form</p>
                <p>• Phone number is displayed in contact information</p>
                <p>• Changes take effect immediately on the frontend</p>
              </div>
            </div>

            <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
              <h3 className="font-semibold text-blue-300 mb-2">Tips</h3>
              <div className="space-y-1 text-sm text-blue-200">
                <p>• Use a professional email address</p>
                <p>• Keep the title concise and memorable</p>
                <p>• Include country code in phone number</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
