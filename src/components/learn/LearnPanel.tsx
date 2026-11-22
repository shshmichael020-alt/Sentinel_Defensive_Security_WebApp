import type { FC } from 'react';
import { PLAYBOOKS } from '../../constants/playbooks';
import { PlaybookCard } from './PlaybookCard';
import { DrillCard } from './DrillCard';
import { EmergencyHelp } from './EmergencyHelp';

export const LearnPanel: FC = () => {
  return (
    <div
      role="tabpanel"
      id="panel-learn"
      aria-labelledby="tab-learn"
      className="flex flex-col gap-6"
    >
      <DrillCard />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-sentinel-ink">Social Engineering Playbooks</h3>
            <span className="text-xs text-sentinel-secondary">6 common attack vectors</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {PLAYBOOKS.map((playbook) => (
              <PlaybookCard key={playbook.id} playbook={playbook} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-4">
          <EmergencyHelp />
        </div>
      </div>
    </div>
  );
};
