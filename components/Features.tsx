import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, PaintBucket, Download, Palette, Image as ImageIcon, Lock } from 'lucide-react'

export default function Features() {
  return (
    <section id="features" className="w-full bg-gradient-to-b from-white to-slate-50 py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
          <div className="inline-flex items-center rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 text-sm font-medium text-purple-700">
            <span>Powerful Features</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-gray-900">
            Everything you need for the
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-600">
              perfect QR code
            </span>
          </h2>
          <p className="max-w-[700px] text-gray-600 md:text-lg">
            Create unique, branded QR codes with our comprehensive set of customization tools and features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<PaintBucket className="h-6 w-6" />}
            title="Custom Colors"
            description="Choose from solid colors, gradients, or multiple colors to match your brand perfectly."
          />
          <FeatureCard 
            icon={<Palette className="h-6 w-6" />}
            title="Style Options"
            description="Adjust roundness, opacity, scale, and more to create unique QR codes that stand out."
          />
          <FeatureCard 
            icon={<ImageIcon className="h-6 w-6" />}
            title="Add Your Logo"
            description="Insert your logo or any image into the center of your QR code for instant brand recognition."
          />
          <FeatureCard 
            icon={<QrCode className="h-6 w-6" />}
            title="Multiple Shapes"
            description="Choose from different module shapes - squares, circles, or rounded corners."
          />
          <FeatureCard 
            icon={<Download className="h-6 w-6" />}
            title="HD Export"
            description="Download your QR codes in PNG, WEBP, or SVG format at any resolution you need."
          />
          <FeatureCard 
            icon={<Lock className="h-6 w-6" />}
            title="Always Works"
            description="Every QR code is tested to ensure it scans perfectly on all devices and apps."
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string 
}) {
  return (
    <Card className="group relative border-gray-200 bg-white hover:border-purple-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="relative space-y-4">
        <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <div className="text-purple-600">
            {icon}
          </div>
        </div>
        <CardTitle className="text-xl font-semibold text-gray-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <CardDescription className="text-gray-600 leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}