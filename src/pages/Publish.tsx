import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { PublishForm, ValidationStatus } from '@/components/publish';
import { Card, CardBody, CardHeader, ProgressBar } from '@/components/common';
import { usePublishAgent, useAuth } from '@/hooks';
import type { AgentCreateInput } from '@/utils/validation';

export default function Publish() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { mutate: publishAgent, isPending } = usePublishAgent();
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = (data: AgentCreateInput & { codeFile: File }) => {
    publishAgent(
      {
        data: {
          name: data.name,
          description: data.description,
          category: data.category,
          version: data.version,
          codeFile: data.codeFile,
        },
        onProgress: setUploadProgress,
      },
      {
        onSuccess: (result) => {
          navigate(`/agents/${result.slug}`);
        },
      }
    );
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="text-center py-16">Loading...</div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">
            Authentication Required
          </h1>
          <p className="text-neutral-600">
            Please log in to publish an agent.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">Publish Agent</h1>

        <div className="grid gap-8">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Agent Details</h2>
            </CardHeader>
            <CardBody>
              <PublishForm onSubmit={handleSubmit} isLoading={isPending} />

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-4">
                  <ProgressBar value={uploadProgress} showLabel />
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Publishing Guidelines</h2>
            </CardHeader>
            <CardBody>
              <ul className="space-y-2 text-neutral-600">
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">1.</span>
                  Provide a clear, descriptive name for your agent
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">2.</span>
                  Include comprehensive documentation in the description
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">3.</span>
                  Add test coverage to ensure quality
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">4.</span>
                  Follow pytest-agents conventions
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-600">5.</span>
                  Use semantic versioning (e.g., 1.0.0)
                </li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Validation Process</h2>
            </CardHeader>
            <CardBody>
              <p className="text-neutral-600 mb-4">
                After submission, your agent will go through our validation pipeline:
              </p>
              <ValidationStatus
                status="pending"
                checks={[
                  { name: 'security', status: 'pending', message: 'Security scan' },
                  { name: 'quality', status: 'pending', message: 'Code quality check' },
                  { name: 'tests', status: 'pending', message: 'Test execution' },
                ]}
              />
            </CardBody>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
