import React from 'react';
// Only the icons the site actually uses are imported (keeps the website fast).
// If you add a service with a new icon name, add that icon here too.
import {
  Activity, Ambulance, Armchair, Baby, Banknote, Bed, BookMarked, BookOpen, Box, Briefcase,
  Building, Building2, Cable, Camera, Car, CarFront, ChefHat, Contact, CreditCard, Droplet,
  Droplets, Factory, Fan, FileCheck, FileKey, FileSearch, FileSignature, Flame, Gavel,
  Gift, GraduationCap, Grid, Handshake, HeartHandshake, Home, Landmark, Layers, LayoutGrid, Leaf,
  Lightbulb, Mail, Map, MapPin, MapPinned, Megaphone, MoreHorizontal, Mountain, Package,
  PartyPopper, Pill, Plane, Plug, Printer, Receipt, Replace, Rocket, Ruler, Scale, Scissors,
  Scroll, ScrollText, Search, Settings, Shield, ShieldCheck, Shirt, Siren, Snowflake, Sofa,
  Sparkles, SprayCan, Stethoscope, Store, Tractor, Truck, User, UserCog, UserPlus, Users,
  UsersRound, Utensils, Vote, Wind, Wrench, Zap, ZapOff,
  // Electrician & home repairs (30 Oct 2026)
  Heater, WashingMachine, Hammer, CircleHelp,
  Gem, // Gold Loan (was showing its name as text)
  Stamp, Luggage, // Visa, Tourism (30 Oct 2026)
  PaintRoller, Paintbrush, Umbrella, DoorOpen, SwatchBook, // Painting (30 Oct 2026)
  ShieldAlert, Rat, Bug, BugPlay, BedDouble, BugOff, Worm, Sprout, // Pest control (2 Nov 2026)
  Eye // NRI property watch (31 Oct 2026)
} from 'lucide-react';

const ICONS = {
  Eye,
  Stamp,
  Luggage,
  PaintRoller,
  Paintbrush,
  Umbrella,
  DoorOpen,
  SwatchBook,
  ShieldAlert,
  Rat,
  Bug,
  BugPlay,
  BedDouble,
  BugOff,
  Worm,
  Sprout,
  Gem,
  Heater,
  WashingMachine,
  Hammer,
  CircleHelp,
  Activity,
  Ambulance,
  Armchair,
  Baby,
  Banknote,
  Bed,
  BookMarked,
  BookOpen,
  Box,
  Briefcase,
  Building,
  Building2,
  Cable,
  Camera,
  Car,
  CarFront,
  ChefHat,
  Contact,
  CreditCard,
  Droplet,
  Droplets,
  Factory,
  Fan,
  FileCheck,
  FileKey,
  FileSearch,
  FileSignature,
  Flame,
  Gavel,
  Gift,
  GraduationCap,
  Grid,
  Handshake,
  HeartHandshake,
  Home,
  Landmark,
  Layers,
  LayoutGrid,
  Leaf,
  Lightbulb,
  Mail,
  Map,
  MapPin,
  MapPinned,
  Megaphone,
  MoreHorizontal,
  Mountain,
  Package,
  PartyPopper,
  Pill,
  Plane,
  Plug,
  Printer,
  Receipt,
  Replace,
  Rocket,
  Ruler,
  Scale,
  Scissors,
  Scroll,
  ScrollText,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Shirt,
  Siren,
  Snowflake,
  Sofa,
  Sparkles,
  SprayCan,
  Stethoscope,
  Store,
  Tractor,
  Truck,
  User,
  UserCog,
  UserPlus,
  Users,
  UsersRound,
  Utensils,
  Vote,
  Wind,
  Wrench,
  Zap,
  ZapOff,
};

export default function KalamkariIcon({ iconName, iconColor, size = 48 }) {
  const IconComponent = ICONS[iconName];

  // Default earthy fallback color if none provided
  const primaryColor = iconColor || '#D4A373';
  const bgColor = 'white';
  const innerShadow = `inset 0 0 12px ${primaryColor}22`; // Very subtle opacity for texture feel

  const containerStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: bgColor,
    border: `2px dashed ${primaryColor}`,
    boxShadow: innerShadow,
    color: primaryColor,
    flexShrink: 0,
  };

  if (!IconComponent) {
    // If the icon is an emoji or text that got missed, just render it inside the circle
    return (
      <div style={containerStyle}>
        <span style={{ fontSize: size * 0.5 }}>{iconName}</span>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <IconComponent size={size * 0.6} strokeWidth={1.5} />
    </div>
  );
}
