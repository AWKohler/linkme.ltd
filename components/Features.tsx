import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { QrCode, PaintBucket, Download, Palette, Image as ImageIcon, Lock } from 'lucide-react'

export default function Features() {
  return (
    <section className="w-full bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-600">
            <span>Powerful Customization</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-gray-900">
            Everything you need to create the <span className="text-blue-600">perfect QR code</span>
          </h2>
          <p className="max-w-[800px] text-gray-500 md:text-xl">
            Our QR code generator offers a wide range of features to help you create unique, branded QR codes that stand out.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
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
            title="Add Images"
            description="Insert your logo or any image into the center of your QR code for better brand recognition."
          />
          <FeatureCard 
            icon={<QrCode className="h-6 w-6" />}
            title="Multiple Shapes"
            description="Choose from different shapes for the QR code modules - squares, rounded corners, or circles."
          />
          <FeatureCard 
            icon={<Download className="h-6 w-6" />}
            title="High-Resolution Export"
            description="Download your QR codes in PNG, WEBP, or SVG format with customizable resolution."
          />
          <FeatureCard 
            icon={<Lock className="h-6 w-6" />}
            title="Works Everywhere"
            description="All QR codes are fully scannable and tested to work with all modern devices and apps."
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
    <Card className="border-blue-100 bg-blue-50/50 hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="bg-white p-2 rounded-full shadow-sm border border-blue-100">
          {icon}
        </div>
        <CardTitle className="text-xl font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-600 text-base">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  )
}