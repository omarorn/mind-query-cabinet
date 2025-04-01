
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, AlertTriangle, Bug } from 'lucide-react';
import { testAIQuestionParsing, testAIQuestionGeneration, validateQuestion } from '@/utils/testUtils';
import { generateQuestionWithAI } from '@/utils/aiUtils';
import { useToast } from '@/components/ui/use-toast';

const TestPanel: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<Array<{
    name: string;
    success: boolean;
    message?: string;
  }>>([]);
  const { toast } = useToast();

  const runAllTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    const results = [];

    try {
      // Test AI parsing with various formats
      const testCases = [
        {
          name: "Standard format",
          text: `Titill: Test Title
          
          Spurning: This is the content of the question
          
          Heimild: example.com
          
          Mynd: https://example.com/image.jpg`
        },
        {
          name: "Mixed format",
          text: `Titill: Another Title
          Spurning: Content with no spaces between sections
          Heimild: source.org`
        },
        {
          name: "Missing sections",
          text: `Titill: Only Title
          This is just some text without proper sections`
        }
      ];

      for (const testCase of testCases) {
        const parseResult = testAIQuestionParsing(testCase.text);
        results.push({
          name: `AI Parsing: ${testCase.name}`,
          success: parseResult.success,
          message: parseResult.success 
            ? `Successfully parsed title: "${parseResult.title}" and content` 
            : `Failed to parse: ${parseResult.error || 'Unknown error'}`
        });
      }

      // Test actual AI generation
      const aiGenResult = await testAIQuestionGeneration();
      results.push({
        name: "Live AI Question Generation",
        success: aiGenResult,
        message: aiGenResult 
          ? "Successfully generated a question from AI" 
          : "Failed to generate a question from AI"
      });

      // Test category handling
      try {
        const question = await generateQuestionWithAI();
        if (question) {
          const withCategory = { 
            ...question, 
            id: 'test-id',
            authorId: 'test-author',
            authorName: 'Test User',
            createdAt: new Date().toISOString(),
            upvotes: 0,
            category: 'animals'
          };
          
          const validationResult = validateQuestion(withCategory);
          
          results.push({
            name: "Question Category Validation",
            success: validationResult.valid,
            message: validationResult.valid 
              ? "Question with category validated successfully" 
              : `Validation failed: ${validationResult.issues.join(', ')}`
          });
        }
      } catch (error) {
        results.push({
          name: "Question Category Test",
          success: false,
          message: `Error testing categories: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }

      setTestResults(results);
      
      // Show summary toast
      const successCount = results.filter(r => r.success).length;
      toast({
        title: `Test Results: ${successCount}/${results.length} passed`,
        description: successCount === results.length 
          ? "All tests passed successfully! 🎉" 
          : "Some tests failed. Check the results for details.",
        variant: successCount === results.length ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Test Error",
        description: `An error occurred while running tests: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" /> Test Panel
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Run tests to verify that everything is working correctly. This will test AI question generation,
            parsing logic, and other critical functionality.
          </p>
          
          <Alert>
            <AlertTitle>Testing Mode</AlertTitle>
            <AlertDescription>
              This panel is only visible in development mode and won't appear in production.
            </AlertDescription>
          </Alert>

          {testResults.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Test Results:</h3>
              <div className="space-y-2">
                {testResults.map((result, index) => (
                  <div 
                    key={index}
                    className={`p-2 rounded-md ${result.success ? 'bg-green-50' : 'bg-red-50'}`}
                  >
                    <div className="flex items-start gap-2">
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <div>
                        <p className={`font-medium ${result.success ? 'text-green-700' : 'text-red-700'}`}>
                          {result.name}
                        </p>
                        {result.message && (
                          <p className="text-xs mt-1 text-gray-600">{result.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={runAllTests} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Running Tests...' : 'Run All Tests'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TestPanel;
