interface CalendarConfig {
  [key: string]: string;
  brightProdigy: string;
  crew1: string;
  pending: string;
}

export const config = {
  port: process.env.PORT || 8080,
  environment: process.env.NODE_ENV || 'development',
  calendar: {
    brightProdigy: '1sd0he5vr6t8p7ulncgfikc4ng@group.calendar.google.com',
    crew1: 'e3a19cf17894d270c54b5309d0ad2886c8c93e214e4f9828ac8beede5994d27b@group.calendar.google.com',
    pending: '21b795c08b44f1f27fe32c43ec0a37d3aa6a2a806a96018dfd16e940ca748901@group.calendar.google.com',
  } as CalendarConfig
};
