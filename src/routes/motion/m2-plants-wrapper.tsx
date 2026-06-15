import { createFileRoute } from '@tanstack/react-router';
import { plantWrapper as PlantWrapper } from '#/components/plant-wrapper';

export const Route = createFileRoute('/motion/m2-plants-wrapper')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="min-h-screen bg-stone-50 px-6 py-16">
      <div className="mx-auto w-3xl">
        <PlantWrapper>
          <section className="h-64 w-full rounded-2xl border border-stone-200">
            {/* <p>Grass</p> */}
          </section>
        </PlantWrapper>
      </div>
    </main>
  );
}
