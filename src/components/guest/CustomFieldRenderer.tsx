"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

export interface CustomField {
  id: string;
  label: string;
  fieldType: "RADIO" | "CHECKBOX" | "SELECT";
  options: string | string[]; // JSON string or parsed array
  isRequired: boolean;
  order: number;
}

interface CustomFieldRendererProps {
  fields: CustomField[];
  values: Record<string, any>;
  onChange: (fieldId: string, value: any) => void;
}

export function CustomFieldRenderer({ fields, values, onChange }: CustomFieldRendererProps) {
  if (!fields || fields.length === 0) return null;

  const parseOptions = (options: string | string[]): string[] => {
    if (Array.isArray(options)) return options;
    try {
      return JSON.parse(options);
    } catch {
      return [];
    }
  };

  return (
    <div className="space-y-5">
      {fields
        .sort((a, b) => a.order - b.order)
        .map((field) => {
          const options = parseOptions(field.options);

          return (
            <div key={field.id}>
              <Label className="text-sm font-semibold text-gray-900 block mb-3">
                {field.label}
                {field.isRequired && <span className="text-red-500 ml-1">*</span>}
              </Label>

              {field.fieldType === "RADIO" && (
                <RadioGroup
                  value={values[field.id] || ""}
                  onValueChange={(value) => onChange(field.id, value)}
                  className="space-y-2.5"
                >
                  {options.map((option) => (
                    <div key={option} className="flex items-center gap-2">
                      <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                      <Label
                        htmlFor={`${field.id}-${option}`}
                        className="text-sm font-normal text-gray-700 cursor-pointer leading-none"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {field.fieldType === "CHECKBOX" && (
                <div className="space-y-2.5">
                  {options.map((option) => {
                    const currentValues = values[field.id] || [];
                    const isChecked = currentValues.includes(option);

                    return (
                      <div key={option} className="flex items-center gap-2">
                        <Checkbox
                          id={`${field.id}-${option}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            const newValues = checked
                              ? [...currentValues, option]
                              : currentValues.filter((v: string) => v !== option);
                            onChange(field.id, newValues);
                          }}
                        />
                        <Label
                          htmlFor={`${field.id}-${option}`}
                          className="text-sm font-normal text-gray-700 cursor-pointer leading-none"
                        >
                          {option}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              )}

              {field.fieldType === "SELECT" && (
                <select
                  value={values[field.id] || ""}
                  onChange={(e) => onChange(field.id, e.target.value)}
                  className="flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  required={field.isRequired}
                >
                  <option value="" className="text-gray-500">Select an option...</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </div>
          );
        })}
    </div>
  );
}

