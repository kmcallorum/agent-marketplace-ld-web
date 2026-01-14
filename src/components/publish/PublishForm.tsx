import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Textarea, Select } from '@/components/common';
import { FileUploader } from './FileUploader';
import { agentPublishSchema, AgentPublishInput } from '@/utils/validation';
import { useCategories } from '@/hooks';

interface PublishFormProps {
  onSubmit: (data: AgentPublishInput) => void;
  isLoading?: boolean;
}

export function PublishForm({ onSubmit, isLoading }: PublishFormProps) {
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AgentPublishInput>({
    resolver: zodResolver(agentPublishSchema),
    defaultValues: {
      version: '1.0.0',
    },
  });

  const codeFile = watch('codeFile');
  const categories = categoriesData?.categories || [];

  const categoryOptions = categories.map((c) => ({
    value: c.slug,
    label: c.name,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        label="Agent Name"
        placeholder="My Awesome Agent"
        error={errors.name?.message}
        {...register('name')}
      />

      <Textarea
        label="Description"
        placeholder="Describe what your agent does, its features, and how to use it..."
        error={errors.description?.message}
        rows={6}
        {...register('description')}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Category"
          options={categoryOptions}
          placeholder={categoriesLoading ? "Loading categories..." : "Select a category"}
          error={errors.category?.message}
          disabled={categoriesLoading}
          {...register('category')}
        />

        <Input
          label="Version"
          placeholder="1.0.0"
          error={errors.version?.message}
          {...register('version')}
        />
      </div>

      <FileUploader
        label="Agent Code"
        accept=".zip"
        helperText="Upload a ZIP file containing your agent code"
        onChange={(file) => setValue('codeFile', file)}
        value={codeFile}
      />

      <Button type="submit" variant="primary" isLoading={isLoading} className="w-full">
        Publish Agent
      </Button>
    </form>
  );
}
