interface CustomFieldsDisplayProps {
  customFieldsData: any;
  customFields?: any[];
}

export function CustomFieldsDisplay({ customFieldsData, customFields }: CustomFieldsDisplayProps) {
  if (!customFieldsData || Object.keys(customFieldsData).length === 0) {
    return null;
  }

  // Create a map of field IDs to labels if customFields are provided
  const fieldLabels: Record<string, string> = {};
  if (customFields) {
    customFields.forEach(field => {
      fieldLabels[field.id] = field.label;
    });
  }

  return (
    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 className="font-semibold text-sm text-blue-900 mb-2">Customizations:</h4>
      <div className="space-y-1">
        {Object.entries(customFieldsData).map(([fieldId, value]) => {
          const label = fieldLabels[fieldId] || fieldId;
          const displayValue = Array.isArray(value) ? value.join(', ') : value;
          
          return (
            <div key={fieldId} className="text-sm">
              <span className="font-medium text-blue-800">{label}:</span>{' '}
              <span className="text-blue-700">{displayValue}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}



