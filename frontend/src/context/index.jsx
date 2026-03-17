import { Users, CalendarCheck, Banknote, Twitter, Facebook, Instagram, Linkedin, CircleDollarSign, Gift, Search, History, UserPlus, TrendingUp, Plus } from "lucide-react";


export const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Community", href: "#community" },
];

export const footerLinks = {
    Product: [
        { label: "How It Works", href: "#how-it-works" },
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Security", href: "#security" },
    ],
    Company: [
        { label: "About Us", href: "#about" },
        { label: "Blog", href: "#blog" },
        { label: "Careers", href: "#careers" },
        { label: "Contact", href: "#contact" },
    ],
    Legal: [
        { label: "Privacy Policy", href: "#privacy" },
        { label: "Terms of Service", href: "#terms" },
        { label: "Cookie Policy", href: "#cookies" },
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

export const statCards = [
    { icon: CircleDollarSign, iconBg: "#2d3b1f",  label: "Total Saved",value: "₦540,000", badge: "+12%", badgeBg: "#dcf5e0", badgeFg: "#1a7a2e" },
    { icon: Users, iconBg: "#d4a843",  label: "Active Groups", value: "3", badge: "+1", badgeBg: "#fff8e0", badgeFg: "#8a6a00" },
    { icon: Gift, iconBg: "#e8863a",  label: "Next Payout",   value: "₦100,000",  badge: "5 days", badgeBg: "#fff0e0", badgeFg: "#a04a00" },
    { icon: Banknote, iconBg: "#7c5cbf",  label: "Total Payouts", value: "₦200,000",  badge: "2 received", badgeBg: "#f0e8ff", badgeFg: "#5a2ca0" },
];

export const groups = [
    { name: "Lagos Hustlers Circle", members: 10, amount: "₦50,000/month",  pos: 3, pct: 70, accent: "#d4a843", btnBg: "#d4a843", cardBg: "#fff",    payout: "Chioma A.", date: "15 Feb" },
    { name: "Tech Bros Savings",     members: 8,  amount: "₦100,000/month", pos: 2, pct: 85, accent: "#e8863a", btnBg: "#e8863a", cardBg: "#fff8f4", payout: "You",       date: "20 Feb" },
    { name: "Market Women Alliance", members: 15, amount: "₦30,000/month",  pos: 8, pct: 45, accent: "#7c5cbf", btnBg: "#7c5cbf", cardBg: "#f8f4ff", payout: "Mama Ngozi", date: "25 Feb" },
];

export const activities = [
    { Icon: TrendingUp, bg: "#e8f5e9", ic: "#2d7a3a", text: "You contributed ₦50,000 to Lagos Hustlers Circle", time: "2 hours ago" },
    { Icon: Gift, bg: "#fff0e0", ic: "#e8863a", text: "Chioma A. received ₦500,000 payout", time: "1 day ago" },
    { Icon: UserPlus, bg: "#f0e8ff", ic: "#7c5cbf", text: "New member joined Tech Bros Savings", time: "2 days ago" },
];

export const quickActions = [
    { Icon: Plus,    label: "Create New Group", href: "/create-group" },
    { Icon: Search,  label: "Browse Groups",    href: "/browse" },
    { Icon: History, label: "View History",     href: "/history" },
];

