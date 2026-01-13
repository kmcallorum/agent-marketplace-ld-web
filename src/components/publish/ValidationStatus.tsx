import { CheckCircle, XCircle, Clock, Shield, Code, TestTube } from 'lucide-react';
import clsx from 'clsx';

interface ValidationCheck {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  message?: string;
}

interface ValidationStatusProps {
  status: 'pending' | 'validating' | 'passed' | 'failed';
  checks?: ValidationCheck[];
}

export function ValidationStatus({ status, checks = [] }: ValidationStatusProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      label: 'Pending Validation',
    },
    validating: {
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      label: 'Validating...',
    },
    passed: {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      label: 'Validation Passed',
    },
    failed: {
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      label: 'Validation Failed',
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const checkIcons: Record<string, React.ElementType> = {
    security: Shield,
    quality: Code,
    tests: TestTube,
  };

  return (
    <div className={clsx('rounded-lg p-4', config.bg)}>
      <div className="flex items-center gap-2 mb-4">
        <StatusIcon className={clsx('w-5 h-5', config.color)} />
        <span className={clsx('font-medium', config.color)}>{config.label}</span>
      </div>

      {checks.length > 0 && (
        <div className="space-y-2">
          {checks.map((check) => {
            const CheckIcon = checkIcons[check.name] || Code;
            const checkStatus = {
              pending: { icon: Clock, color: 'text-neutral-400' },
              running: { icon: Clock, color: 'text-blue-500 animate-spin' },
              passed: { icon: CheckCircle, color: 'text-green-500' },
              failed: { icon: XCircle, color: 'text-red-500' },
            }[check.status];

            return (
              <div
                key={check.name}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-2">
                  <CheckIcon className="w-4 h-4 text-neutral-500" />
                  <span className="text-sm text-neutral-700 capitalize">
                    {check.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {check.message && (
                    <span className="text-xs text-neutral-500">{check.message}</span>
                  )}
                  <checkStatus.icon
                    className={clsx('w-4 h-4', checkStatus.color)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
