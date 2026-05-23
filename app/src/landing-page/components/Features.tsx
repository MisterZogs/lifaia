import SectionTitle from "./SectionTitle";
import { Card, CardContent } from "../../client/components/ui/card";

export interface Feature {
  name: string;
  description: string;
  icon: string;
  href?: string;
}

export default function Features({ features }: { features: Feature[] }) {
  return (
    <div id="features" className="mx-auto mt-48 max-w-7xl px-6 lg:px-8">
      <SectionTitle
        title={
          <p className="text-foreground mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            The <span className="text-secondary">Best</span> Features
          </p>
        }
        description="Don't work harder. Work smarter."
      />
      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
        <div className="grid max-w-xl grid-cols-1 gap-6 lg:max-w-none lg:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.name} variant="bento" className="p-6">
              <CardContent className="p-0 flex gap-4">
                <div className="border-accent bg-accent/30 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-2xl">
                  {feature.icon}
                </div>
                <div>
                  <p className="text-foreground text-base font-semibold leading-7">{feature.name}</p>
                  <p className="text-muted-foreground mt-1 text-sm leading-6">{feature.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
