import { ClientBasicsTitle, ClientBackToBasicsGrid } from "./client-components";

export default function BasicsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto text-left space-y-4">
          <ClientBasicsTitle />
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pt-8 pb-16 px-4">
        <div className="container mx-auto">
          <ClientBackToBasicsGrid />
        </div>
      </section>
    </div>
  );
}
