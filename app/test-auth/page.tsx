'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react'

export default function TestAuthPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runTest = async () => {
    setIsLoading(true)
    setTestResult(null)
    
    try {
      const response = await fetch('/api/test-auth')
      const data = await response.json()
      setTestResult({ ...data, status: response.status })
    } catch (error: any) {
      setTestResult({
        success: false,
        error: error.message,
        status: 'Network Error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Google Sheets Authentication Test</h1>
          <p className="text-muted-foreground mt-2">
            Test your Vercel environment variables and Google Sheets connection
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Connection Test
            </CardTitle>
            <CardDescription>
              This will test if your GOOGLE_SHEET_ID and GSHEET_CREDENTIALS are properly configured
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={runTest} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing Connection...
                </>
              ) : (
                'Test Google Sheets Connection'
              )}
            </Button>
          </CardContent>
        </Card>

        {testResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {testResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                Test Results
                <Badge variant={testResult.success ? "default" : "destructive"}>
                  Status: {testResult.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testResult.success ? (
                  <div className="space-y-3">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-semibold text-green-800">✅ Connection Successful!</h3>
                      <p className="text-green-700">{testResult.message}</p>
                    </div>
                    
                    {testResult.spreadsheet && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                          <h4 className="font-medium text-blue-800">Spreadsheet Info</h4>
                          <p className="text-sm text-blue-700">Title: {testResult.spreadsheet.title}</p>
                          <p className="text-sm text-blue-700">Sheets: {testResult.spreadsheet.sheetCount}</p>
                          <p className="text-sm text-blue-700">ID: {testResult.spreadsheet.sheetId}</p>
                        </div>
                        
                        <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                          <h4 className="font-medium text-purple-800">Authentication</h4>
                          <p className="text-sm text-purple-700">Service Account: {testResult.authentication?.serviceAccount}</p>
                          <p className="text-sm text-purple-700">Private Key: {testResult.authentication?.hasPrivateKey ? '✅ Present' : '❌ Missing'}</p>
                        </div>
                      </div>
                    )}
                    
                    {testResult.spreadsheet?.sheetNames && (
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded">
                        <h4 className="font-medium text-gray-800">Available Sheets</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {testResult.spreadsheet.sheetNames.map((name: string, index: number) => (
                            <Badge key={index} variant="outline">{name}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h3 className="font-semibold text-red-800">❌ Connection Failed</h3>
                      <p className="text-red-700">{testResult.error}</p>
                    </div>
                    
                    {testResult.details && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <h4 className="font-medium text-yellow-800">Error Details</h4>
                        <p className="text-sm text-yellow-700">Type: {testResult.details.name}</p>
                        {testResult.details.code && (
                          <p className="text-sm text-yellow-700">Code: {testResult.details.code}</p>
                        )}
                      </div>
                    )}
                    
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <h4 className="font-medium text-blue-800">Troubleshooting Tips</h4>
                      <ul className="text-sm text-blue-700 mt-2 space-y-1">
                        <li>• Check that GOOGLE_SHEET_ID is set in Vercel environment variables</li>
                        <li>• Verify GSHEET_CREDENTIALS contains valid JSON service account credentials</li>
                        <li>• Ensure the service account has access to the Google Sheet</li>
                        <li>• Make sure the Google Sheets API is enabled in your Google Cloud project</li>
                      </ul>
                    </div>
                  </div>
                )}
                
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                    View Raw Response
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </details>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Environment Variables Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">GOOGLE_SHEET_ID</Badge>
                <span className="text-sm">Should be: 1JzYvOCgSfI5rBMD0ilDWhS0zzZv0cGxoV0rWa9WfVGo</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">GSHEET_CREDENTIALS</Badge>
                <span className="text-sm">Should be: Complete Google Service Account JSON</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}