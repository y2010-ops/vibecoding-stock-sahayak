
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Key, Globe, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface APIStatus {
  currents: boolean;
  gnews: boolean;
  alphaVantage: boolean;
}

export const NewsAPISettings = () => {
  const [apiStatus, setApiStatus] = useState<APIStatus>({
    currents: false,
    gnews: false,
    alphaVantage: false
  });
  const { toast } = useToast();

  const apiSources = [
    {
      name: "Currents API",
      key: "currents",
      description: "600 requests/month • Primary news source",
      signupUrl: "https://currentsapi.services/en",
      docsUrl: "https://currentsapi.services/en/docs/",
      color: "bg-blue-500"
    },
    {
      name: "GNews API", 
      key: "gnews",
      description: "100 requests/day • Secondary backup source",
      signupUrl: "https://gnews.io/",
      docsUrl: "https://gnews.io/docs/v4",
      color: "bg-green-500"
    },
    {
      name: "Alpha Vantage News",
      key: "alphaVantage", 
      description: "5 requests/minute • Stock-specific news with sentiment",
      signupUrl: "https://www.alphavantage.co/support/#api-key",
      docsUrl: "https://www.alphavantage.co/documentation/#news-sentiment",
      color: "bg-purple-500"
    }
  ];

  const handleAPISetup = (apiName: string, signupUrl: string) => {
    window.open(signupUrl, '_blank');
    toast({
      title: `${apiName} Setup`,
      description: "Opening signup page. Add your API key in Supabase Edge Functions settings after signup.",
    });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Settings className="w-5 h-5" />
          Enhanced News API Configuration
        </CardTitle>
        <p className="text-slate-400 text-sm">
          Configure multiple free news APIs for comprehensive market coverage
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {apiSources.map((api) => (
          <div key={api.key} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <div className="flex items-center space-x-4">
              <div className={`w-3 h-3 rounded-full ${api.color}`} />
              <div>
                <h3 className="font-medium text-white">{api.name}</h3>
                <p className="text-sm text-slate-400">{api.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={apiStatus[api.key as keyof APIStatus] ? "default" : "secondary"}>
                {apiStatus[api.key as keyof APIStatus] ? (
                  <CheckCircle className="w-3 h-3 mr-1" />
                ) : (
                  <AlertCircle className="w-3 h-3 mr-1" />
                )}
                {apiStatus[api.key as keyof APIStatus] ? "Active" : "Setup Required"}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAPISetup(api.name, api.signupUrl)}
                className="text-xs"
              >
                <Key className="w-3 h-3 mr-1" />
                Setup
              </Button>
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-orange-900/20 border border-orange-700/50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Globe className="w-4 h-4 text-orange-400 mt-0.5" />
            <div className="text-sm">
              <p className="text-orange-200 font-medium">Multi-API Benefits:</p>
              <ul className="text-orange-300/80 mt-1 space-y-1 text-xs">
                <li>• Fallback system ensures news availability</li>
                <li>• Categorized news with sentiment analysis</li>
                <li>• Company-specific and general market news</li>
                <li>• Rate limiting across multiple sources</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
