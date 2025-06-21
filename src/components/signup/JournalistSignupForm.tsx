import type React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PenTool, Construction } from 'lucide-react';

interface JournalistSignupFormProps {
  onBack: () => void;
}

const JournalistSignupForm: React.FC<JournalistSignupFormProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Card className="bg-zinc-900 border-green shadow-2xl max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-gold flex items-center justify-center">
            <PenTool className="h-8 w-8 mr-3 text-rose-400" />
            Journalist Signup
          </CardTitle>
          <CardDescription className="text-gray-300">Coming Soon</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <Construction className="h-16 w-16 text-rose-400 mx-auto" />
          <p className="text-white">Music Journalist/Blogger signup form with fields for:</p>
          <ul className="text-gray-300 text-sm space-y-2">
            <li>• Publication affiliations and media type</li>
            <li>• Writing focus and genre specialties</li>
            <li>• Audience size and press credentials</li>
            <li>• Portfolio links and coverage interests</li>
          </ul>
          <Button onClick={onBack} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Selection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalistSignupForm;
