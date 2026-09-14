export function Logo({ sellerName = "Jorab Moon" }: { sellerName?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-foreground"
        >
          {/* Crescent moon shape */}
          <path
            d="M20 5C13.373 5 8 10.373 8 17C8 23.627 13.373 29 20 29C21.5 29 22.9 28.7 24.2 28.2C21.5 26.5 19.5 23.5 19.5 20C19.5 16.5 21.5 13.5 24.2 11.8C22.9 11.3 21.5 11 20 11C16.686 11 14 13.686 14 17C14 20.314 16.686 23 20 23C20.8 23 21.5 22.8 22.2 22.5C21.2 21.5 20.5 20.1 20.5 18.5C20.5 16.9 21.2 15.5 22.2 14.5C21.5 14.2 20.8 14 20 14C18.343 14 17 15.343 17 17C17 18.657 18.343 20 20 20V5Z"
            fill="currentColor"
          />
          {/* Sock outline integrated with moon */}
          <path
            d="M25 15C25 15 27 16 28 18C29 20 29 22 28 24C27 26 25 27 25 27L23 29C23 29 22 30 21 30C20 30 19 29 19 29L17 27C17 27 15 26 14 24C13 22 13 20 14 18C15 16 17 15 17 15V12C17 12 17 10 19 10H23C25 10 25 12 25 12V15Z"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-xl font-bold tracking-tight">{sellerName}</span>
        <span className="font-mono text-[10px] tracking-wider text-muted-foreground">ARTISTIC SOCKS</span>
      </div>
    </div>
  )
}
