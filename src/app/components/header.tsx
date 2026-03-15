import { Building2, Sparkles } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl mb-8 shadow-2xl border border-emerald-100">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1623051786509-57224cdc43e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBidWlsZGluZyUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzI1MzAxNjR8MA&ixlib=rb-4.1.0&q=80&w=1080')] bg-cover bg-center opacity-20"></div>
      </div>

      {/* Decorative geometric patterns */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 animate-pulse"></div>

      {/* Content */}
      <div className="relative px-6 py-10 md:px-10 md:py-14">
        <div className="flex items-center gap-4 md:gap-6 mb-6">
          {/* Modern icon with glow effect */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl animate-pulse"></div>
            <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300 hover:rotate-6">
              <Building2 className="h-8 w-8 md:h-10 md:w-10 text-white drop-shadow-2xl" strokeWidth={2.5} />
            </div>
          </div>
          
          {/* Title */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-5xl text-white mb-0 tracking-wide font-bold drop-shadow-2xl">
                Nalanda Town
              </h1>
              <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-cyan-300 animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1 w-12 bg-gradient-to-r from-white/80 to-transparent rounded-full"></div>
              <p className="text-emerald-100 text-base md:text-lg font-medium drop-shadow-lg">
                Premium Residential Society
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/30">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></div>
              <div className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <h2 className="text-xl md:text-2xl text-white mb-0 font-semibold drop-shadow-lg">{title}</h2>
          </div>
          <p className="text-emerald-100 mt-2 ml-9 text-sm md:text-base drop-shadow">{subtitle}</p>
        </div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-0 right-0 w-48 h-48 md:w-72 md:h-72 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 md:w-64 md:h-64 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-3xl" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-1/2 right-1/4 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
    </div>
  );
}