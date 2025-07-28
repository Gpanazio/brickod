export default function BrickFooter() {
  return (
    <footer className="brick-black text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <div className="h-16 flex items-center mb-4">
            <svg viewBox="0 0 200 50" className="h-16 w-auto">
              <text x="10" y="35" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" fill="white">
                BRICK
              </text>
            </svg>
          </div>
          <p className="text-gray-400 text-sm">Powered by BrickAI</p>
        </div>
      </div>
    </footer>
  );
}
