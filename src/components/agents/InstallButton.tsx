import { Download, Star } from 'lucide-react';
import { Button, Card, CardBody } from '@/components/common';
import { useAuth, useStarAgent } from '@/hooks';
import { agentsService } from '@/services';
import type { Agent } from '@/types';

interface InstallButtonProps {
  agent: Agent;
}

export function InstallButton({ agent }: InstallButtonProps) {
  const { isAuthenticated } = useAuth();
  const { isStarred, toggleStar, isLoading: starLoading } = useStarAgent(agent.slug);

  const handleDownload = () => {
    const url = agentsService.getDownloadUrl(agent.slug, agent.current_version);
    window.open(url, '_blank');
  };

  return (
    <Card>
      <CardBody>
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Install</h3>

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
