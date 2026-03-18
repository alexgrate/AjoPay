import { Users, CalendarCheck, Banknote, Twitter, Facebook, Instagram, Linkedin, Github, Shield, Globe, Zap, Heart } from "lucide-react";
import TomiwaImg from "../assets/tomiwa.png"
import AlexImg from "../assets/alex.png"

export const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Community", href: "#community" },
];

export const footerLinks = {
    Product: [
        { label: "How It Works", href: "/#how-it-works" },
        { label: "Features", href: null },
        { label: "Pricing", href: null },
        { label: "Security", href: null },
    ],
    Company: [
        { label: "About Us", href: "/about" },
        { label: "Blog", href: null },
        { label: "Careers", href: null },
        { label: "Contact", href: "/contact" },
    ],
    Legal: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
    ],
};

export const socials = [
    { icon: Twitter,   href: "#" },
    { icon: Facebook,  href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Linkedin,  href: "#" },
];

export const steps = [
    {
        icon: Users,
        title: "Create or Join",
        description:
        "Start a new savings group or join an existing one with trusted friends and family.",
        bg: "#2d3b1f",
        iconColor: "#fff",
        accent: "#2d3b1f",
        step: "01",
    },
    {
        icon: CalendarCheck,
        title: "Contribute Monthly",
        description:
        "Make secure monthly contributions through Paystack. Track progress in real-time.",
        bg: "#d4a843",
        iconColor: "#fff",
        accent: "#d4a843",
        step: "02",
    },
    {
        icon: Banknote,
        title: "Receive Your Payout",
        description:
        "Get your automatic payout when it's your turn. Celebrate your financial milestone!",
        bg: "#e8863a",
        iconColor: "#fff",
        accent: "#e8863a",
        step: "03",
    },
];

export const testimonials = [
    {
        name: "Chioma Okafor",
        location: "Lagos, Nigeria",
        rating: 5,
        text: "AjoPay helped me save ₦600,000 in just 6 months! The automatic payments made it so easy, and receiving my payout felt like a celebration. Best decision ever!",
        avatarBg: "linear-gradient(135deg, #2d3b1f, #4a6030)",
        dotColor: "#d4a843",
        delay: 0.1,
    },
    {
        name: "Emeka Nwosu",
        location: "Abuja, Nigeria",
        rating: 5,
        text: "I started a group with my colleagues and we've been saving together for a year now. The transparency and trust AjoPay provides is unmatched. Highly recommend!",
        avatarBg: "linear-gradient(135deg, #3a4e22, #5a7035)",
        dotColor: "#d4a843",
        delay: 0.22,
        featured: true,
    },
    {
        name: "Aisha Mohammed",
        location: "Port Harcourt, Nigeria",
        rating: 4,
        text: "As a small business owner, AjoPay has been a game-changer. I can now plan my finances better and the community support is amazing. Thank you AjoPay!",
        avatarBg: "linear-gradient(135deg, #2d3b1f, #4a6030)",
        dotColor: "#d4a843",
        delay: 0.34,
    },
];



// ABOUT PAGE 

export const team = [
    {
        name: "Alex Dominion .A",
        role: "Full-Stack Developer",
        image: AlexImg, 
        socials: [
            { icon: Twitter,  href: "https://x.com/heisalexxx?s=21",    label: "Twitter"  },
            { icon: Linkedin, href: "http://linkedin.com/in/aigbodion-dominion-336263254", label: "LinkedIn" },
            { icon: Github,   href: "https://github.com/alexgrate",      label: "GitHub"   },
        ],
    },

    {
        name: "Tomiwa Sowemimo",
        role: "Project Manager & UI/UX Designer",
        image: TomiwaImg, 
        socials: [
            { icon: Twitter,  href: "https://x.com/SOluwatomi84135",    label: "Twitter"  },
            { icon: Linkedin, href: "https://www.linkedin.com/in/oluwatomiwa-sowemimo-22a900347", label: "LinkedIn" },
            { icon: Github,   href: "https://github.com/TomiwaSowemimo",      label: "GitHub"   },
        ],
    },
];

export const stats = [
    { value: "₦0",    label: "Platform Fee",       sub: "Free to join" },
    { value: "100%",  label: "Paystack Secured",   sub: "Bank-level encryption" },
    { value: "360°",  label: "Trust System",       sub: "BVN + credit verified" },
    { value: "∞",     label: "Savings Cycles",     sub: "Groups restart forever" },
];

export const values = [
    {
        icon: Shield,
        color: "#1db893",
        bg: "rgba(29,184,147,0.1)",
        title: "Trust First",
        desc: "Every member is BVN-verified and credit-scored before joining. We built a full trust tier system — from New Member to Highly Trusted — so your savings are always in good hands.",
    },
    {
        icon: Globe,
        color: "#d4a843",
        bg: "rgba(212,168,67,0.1)",
        title: "Community Rooted",
        desc: "Ajo and Esusu are centuries-old Nigerian traditions. We didn't invent rotating savings — we digitized it, secured it, and made it accessible to every Nigerian with a smartphone.",
    },
    {
        icon: Zap,
        color: "#7c5cbf",
        bg: "rgba(124,92,191,0.1)",
        title: "Radically Transparent",
        desc: "Every contribution, every payout, every cycle is tracked and visible. No hidden fees on the payout. Your ₦50,000 arrives as ₦50,000 — not a kobo less.",
    },
    {
        icon: Heart,
        color: "#e84343",
        bg: "rgba(232,67,67,0.1)",
        title: "Built for Nigeria",
        desc: "Not a copy of a western fintech. AjoPay was designed for how Nigerians actually save — in circles, with trusted people, driven by community accountability.",
    },
];

export const timeline = [
    {
        year: "The Problem",
        title: "Ajo was broken",
        desc: "Millions of Nigerians participate in Ajo and Esusu every day. But defaults, distrust, and lack of accountability meant billions of naira lost annually in informal savings circles.",
        color: "#e84343",
    },
    {
        year: "The Vision",
        title: "What if Ajo had a backbone?",
        desc: "We asked: what if every member was verified? What if every contribution was tracked? What if payouts were automated? AjoPay was born from that question.",
        color: "#d4a843",
    },
    {
        year: "The Build",
        title: "Engineering trust",
        desc: "We built BVN verification, credit scoring, trust tiers, cycle management, and Paystack integration from scratch — creating the first fully automated Ajo platform in Nigeria.",
        color: "#1db893",
    },
    {
        year: "Today",
        title: "Savings, reimagined",
        desc: "AjoPay is live. Groups start, cycles complete, payouts release — automatically. The centuries-old tradition of Ajo, now with the security of a bank.",
        color: "#7c5cbf",
    },
];
