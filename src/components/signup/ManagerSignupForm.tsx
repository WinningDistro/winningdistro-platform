import type React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase, Construction } from 'lucide-react';

interface ManagerSignupFormProps {
  onBack: () => void;
}

const ManagerSignupForm: React.FC<ManagerSignupFormProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Card className="bg-zinc-900 border-green shadow-2xl max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-gold flex items-center justify-center">
            <Briefcase className="h-8 w-8 mr-3 text-orange-400" />
            Manager Signup
          </CardTitle>
          <CardDescription className="text-gray-300">Coming Soon</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <Construction className="h-16 w-16 text-orange-400 mx-auto" />
          <p className="text-white">Manager/Agent signup form with specialized fields for:</p>
          <ul className="text-gray-300 text-sm space-y-2">
            <li>• Management areas and client count</li>
            <li>• License numbers and certifications</li>
            <li>• Commission rates and territories</li>
            <li>• Network connections and experience</li>
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

export default ManagerSignupForm;
