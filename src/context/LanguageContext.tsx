"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "bn" | "en";

export const translations = {
  // Navigation / Header
  header_find_parts: {
    bn: "কম্প্যাটিবল পার্টস খুঁজুন",
    en: "Find Compatible Parts"
  },
  header_login: {
    bn: "লগইন",
    en: "Login"
  },
  header_post_ad: {
    bn: "+ বিজ্ঞাপন দিন",
    en: "+ Post Ad"
  },
  header_search_placeholder: {
    bn: "পার্টস, ব্র্যান্ড, মডেল খুঁজুন...",
    en: "Search parts, brands, models…"
  },
  header_search_btn: {
    bn: "খুঁজুন",
    en: "Search"
  },
  header_menu: {
    bn: "মেনু",
    en: "Menu"
  },

  // Sky Blue Top Search Banner
  banner_title: {
    bn: "আপনি কি খুঁজছেন?",
    en: "What are you looking for?"
  },
  banner_location_all: {
    bn: "সমগ্র বাংলাদেশ",
    en: "All Bangladesh"
  },
  banner_search_placeholder: {
    bn: "ডিভাইস, স্পেয়ার পার্টস বা মডেল খুঁজুন...",
    en: "I am looking for devices, spare parts, models..."
  },
  banner_popular: {
    bn: "জনপ্রিয়:",
    en: "Popular:"
  },

  // Quick Action Pills
  pill_matchmaker: {
    bn: "ডিভাইস ম্যাচমেকার",
    en: "Device Matchmaker"
  },
  pill_matchmaker_sub: {
    bn: "ভাঙা স্ক্রিন ↔ নষ্ট ব্যাটারি",
    en: "Broken screen ↔ Dead battery"
  },
  pill_post_ad: {
    bn: "ফ্রি বিজ্ঞাপন দিন",
    en: "Post Free Ad"
  },
  pill_post_ad_sub: {
    bn: "নষ্ট ডিভাইস বা পার্টস বিক্রি করুন",
    en: "Sell donor devices or parts"
  },
  pill_technician: {
    bn: "টেকনিশিয়ান ডিরেক্টরি",
    en: "Technician Directory"
  },
  pill_technician_sub: {
    bn: "হার্ডওয়্যার মেরামত ও পার্টস ফিটিং",
    en: "Hardware repair & fitting"
  },

  // Trending Ads Feed
  feed_trending_title: {
    bn: "চলতি বিজ্ঞাপনসমূহ",
    en: "Trending Ads"
  },
  feed_trending_sub: {
    bn: "সদ্য যুক্ত হওয়া ডোনার ডিভাইস ও স্পেয়ার পার্টস",
    en: "Freshly posted donor devices and salvage parts"
  },
  feed_no_ads_title: {
    bn: "এখনো কোনো বিজ্ঞাপন নেই",
    en: "No ads found yet"
  },
  feed_no_ads_sub: {
    bn: "প্রথম বিজ্ঞাপনটি আপনিই পোস্ট করুন।",
    en: "Be the first to list a device or spare part."
  },
  feed_view_all: {
    bn: "সব বিজ্ঞাপন অনুসন্ধান করুন",
    en: "Search all hardware ads"
  },

  // Listing Types & Badges
  type_sell: {
    bn: "বিক্রয়",
    en: "For Sale"
  },
  type_buy: {
    bn: "ক্রয় করতে ইচ্ছুক",
    en: "Looking to Buy"
  },
  type_repair_offer: {
    bn: "মেরামত সেবা",
    en: "Repair Offer"
  },
  type_repair_request: {
    bn: "মেরামত প্রয়োজন",
    en: "Needs Repair"
  },

  // Conditions
  cond_new: {
    bn: "নতুন",
    en: "Brand New"
  },
  cond_used: {
    bn: "ব্যবহৃত",
    en: "Used"
  },
  cond_fair: {
    bn: "ব্যবহৃত (চলনসই)",
    en: "Used - Fair"
  },
  cond_parts: {
    bn: "পার্টসের জন্য",
    en: "For Parts Only"
  },
  swap_inquire: {
    bn: "বিনিময় / আলোচনা",
    en: "Swap / Inquire"
  },

  // Listings Page
  listings_page_title: {
    bn: "কম্প্যাটিবল পার্টস ও ডিভাইস খুঁজুন",
    en: "Find Compatible Hardware & Parts"
  },
  listings_page_subtitle: {
    bn: "আপনার ডিভাইসের সঠিক মডেল বা প্রয়োজনীয় পার্টসের নাম লিখে সার্চ করুন।",
    en: "Search for your exact device model or component to find matching donor hardware."
  },
  listings_initial_title: {
    bn: "আপনার প্রয়োজনীয় ডিভাইস বা পার্টস খুঁজুন",
    en: "Search for your device or component"
  },
  listings_initial_subtitle: {
    bn: "উপরে আপনার ডিভাইসের মডেল বা পার্টসের নাম লিখে সার্চ করুন অথবা নিচের ক্যাটাগরি বেছে নিন।",
    en: "Enter your model or part above to discover compatible hardware. Connect with owners who have the exact working part you need."
  },
  listings_popular_searches: {
    bn: "জনপ্রিয় দ্রুত সার্চসমূহ:",
    en: "Popular Quick Searches"
  },
  listings_results_for: {
    bn: "ফলাফল:",
    en: "Results for"
  },
  listings_matched_title: {
    bn: "ম্যাচিং হার্ডওয়্যার বিজ্ঞাপনসমূহ",
    en: "Matched Hardware Listings"
  },
  listings_found_count: {
    bn: "টি উপযোগী বিজ্ঞাপন পাওয়া গেছে",
    en: "compatible ads found"
  },
  listings_no_results_title: {
    bn: "কোনো বিজ্ঞাপন পাওয়া যায়নি",
    en: "No compatible listings found"
  },
  listings_no_results_sub: {
    bn: "এই পার্টসের কোনো বিজ্ঞাপন এখনো নেই। আপনি একটি রিকোয়েস্ট বিজ্ঞাপন পোস্ট করতে পারেন!",
    en: "Nobody has listed this specific hardware yet. Post an ad so users with donor phones can contact you directly!"
  },
  listings_post_request_btn: {
    bn: "+ চাহিদার বিজ্ঞাপন দিন",
    en: "Post a Request Ad"
  },
  listings_clear_filters_btn: {
    bn: "ফিল্টার মুছুন",
    en: "Clear Filters"
  },

  // Filter Form Controls
  filter_input_placeholder: {
    bn: "আপনার কি ডিভাইস বা পার্টস প্রয়োজন? (যেমন: iPhone 13, A52 Display)...",
    en: "What device or part do you need? (e.g. iPhone 13, A52 Display)..."
  },
  filter_brand: {
    bn: "ডিভাইস ব্র্যান্ড",
    en: "Device Brand"
  },
  filter_any_brand: {
    bn: "যেকোনো ব্র্যান্ড",
    en: "Any Brand"
  },
  filter_part: {
    bn: "পার্ট / কম্পোনেন্ট",
    en: "Part / Component"
  },
  filter_any_part: {
    bn: "যেকোনো পার্টস",
    en: "Any Component"
  },
  filter_intent: {
    bn: "বিজ্ঞাপনের ধরন",
    en: "Listing Intent"
  },
  filter_sort: {
    bn: "সর্ট করুন",
    en: "Sort By"
  },
  filter_sort_latest: {
    bn: "নতুন বিজ্ঞাপন আগে",
    en: "Latest First"
  },
  filter_sort_price_asc: {
    bn: "কম মূল্য আগে",
    en: "Lowest Price"
  },
  filter_sort_price_desc: {
    bn: "বেশি মূল্য আগে",
    en: "Highest Price"
  },
  filter_sort_oldest: {
    bn: "পুরাতন বিজ্ঞাপন আগে",
    en: "Oldest First"
  },
  filter_more: {
    bn: "আরো ফিল্টার (কন্ডিশন, মূল্য সীমা)",
    en: "More Filters (Condition, Price Range)"
  },
  filter_hide: {
    bn: "অতিরিক্ত ফিল্টার লুকান",
    en: "Hide Extra Filters"
  },
  filter_reset: {
    bn: "রিসেট করুন",
    en: "Reset Search"
  },
  filter_condition: {
    bn: "হার্ডওয়্যার কন্ডিশন",
    en: "Hardware Condition"
  },
  filter_any_condition: {
    bn: "যেকোনো কন্ডিশন",
    en: "Any Condition"
  },
  filter_min_price: {
    bn: "সর্বনিম্ন মূল্য (৳)",
    en: "Min Price (৳ BDT)"
  },
  filter_max_price: {
    bn: "সর্বোচ্চ মূল্য (৳)",
    en: "Max Price (৳ BDT)"
  },

  // Matchmaker Story Section
  matchmaker_badge: {
    bn: "ভাঙারি এক্সচেঞ্জ ফিলোসফি",
    en: "The Vangare Exchange Philosophy"
  },
  matchmaker_title_1: {
    bn: "দুটি নষ্ট ফোন।",
    en: "Two Broken Phones."
  },
  matchmaker_title_2: {
    bn: "একটি সম্পূর্ণ সচল ডিভাইস।",
    en: "One Fully Revived Device."
  },
  matchmaker_desc: {
    bn: "অধিকাংশ 'নষ্ট' স্মার্টফোনের ভেতরে ৮০% পার্টসই আসল ও ভালো থাকে। ফেলে না দিয়ে বা নিম্নমানের ডুপ্লিকেট পার্টস না কিনে, অন্য কারো থেকে সরাসরি অরিজিনাল ফ্যাক্টরি পার্টস সংগ্রহ করুন।",
    en: "Most 'broken' smartphones still have 80% of their components in pristine factory condition. Instead of throwing them away or paying exorbitant fees for copy parts, trade or harvest OEM components directly from another owner."
  },
  scenario_a_title: {
    bn: "ভাঙা এমোলেড ডিসপ্লে",
    en: "Cracked AMOLED Display"
  },
  scenario_a_desc: {
    bn: "ডিসপ্লে নষ্ট, কিন্তু মাদারবোর্ড, ক্যামেরা ও ব্যাটারি শতভাগ ভালো।",
    en: "Screen is broken, but the motherboard, cameras, and battery are 100% fine."
  },
  scenario_b_title: {
    bn: "মাদারবোর্ড নষ্ট বা ডেড ফোন",
    en: "Water-Damaged Board"
  },
  scenario_b_desc: {
    bn: "পানিতে পড়ে বোর্ড নষ্ট, কিন্তু ডিসপ্লে এবং বডি একেবারে চকচকে নতুনের মতো।",
    en: "Phone won't boot, but the Super AMOLED screen, body, and cameras are pristine."
  },

  // How it works
  how_it_works_badge: {
    bn: "সহজ ৪টি ধাপ",
    en: "Simple 4-Step Process"
  },
  how_it_works_title: {
    bn: "কীভাবে পার্টস এক্সচেঞ্জ কাজ করে",
    en: "How The Parts Exchange Works"
  },
  step_1_title: {
    bn: "১. পোস্ট করুন",
    en: "1. Diagnose & Post"
  },
  step_1_desc: {
    bn: "আপনার ডিভাইসের কি নষ্ট আর কি ভালো আছে তা লিখে বিজ্ঞাপন দিন।",
    en: "Tell us what's working and what's damaged on your device."
  },
  step_2_title: {
    bn: "২. ম্যাচিং খুঁজুন",
    en: "2. Discover Matches"
  },
  step_2_desc: {
    bn: "একই মডেলের বিপরীত সমস্যা থাকা ডোনার ফোনের সাথে ম্যাচ খুঁজুন।",
    en: "Find someone who has the exact opposite working part for your model."
  },
  step_3_title: {
    bn: "৩. যোগাযোগ করুন",
    en: "3. Connect & Negotiate"
  },
  step_3_desc: {
    bn: "সরাসরি ফোন বা মেসেজে কথা বলে পার্টস বিনিময় বা বিক্রয়ের চুক্তি করুন।",
    en: "Message your match to agree on an exchange, sale, or repair."
  },
  step_4_title: {
    bn: "৪. ডিভাইস সচল করুন",
    en: "4. Swap & Revive"
  },
  step_4_desc: {
    bn: "নিরাপদে দেখা করে পার্টস নিন এবং নিজের ফোন পুনরায় চালু করুন।",
    en: "Meet up or ship, install the OEM part, and give your phone new life."
  },

  // Trust & Safety
  trust_badge: {
    bn: "নিরাপত্তা অগ্রাধিকার",
    en: "Safety First"
  },
  trust_title: {
    bn: "বিশ্বাস ও হার্ডওয়্যার সুরক্ষা",
    en: "Trust & Hardware Verification"
  },
  trust_1_title: {
    bn: "ভেরিফাইড ইউজার",
    en: "Verified Community"
  },
  trust_1_desc: {
    bn: "প্রতিটি ব্যবহারকারী আসল মোবাইল নম্বর দিয়ে অ্যাকাউন্ট তৈরি করেন।",
    en: "Every user registers with a verified phone number."
  },
  trust_2_title: {
    bn: "গোপনীয়তা রক্ষা",
    en: "Privacy Protected"
  },
  trust_2_desc: {
    bn: "আপনার অনুমতি ছাড়া ফোন নম্বর অন্য কাউকে দেখানো হয় না।",
    en: "Your phone number stays hidden until you choose to reveal it."
  },
  trust_3_title: {
    bn: "নিরাপদ স্থানে লেনদেন",
    en: "Safe Local Meetups"
  },
  trust_3_desc: {
    bn: "জনাকীর্ণ শপিং মল বা টেকনিশিয়ান দোকানে দিনে বেলা দেখা করার পরামর্শ দিই।",
    en: "We recommend daylight exchanges in populated public areas."
  },
  trust_4_title: {
    bn: "দ্রুত অভিযোগ ব্যবস্থা",
    en: "Rapid Moderation"
  },
  trust_4_desc: {
    bn: "যেকোনো বিভ্রান্তিকর বা সন্দেহজনক বিজ্ঞাপন এক ক্লিকে রিপোর্ট করুন।",
    en: "One-click reporting flags inappropriate posts or locked stolen devices."
  },

  // Post Ad Page
  post_ad_title: {
    bn: "নতুন বিজ্ঞাপন পোস্ট করুন",
    en: "Post a New Ad"
  },
  post_ad_subtitle: {
    bn: "আপনার ডিভাইসের সঠিক তথ্য দিয়ে সহজেই বিজ্ঞাপন প্রকাশ করুন (মাত্র ২ মিনিট)",
    en: "Fill in the details to list your device, parts, or repair request (~2 mins)"
  },
  post_ad_intent_label: {
    bn: "আপনি কি করতে চান? (বিজ্ঞাপনের উদ্দেশ্য)",
    en: "What would you like to do? (Listing Intent)"
  },
  post_ad_sell_title: {
    bn: "পার্টস বিক্রি",
    en: "Sell a Part"
  },
  post_ad_sell_sub: {
    bn: "ডোনার ডিভাইস বা ভালো পার্টস",
    en: "Donor device or good parts"
  },
  post_ad_buy_title: {
    bn: "পার্টস প্রয়োজন",
    en: "Need a Part"
  },
  post_ad_buy_sub: {
    bn: "ডিভাইস সচল করতে পার্টস খুঁজছেন",
    en: "Looking for replacement part"
  },
  post_ad_repair_offer_title: {
    bn: "মেরামত সেবা",
    en: "Offer Repair"
  },
  post_ad_repair_offer_sub: {
    bn: "দক্ষ টেকনিশিয়ান সার্ভিস",
    en: "Professional hardware repair"
  },
  post_ad_repair_req_title: {
    bn: "মেরামত সাহায্য",
    en: "Need Repair"
  },
  post_ad_repair_req_sub: {
    bn: "ফোন ঠিক করাতে টেকনিশিয়ান চান",
    en: "Looking for expert help"
  },
  post_ad_sec_device: {
    bn: "১. ডিভাইস ও যন্ত্রাংশের বিবরণ",
    en: "1. Device & Hardware Details"
  },
  post_ad_brand_label: {
    bn: "ডিভাইস ব্র্যান্ড",
    en: "Device Brand"
  },
  post_ad_model_label: {
    bn: "ডিভাইসের মডেল",
    en: "Device Model"
  },
  post_ad_part_label: {
    bn: "যন্ত্রাংশের ধরন (Component)",
    en: "Component / Part Type"
  },
  post_ad_condition_label: {
    bn: "বর্তমান কন্ডিশন",
    en: "Hardware Condition"
  },
  post_ad_sec_pricing: {
    bn: "২. মূল্য ও লোকেশন",
    en: "2. Pricing & Location"
  },
  post_ad_price_label: {
    bn: "প্রত্যাশিত মূল্য (৳ BDT)",
    en: "Expected Price (৳ BDT)"
  },
  post_ad_price_hint: {
    bn: "খালি রাখলে 'বিনিময় / আলোচনা সাপেক্ষে' দেখানো হবে",
    en: "Leave blank or 0 for 'Negotiable / Swap'"
  },
  post_ad_location_label: {
    bn: "লোকেশন (শহর বা এলাকা)",
    en: "Location (City or Area)"
  },
  post_ad_sec_desc: {
    bn: "৩. বিস্তারিত বিবরণ ও ত্রুটির অবস্থা",
    en: "3. Detailed Description & Fault Status"
  },
  post_ad_desc_placeholder: {
    bn: "ডিভাইসের কি কি পার্টস ভালো আছে আর কি কি নষ্ট তা বিস্তারিত লিখুন যাতে ক্রেতা বা এক্সচেঞ্জ পার্টনার সহজেই বুঝতে পারেন...",
    en: "Describe what components are working (e.g. good battery) and what is damaged (e.g. broken screen) so buyers can understand..."
  },
  post_ad_sec_tags: {
    bn: "৪. সার্চ ট্যাগসমূহ (দ্রুত খোঁজার জন্য)",
    en: "4. Search Tags (Boost Discoverability)"
  },
  post_ad_tags_subtitle: {
    bn: "বিজ্ঞাপনের প্রাসঙ্গিক ট্যাগ যোগ করুন যাতে যে কেউ সার্চ করলেই আপনার পোস্ট দ্রুত পায়",
    en: "Add relevant keywords so buyers and swappers can find your ad immediately"
  },
  post_ad_tag_placeholder: {
    bn: "ট্যাগ লিখুন (যেমন: OriginalDisplay, CrackedGlass) এবং Enter চাপুন",
    en: "Type a tag (e.g. OriginalDisplay, CrackedGlass) and press Enter"
  },
  post_ad_add_tag_btn: {
    bn: "যোগ করুন",
    en: "Add Tag"
  },
  post_ad_popular_tags_label: {
    bn: "জনপ্রিয় ট্যাগসমূহ (ক্লিক করে যুক্ত করুন):",
    en: "Popular Suggested Tags (Click to add):"
  },
  post_ad_sec_photos: {
    bn: "৫. যন্ত্রাংশের ছবি (সর্বোচ্চ ৫টি)",
    en: "5. Hardware Photos (Up to 5 images)"
  },
  post_ad_photos_prompt: {
    bn: "ছবি সিলেক্ট করতে ক্লিক করুন অথবা ফাইল ব্রাউজ করুন",
    en: "Click to select or upload device photos"
  },
  post_ad_photos_uploading: {
    bn: "ছবি আপলোড হচ্ছে...",
    en: "Uploading photos..."
  },
  post_ad_submit_btn: {
    bn: "বিজ্ঞাপনটি প্রকাশ করুন",
    en: "Publish Listing Now"
  },
  post_ad_submitting_btn: {
    bn: "বিজ্ঞাপন প্রকাশ করা হচ্ছে...",
    en: "Publishing Listing..."
  },

  // Login & Auth
  login_welcome: {
    bn: "স্বাগতম!",
    en: "Welcome Back!"
  },
  login_page_title: {
    bn: "লগইন করুন",
    en: "Log In"
  },
  login_page_subtitle: {
    bn: "আপনার অ্যাকাউন্টে প্রবেশ করে পার্টস খুঁজুন বা বিজ্ঞাপন দিন",
    en: "Sign in to manage your listings and connect with device donors"
  },
  login_phone_label: {
    bn: "মোবাইল নম্বর",
    en: "Phone Number"
  },
  login_phone_placeholder: {
    bn: "০১XXXXXXXXX",
    en: "e.g. 01700000001"
  },
  login_pass_label: {
    bn: "পাসওয়ার্ড",
    en: "Password"
  },
  login_pass_placeholder: {
    bn: "পাসওয়ার্ড লিখুন...",
    en: "Enter your password..."
  },
  login_btn: {
    bn: "লগইন করুন",
    en: "Log In"
  },
  login_submitting: {
    bn: "লগইন হচ্ছে...",
    en: "Logging in..."
  },
  login_no_account: {
    bn: "কোনো অ্যাকাউন্ট নেই?",
    en: "Don't have an account?"
  },
  login_register_link: {
    bn: "নতুন অ্যাকাউন্ট রেজিস্টার করুন",
    en: "Create an account"
  },
  login_error_invalid: {
    bn: "মোবাইল নম্বর বা পাসওয়ার্ড সঠিক নয়।",
    en: "Incorrect phone number or password."
  },
  login_demo_hint: {
    bn: "টেস্টিং অ্যাকাউন্ট: 01700000001 | পাসওয়ার্ড: password123",
    en: "Test Account: 01700000001 | Password: password123"
  }
} as const;

export type TranslationKey = keyof typeof translations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default to Bengali ('bn') as requested by user, with English option
  const [language, setLanguageState] = useState<Language>("bn");

  useEffect(() => {
    // Check saved preference in localStorage
    const saved = localStorage.getItem("preferred_lang") as Language | null;
    if (saved === "bn" || saved === "en") {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("preferred_lang", lang);
  };

  const toggleLanguage = () => {
    const next: Language = language === "bn" ? "en" : "bn";
    setLanguage(next);
  };

  const t = (key: TranslationKey): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language] || entry["en"] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
