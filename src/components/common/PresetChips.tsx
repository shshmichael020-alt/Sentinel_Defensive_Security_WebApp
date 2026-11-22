import type { FC } from 'react';
import type { PresetItem } from '@/constants/presets';

export interface PresetChipsProps {
  readonly presets: readonly PresetItem[];
  readonly onSelect: (value: string) => void;
  readonly currentValue?: string | undefined;
  readonly label?: string | undefined;
}

const PresetChipButton: FC<{
  readonly preset: PresetItem;
  readonly isActive: boolean;
  readonly onSelect: (value: string) => void;
}> = ({ preset, isActive, onSelect }) => (
  <button
    type="button"
    onClick={() => { onSelect(preset.value); }}
    title={preset.description}
    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 ${
      isActive
        ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
        : 'border-slate-200 bg-white text-sentinel-secondary hover:border-slate-300 hover:text-sentinel-ink'
    }`}
  >
    {preset.label}
  </button>
);

export const PresetChips: FC<PresetChipsProps> = ({
  presets,
  onSelect,
  currentValue,
  label = 'Presets:',
}) => {
  return (
    <div className="flex items-center gap-1.5 flex-wrap text-xs">
      <span className="text-sentinel-secondary font-medium">{label}</span>
      <div className="flex items-center gap-1.5 flex-wrap">
        {presets.map((preset) => (
          <PresetChipButton
            key={preset.id}
            preset={preset}
            isActive={currentValue === preset.value}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};

