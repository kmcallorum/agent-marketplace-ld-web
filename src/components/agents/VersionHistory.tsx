import { CheckCircle, Shield, Clock } from 'lucide-react';
import { Badge } from '@/components/common';
import { formatDate, formatBytes } from '@/utils/format';
import type { AgentVersion } from '@/types';

interface VersionHistoryProps {
  versions: AgentVersion[];
  currentVersion: string;
}

export function VersionHistory({ versions, currentVersion }: VersionHistoryProps) {
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-neutral-900 mb-4">Version History</h3>

      <div className="space-y-4">
        {versions.map((version) => (
          <div
            key={version.id}
            className="border border-neutral-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-900">
                  v{version.version}
                </span>
                {version.version === currentVersion && (
                  <Badge color="green" size="sm">
                    Latest
                  </Badge>
                )}
              </div>
              <span className="text-sm text-neutral-500">
                <Clock className="w-4 h-4 inline mr-1" />
                {formatDate(version.published_at)}
              </span>
            </div>

            {version.changelog && (
              <p className="text-neutral-600 mb-3">{version.changelog}</p>
            )}

            <div className="flex gap-4 text-sm">
              {version.tested && (
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  Tests Passed
                </span>
              )}
              {version.security_scan_passed && (
                <span className="flex items-center gap-1 text-green-600">
                  <Shield className="w-4 h-4" />
                  Security Verified
                </span>
              )}
              {version.size_bytes && (
                <span className="text-neutral-500">
                  Size: {formatBytes(version.size_bytes)}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
