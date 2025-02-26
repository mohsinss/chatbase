// This file provides type declarations for components that couldn't be installed due to dependency conflicts

declare module '@/components/ui/popover' {
  export const Popover: React.FC<any>;
  export const PopoverContent: React.ForwardRefExoticComponent<any>;
  export const PopoverTrigger: React.ForwardRefExoticComponent<any>;
}

declare module '@/components/ui/calendar' {
  export const Calendar: React.FC<any>;
}

declare module '@/components/ui/radio-group' {
  export const RadioGroup: React.ForwardRefExoticComponent<any>;
  export const RadioGroupItem: React.ForwardRefExoticComponent<any>;
} 