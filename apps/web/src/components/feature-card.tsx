type FeatureCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

export const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-6 transition-all duration-300 hover:border-accent/50 hover:shadow-accent/10 hover:shadow-lg">
      <div className="flex h-full flex-col">
        <div className="mb-4">{icon}</div>
        <h3 className="mb-2 font-semibold text-xl">{title}</h3>
        <p className="flex-grow text-gray-300">{description}</p>
      </div>
    </div>
  );
};
