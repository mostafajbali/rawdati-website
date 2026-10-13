import React from 'react';
import {
  Menu,
  X,
  Heart,
  Globe,
  User,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Banknote,
  ArrowRight,
  ArrowLeft,
  BadgeCheck,
  ShieldCheck,
  Award,
  MessageSquare,
  MessageSquareHeart,
  CalendarClock,
  Calendar,
  Star,
  SlidersHorizontal,
  LayoutGrid,
  Map,
  SearchX,
  Filter,
  Phone,
  Mail,
  Share2,
  Headphones,
  Camera,
  ZoomIn,
  Edit3,
  Lock,
  CheckCircle2,
  Check,
  Send,
  ThumbsUp,
  GraduationCap,
  Video,
  HeartPulse,
  DoorOpen,
  Utensils,
  Home,
  Palette,
  Music,
  Brain,
  Dumbbell,
  Trees,
  HelpCircle,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';

export interface AppIconProps {
  name: string;
  className?: string;
  size?: number;
  filled?: boolean;
  style?: React.CSSProperties;
}

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number; fill?: string; stroke?: string; style?: React.CSSProperties }>> = {
  // Navigation & UI
  menu: Menu,
  close: X,
  language: Globe,
  person: User,
  user: User,
  home: Home,
  search: Search,
  search_off: SearchX,
  expand_more: ChevronDown,
  expand_less: ChevronUp,
  chevron_down: ChevronDown,
  chevron_up: ChevronUp,
  chevron_right: ChevronRight,
  chevron_left: ChevronLeft,
  arrow_forward: ArrowRight,
  arrow_back: ArrowLeft,
  arrow_right: ArrowRight,
  arrow_left: ArrowLeft,

  // Trust & Badges
  verified: BadgeCheck,
  verified_user: ShieldCheck,
  task_alt: CheckCircle2,
  check_circle: CheckCircle2,
  check: Check,
  workspace_premium: Award,
  award: Award,
  star: Star,
  favorite: Heart,
  heart: Heart,

  // Feedback & Reviews
  reviews: MessageSquareHeart,
  rate_review: Edit3,
  edit_note: Edit3,
  forum: MessageSquare,
  chat: MessageSquare,
  thumb_up: ThumbsUp,

  // Time & Location
  calendar_clock: CalendarClock,
  calendar_month: Calendar,
  calendar: Calendar,
  clock: Clock,
  location_on: MapPin,
  map: Map,
  grid_view: LayoutGrid,

  // Actions & Inputs
  tune: SlidersHorizontal,
  filter_alt: Filter,
  payments: Banknote,
  send: Send,
  share: Share2,
  zoom_in: ZoomIn,
  lock: Lock,

  // Facilities & Tags
  school: GraduationCap,
  photo_camera: Camera,
  videocam: Video,
  medical_services: HeartPulse,
  door_sliding: DoorOpen,
  restaurant: Utensils,
  support_agent: Headphones,
  call: Phone,
  phone: Phone,
  mail: Mail,
  palette: Palette,
  music_note: Music,
  psychology: Brain,
  sports_soccer: Dumbbell,
  nature_people: Trees,
  sparkles: Sparkles,
  info: Info,
};

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  className = 'w-4 h-4',
  size,
  filled = false,
  style
}) => {
  const normalizedKey = name.trim().toLowerCase();
  const IconComponent = iconMap[normalizedKey] || HelpCircle;

  return (
    <IconComponent
      className={className}
      size={size}
      fill={filled ? 'currentColor' : 'none'}
      style={style}
    />
  );
};
