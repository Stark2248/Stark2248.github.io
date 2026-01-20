import React from 'react'

export const IconMail = ({size=20}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M3 6.75A2.75 2.75 0 015.75 4h12.5A2.75 2.75 0 0121 6.75v10.5A2.75 2.75 0 0118.25 20H5.75A2.75 2.75 0 013 17.25V6.75z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
    <path d="M21 6.75l-9 6-9-6" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"/>
  </svg>
)

export const IconPhone = ({size=20}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M3 5.5c.7 5 3.8 9.4 8 11.5l1.5-1.5c.3-.3.8-.4 1.2-.2l2 1c1.5.7 3.3.1 4.1-1.3.5-.8.5-1.7.1-2.6l-1-2c-.2-.5-.1-1 .2-1.3L18.5 8c2.1-4.2 5.5-7.3 10.5-8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export const IconLocation = ({size=18}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 21s7-4.5 7-10a7 7 0 10-14 0c0 5.5 7 10 7 10z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="1.25"/>
  </svg>
)

export const IconProject = ({size=18}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.25"/>
    <path d="M8 9h8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
  </svg>
)

export const IconSkills = ({size=18}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <path d="M12 2v6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
    <path d="M19 8l-7 5-7-5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 16l7 5 7-5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default {
  IconMail,
  IconPhone,
  IconLocation,
  IconProject,
  IconSkills,
}
