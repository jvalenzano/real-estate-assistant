export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </div>
  );
}