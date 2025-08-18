import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-green-200">
      <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Leaf className="w-5 h-5 text-green-600" />
          <span className="text-sm text-gray-600">© 2025 KrishiMitra</span>
        </div>
        <span className="text-sm text-green-600 font-medium">Empowering Farmers</span>
      </div>
    </footer>
  );
}