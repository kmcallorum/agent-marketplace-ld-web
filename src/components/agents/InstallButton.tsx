import { useState } from 'react';
import { Download, Copy, Check, Star } from 'lucide-react';
import { Button, Card, CardBody } from '@/components/common';
import { useAuth, useStarAgent } from '@/hooks';
import { agentsService } from '@/services';
import toast from 'react-hot-toast';
import type { Agent } from '@/types';

interface InstallButtonProps {
  agent: Agent;
}

function getInstallCommand(agent: Agent): { command: string; label: string } {
  const category = agent.category?.toLowerCase() || '';

  if (category.includes('mcp')) {
    return {
      command: `claude mcp add ${agent.slug}`,
      label: 'Add to Claude',
    };
  }
  if (category.includes('skill')) {
    return {
      command: `claude skill install ${agent.slug}`,
      label: 'Install Skill',
    };
  }
  // Default for agents/tools
  return {
    command: `claude agent add ${agent.slug}`,
    label: 'Install',
  };
}

export function InstallButton({ agent }: InstallButtonProps) {
  const { isAuthenticated } = useAuth();
  const { isStarred, toggleStar, isLoading: starLoading } = useStarAgent(agent.slug);
  const [copied, setCopied] = useState(false);

  const { command: installCommand, label: installLabel } = getInstallCommand(agent);

  const handleCopy = async () => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(installCommand);
      } else {
        // Fallback for HTTP sites
        const textArea = document.createElement('textarea');
        textArea.value = installCommand;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleDownload = () => {
    const url = agentsService.getDownloadUrl(agent.slug, agent.current_version);
    window.open(url, '_blank');
  };

  return (
    <Card>
      <CardBody>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">{installLabel}</h3>

        <div className="mb-4">
          <div className="flex items-center gap-2 bg-neutral-100 rounded-lg p-3">
            <code className="flex-1 text-sm text-neutral-800 font-mono truncate">
              {installCommand}
            </code>
            <button
              onClick={handleCopy}
              className="p-1.5 hover:bg-neutral-200 rounded transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-neutral-500" />
              )}
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="primary"
            className="flex-1"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleDownload}
          >
            Download
          </Button>

          {isAuthenticated && (
            <Button
              variant={isStarred ? 'secondary' : 'outline'}
              leftIcon={<Star className={`w-4 h-4 ${isStarred ? 'fill-current' : ''}`} />}
              onClick={toggleStar}
              isLoading={starLoading}
            >
              {isStarred ? 'Starred' : 'Star'}
            </Button>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Version</span>
            <span className="font-medium text-neutral-900">
              {agent.current_version}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-neutral-500">License</span>
            <span className="font-medium text-neutral-900">MIT</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
