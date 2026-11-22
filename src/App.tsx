import type { FC } from 'react';
import type { UseLinkCheckResult } from './hooks/useLinkCheck';
import type { UseMessageCheckResult } from './hooks/useMessageCheck';
import type { UsePasswordCheckResult } from './hooks/usePasswordCheck';
import { useLinkCheck } from './hooks/useLinkCheck';
import { useMessageCheck } from './hooks/useMessageCheck';
import { usePasswordCheck } from './hooks/usePasswordCheck';
import { useRovingTabs } from './hooks/useRovingTabs';
import { computeSessionPosture } from './engine/postureSummary';
import { PASSWORD_STRENGTH_THEME } from './constants/theme';
import { DEFAULT_PASSWORD_LEVEL, TOTAL_APP_CHECKS } from './constants/limits';
import { SkipLink } from './components/layout/SkipLink';
import { Header } from './components/layout/Header';
import { PrivacyNote } from './components/layout/PrivacyNote';
import { KpiStrip } from './components/layout/KpiStrip';
import { TabBar } from './components/layout/TabBar';
import { LinkPanel } from './components/link/LinkPanel';
import { MessagePanel } from './components/message/MessagePanel';
import { PasswordPanel } from './components/password/PasswordPanel';
import { LearnPanel } from './components/learn/LearnPanel';
import { Footer } from './components/layout/Footer';

function getLinkState(c: UseLinkCheckResult) {
  return c.result.status === 'ok'
    ? { score: c.result.score, verdict: c.result.verdict }
    : { score: 0, verdict: 'Low risk' as const };
}

function getMessageState(c: UseMessageCheckResult) {
  return c.result.status === 'ok'
    ? { score: c.result.score, verdict: c.result.verdict }
    : { score: 0, verdict: 'Low risk' as const };
}

function getPasswordState(c: UsePasswordCheckResult) {
  if (c.result.status !== 'ok') {
    return { label: 'Strong' as const, level: DEFAULT_PASSWORD_LEVEL, verdict: 'Low risk' as const };
  }
  const theme = PASSWORD_STRENGTH_THEME[c.result.label];
  const verdict = theme.label === 'Strong' ? ('Low risk' as const) : ('Dangerous' as const);
  return { label: c.result.label, level: c.result.level, verdict };
}

export const App: FC = () => {
  const linkCheck = useLinkCheck();
  const messageCheck = useMessageCheck();
  const passwordCheck = usePasswordCheck();
  const { activeTab, setActiveTab, handleKeyDown } = useRovingTabs('link');

  const link = getLinkState(linkCheck);
  const msg = getMessageState(messageCheck);
  const pwd = getPasswordState(passwordCheck);
  const posture = computeSessionPosture(link.verdict, msg.verdict, pwd.level, TOTAL_APP_CHECKS);

  return (
    <div className="min-h-screen bg-sentinel-bg flex flex-col font-sans">
      <SkipLink />
      <Header />
      <PrivacyNote />
      <main id="main-content" className="flex-1 max-w-app w-full mx-auto px-4 sm:px-6">
        <KpiStrip
          linkScore={link.score}
          linkVerdict={link.verdict}
          messageScore={msg.score}
          messageVerdict={msg.verdict}
          passwordLabel={pwd.label}
          passwordVerdict={pwd.verdict}
          sessionPostureVerdict={posture.worstVerdict}
          sessionChecksCount={posture.checksRunCount}
        />
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} onKeyDown={handleKeyDown} />
        {activeTab === 'link' && <LinkPanel check={linkCheck} />}
        {activeTab === 'message' && <MessagePanel check={messageCheck} />}
        {activeTab === 'password' && <PasswordPanel check={passwordCheck} />}
        {activeTab === 'learn' && <LearnPanel />}
      </main>
      <Footer />
    </div>
  );
};

export default App;
