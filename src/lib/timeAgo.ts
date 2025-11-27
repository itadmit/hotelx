export function formatTimeAgo(date: Date, language: string = "en"): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  const translations: Record<string, Record<string, string>> = {
    en: {
      just_now: "Just now",
      m_ago: "{m}m ago",
      h_ago: "{h}h ago",
      d_ago: "{d}d ago",
      long_time_ago: "Long time ago"
    },
    bg: {
      just_now: "Току-що",
      m_ago: "преди {m} мин",
      h_ago: "преди {h} ч",
      d_ago: "преди {d} дни",
      long_time_ago: "Отдавна"
    },
    de: {
      just_now: "Gerade eben",
      m_ago: "vor {m} Min",
      h_ago: "vor {h} Std",
      d_ago: "vor {d} T",
      long_time_ago: "Vor langer Zeit"
    },
    fr: {
      just_now: "À l'instant",
      m_ago: "il y a {m} min",
      h_ago: "il y a {h} h",
      d_ago: "il y a {d} j",
      long_time_ago: "Il y a longtemps"
    },
    it: {
      just_now: "Proprio ora",
      m_ago: "{m} min fa",
      h_ago: "{h} h fa",
      d_ago: "{d} g fa",
      long_time_ago: "Molto tempo fa"
    },
    he: {
      just_now: "הרגע",
      m_ago: "לפני {m} דק׳",
      h_ago: "לפני {h} שעות",
      d_ago: "לפני {d} ימים",
      long_time_ago: "מזמן"
    }
  };

  const t = translations[language] || translations.en;

  if (diffMins < 1) return t.just_now;
  if (diffMins < 60) return t.m_ago.replace("{m}", diffMins.toString());
  if (diffHours < 24) return t.h_ago.replace("{h}", diffHours.toString());
  if (diffDays < 7) return t.d_ago.replace("{d}", diffDays.toString());
  return t.long_time_ago;
}

