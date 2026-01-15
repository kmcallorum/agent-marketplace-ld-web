import { useState } from 'react';
import { Layout } from '@/components/layout';
import { Card, CardBody, CardHeader, Button, Input, Textarea } from '@/components/common';
import { Send, ExternalLink, Bug, Lightbulb, HelpCircle } from 'lucide-react';
import { useAuth } from '@/hooks';

type IssueType = 'bug' | 'feature' | 'question';

interface IssueTypeOption {
  value: IssueType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const issueTypes: IssueTypeOption[] = [
  {
    value: 'bug',
    label: 'Bug Report',
    icon: <Bug className="w-5 h-5" />,
    description: 'Something is not working as expected',
  },
  {
    value: 'feature',
    label: 'Feature Request',
    icon: <Lightbulb className="w-5 h-5" />,
    description: 'Suggest a new feature or improvement',
  },
  {
    value: 'question',
    label: 'Question',
    icon: <HelpCircle className="w-5 h-5" />,
    description: 'Ask a question about the marketplace',
  },
];

// GitHub repo for issues - adjust as needed
const GITHUB_ISSUES_REPO = 'kevinmcallorum/agent-marketplace';

export default function Help() {
  const { user } = useAuth();
  const [issueType, setIssueType] = useState<IssueType>('bug');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      return;
    }

    // Build the issue body
    const labels = {
      bug: 'bug',
      feature: 'enhancement',
      question: 'question',
    };

    const typePrefix = {
      bug: '[Bug]',
      feature: '[Feature]',
      question: '[Question]',
    };

    const issueTitle = `${typePrefix[issueType]} ${title}`;
    const issueBody = `## Description
${description}

---
**Submitted by:** ${user?.username || 'Anonymous'}
**Issue Type:** ${issueTypes.find((t) => t.value === issueType)?.label}
**Submitted from:** Agent Marketplace Help Form`;

    // Encode for URL
    const params = new URLSearchParams({
      title: issueTitle,
      body: issueBody,
      labels: labels[issueType],
    });

    // Open GitHub issue creation page
    window.open(
      `https://github.com/${GITHUB_ISSUES_REPO}/issues/new?${params.toString()}`,
      '_blank'
    );
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">Help & Support</h1>
          <p className="text-neutral-600 mt-2">
            Found a bug? Have a feature request? We'd love to hear from you.
          </p>
        </div>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Submit Feedback</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Issue Type Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  What type of feedback is this?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {issueTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setIssueType(type.value)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                        issueType === type.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
                      }`}
                    >
                      {type.icon}
                      <span className="font-medium text-sm">{type.label}</span>
                    </button>
                  ))}
                </div>
                <p className="text-sm text-neutral-500 mt-2">
                  {issueTypes.find((t) => t.value === issueType)?.description}
                </p>
              </div>

              {/* Title */}
              <Input
                label="Title"
                placeholder={
                  issueType === 'bug'
                    ? 'Brief description of the issue'
                    : issueType === 'feature'
                    ? 'What feature would you like?'
                    : 'What is your question?'
                }
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              {/* Description */}
              <Textarea
                label="Description"
                placeholder={
                  issueType === 'bug'
                    ? 'Steps to reproduce the issue, expected vs actual behavior...'
                    : issueType === 'feature'
                    ? 'Describe the feature and how it would help...'
                    : 'Provide details about your question...'
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
              />

              {/* Submit */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-500">
                  This will open GitHub Issues in a new tab
                </p>
                <Button
                  type="submit"
                  disabled={!title.trim() || !description.trim()}
                  leftIcon={<Send className="w-4 h-4" />}
                  rightIcon={<ExternalLink className="w-3 h-3" />}
                >
                  Submit to GitHub
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Additional Help */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href={`https://github.com/${GITHUB_ISSUES_REPO}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-white border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <Bug className="w-5 h-5 text-neutral-600" />
            <div>
              <p className="font-medium text-neutral-900">View Open Issues</p>
              <p className="text-sm text-neutral-500">
                See existing bug reports and feature requests
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-neutral-400 ml-auto" />
          </a>
          <a
            href={`https://github.com/${GITHUB_ISSUES_REPO}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-white border border-neutral-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
          >
            <Lightbulb className="w-5 h-5 text-neutral-600" />
            <div>
              <p className="font-medium text-neutral-900">GitHub Repository</p>
              <p className="text-sm text-neutral-500">
                View the source code and contribute
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-neutral-400 ml-auto" />
          </a>
        </div>
      </div>
    </Layout>
  );
}
