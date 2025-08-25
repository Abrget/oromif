export type LocaleKey = 'en' | 'am';

export type Messages = {
  home: {
    title: string;
    getStarted: string;
    haveAccount: string;
  };
  header: {
    siteLanguage: string;
    login: string;
    getStarted: string;
    signIn: string;
  };
  register: {
    title: string;
  };
  forgot: {
    title: string;
    instructions: string;
    emailPlaceholder: string;
    submit: string;
  };
  leaderboard: {
    unlockTitle: string;
    unlockDescription: (n: number) => string;
    startLesson: string;
    topAdvance: string;
  };
  learn: {
    loadingUnits: string;
    practiceExercise: string;
    jumpToTop: string;
    jumpHere: string;
    start: string;
    open: string;
    locked: string;
    practiceXP: string;
    startXP: string;
    unit: (n: number) => string;
    guidebook: string;
  };
  profile: {
    profile: string;
    settings: string;
    joined: (monthYear: string) => string;
    followingFollowers: (following: number, followers: number) => string;
    editProfile: string;
    statistics: string;
    dayStreak: string;
    balance: string;
    totalXp: string;
    currentLeague: string;
    top3Finishes: string;
    friends: string;
    following: string;
    followers: string;
    notFollowingYet: string;
    noFollowersYet: string;
  };
};

export const translations: Record<LocaleKey, Messages> = {
  en: {
    home: {
      title: 'The free, fun, and effective way to learn a language!',
      getStarted: 'Get started',
      haveAccount: 'I already have an account',
    },
    header: {
      siteLanguage: 'Site language',
      login: 'Login',
      getStarted: 'Get started',
      signIn: 'Sign in',
    },
    register: {
      title: 'I want to learn...'
    },
    forgot: {
      title: 'Forgot password',
      instructions: 'We will send you instructions on how to reset your password by email.',
      emailPlaceholder: 'Email',
      submit: 'Submit',
    },
    leaderboard: {
      unlockTitle: 'Unlock Leaderboards!',
      unlockDescription: (n: number) => `Complete ${n} more lesson${n === 1 ? '' : 's'} to start competing`,
      startLesson: 'Start a lesson',
      topAdvance: 'Top 20 advance to the next league',
    },
    learn: {
      loadingUnits: 'Loading units…',
      practiceExercise: 'Practice exercise',
      jumpToTop: 'Jump to top',
      jumpHere: 'Jump here?',
      start: 'Start',
      open: 'Open',
      locked: 'Locked',
      practiceXP: 'Practice +5 XP',
      startXP: 'Start +10 XP',
      unit: (n: number) => `Unit ${n}`,
      guidebook: 'Guidebook',
    },
    profile: {
      profile: 'Profile',
      settings: 'Settings',
      joined: (monthYear: string) => `Joined ${monthYear}`,
      followingFollowers: (following: number, followers: number) => `${following} Following / ${followers} Followers`,
      editProfile: 'Edit profile',
      statistics: 'Statistics',
      dayStreak: 'Day streak',
      balance: 'Balance',
      totalXp: 'Total XP',
      currentLeague: 'Current league',
      top3Finishes: 'Top 3 finishes',
      friends: 'Friends',
      following: 'Following',
      followers: 'Followers',
      notFollowingYet: 'Not following anyone yet',
      noFollowersYet: 'No followers yet',
    },
  },
  am: {
    home: {
      title: 'በነጻ፣ አስቂኝ እና ውጤታማ መንገድ ቋንቋ ይማሩ!',
      getStarted: 'ጀምር',
      haveAccount: 'አካውንት አለኝ',
    },
    header: {
      siteLanguage: 'የጣቢያ ቋንቋ',
      login: 'መግቢያ',
      getStarted: 'ጀምር',
      signIn: 'ግባ',
    },
    register: {
      title: 'ማማር የምፈልገው...'
    },
    forgot: {
      title: 'የይለፍ ቃል ረሱ',
      instructions: 'የይለፍ ቃልዎን እንዴት እንደሚቀይሩ መመሪያ በኢሜል እንልክልዎታለን።',
      emailPlaceholder: 'ኢሜል',
      submit: 'አስገባ',
    },
    leaderboard: {
      unlockTitle: 'የመመሪያ ሰሌዳዎችን ይክፈቱ!',
      unlockDescription: (n: number) => `ማወዳደር ለመጀመር ተጨማሪ ${n} ትምህርት ያጠናቅቱ`,
      startLesson: 'ትምህርት ጀምር',
      topAdvance: 'ከ20 ወደ ላይ ይደርሳሉ',
    },
    learn: {
      loadingUnits: 'ክፍሎችን በመጫን ላይ…',
      practiceExercise: 'ልምምድ እንቅስቃሴ',
      jumpToTop: 'ወደ ላይ ተመለስ',
      jumpHere: 'እዚህ ይዝለዉ?',
      start: 'ጀምር',
      open: 'ክፈት',
      locked: 'ተቆልፏል',
      practiceXP: 'ልምምድ +5 XP',
      startXP: 'ጀምር +10 XP',
      unit: (n: number) => `ክፍል ${n}`,
      guidebook: 'መመሪያ መፅሀፍ',
    },
    profile: {
      profile: 'መገለጫ',
      settings: 'ቅንብሮች',
      joined: (monthYear: string) => `${monthYear} ተቀላቀሉ`,
      followingFollowers: (following: number, followers: number) => `${following} ተከታዮች / ${followers} ከተከታዮች`,
      editProfile: 'መገለጫ አርትእ',
      statistics: 'ስታቲስቲክስ',
      dayStreak: 'የቀን ቅድሚያ',
      balance: 'ሂሳብ',
      totalXp: 'ጠቅላላ XP',
      currentLeague: 'የአሁኑ ሊግ',
      top3Finishes: 'ከ3 ላይ ጨርሰዋል',
      friends: 'ጓደኞች',
      following: 'ተከታይ',
      followers: 'ከተከታዮች',
      notFollowingYet: 'እስካሁን ማንንም አታከት',
      noFollowersYet: 'እስካሁን ከተከታዮች የሉም',
    },
  },
};

export const supportedLocales: LocaleKey[] = ['en', 'am'];

export function resolveLocale(code: string): LocaleKey {
  const lc = code.toLowerCase();
  if (lc.startsWith('am')) return 'am';
  // default fallback
  return 'en';
}
