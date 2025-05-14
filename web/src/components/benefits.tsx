import { Clock, Server, Sparkles, UserCheck } from "lucide-react";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
};
const FeatureCard = ({ title, description, icon }: FeatureCardProps) => {
  return (
    <div className="rounded-lg border border-input bg-primary-foreground p-6 transition-all duration-300 hover:border-accent/75 hover:shadow-accent hover:shadow-lg hover:-translate-y-1">
      <div className="flex h-full flex-col">
        <div className="mb-4">{icon}</div>
        <h3 className="mb-2 font-semibold text-xl">{title}</h3>
        <p className="flex-grow text-gray-300">{description}</p>
      </div>
    </div>
  );
};

export const Benefits = () => {
  const benefits = [
    {
      title: "Natural Language Understanding",
      description:
        "Simply describe what you want to do in plain English. No need to memorize complex command syntax or parameters.",
      icon: <Sparkles className="h-8 w-8 text-primary" />,
    },
    {
      title: "Save Hours of Time",
      description:
        "Create complex commands in seconds that would take minutes or hours to manually type and debug.",
      icon: <Clock className="h-8 w-8 text-primary" />,
    },
    {
      title: "For Players of All Levels",
      description:
        "Whether you're a beginner or an expert, transform your Minecraft experience with powerful commands you never knew existed.",
      icon: <UserCheck className="h-8 w-8 text-primary" />,
    },
    {
      title: "Server Admin's Best Friend",
      description:
        "Quickly create custom game mechanics, events, and advanced server configurations without extensive knowledge.",
      icon: <Server className="h-8 w-8 text-primary" />,
    },
  ];

  return (
    <section id="benefits" className="bg-primary-foreground py-16">
      <div className="mb-12 text-center">
        <h2 className="mb-4 font-bold text-3xl md:text-4xl">
          Why use Natural Commands?
        </h2>
        <p className="mx-auto max-w-3xl text-gray-300 text-xl">
          Our plugin revolutionizes how you interact with Minecraft, making
          complex commands accessible to everyone.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {benefits.map((benefit) => (
          <FeatureCard
            key={benefit.title}
            title={benefit.title}
            description={benefit.description}
            icon={benefit.icon}
          />
        ))}
      </div>
    </section>
  );
};
