"use client";

import { useState } from "react";
import { CodeExample } from "./code-example";

const examples = [
  {
    input: "Summon a donkey with a saddle and name him My cool donkey",
    output:
      '/summon donkey ~ ~1 ~ {SaddleItem:{id:saddle,Count:1},CustomName:"My cool donkey"}',
  },
  {
    input:
      "Summon a master farmer villager with the name Farmer Joe that sells 1 emerald for 1 diamond",
    output:
      '/summon villager ~ ~1 ~ {VillagerData:{profession:farmer,level:5,type:plains},CustomName:"Farmer Joe",Offers:{Recipes:[{buy:{id:diamond,count:1},sell:{id:emerald,count:1},rewardExp:0b,maxUses:9999999}]}}',
  },
  {
    input: "Give me a diamond sword with the lore 'Very sharp'",
    output: '/give @p diamond_sword display:[lore:["Very sharp"]] 1',
  },
];

export const Examples = () => {
  const [activeExample, setActiveExample] = useState(0);

  return (
    <section id="examples" className="py-16">
      <div className="mb-12 text-center">
        <h2 className="mb-4 font-bold text-3xl md:text-4xl">
          See It In Action
        </h2>
        <p className="mx-auto max-w-3xl text-secondary-foreground text-xl">
          Type what you want to do in plain English, and Natural Commands
          instantly generates the perfect command.
        </p>
      </div>

      <div className="mx-auto max-w-4xl overflow-hidden rounded-lg border border-input bg-card shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="border-input border-b p-4 md:border-r md:border-b-0 md:p-6">
            <h3 className="mb-4 font-medium text-lg">Examples</h3>
            <div className="flex flex-col space-y-2">
              {examples.map((example, index) => (
                <button
                  type="button"
                  key={index}
                  className={`rounded-md p-3 text-left transition-colors ${
                    activeExample === index
                      ? "bg-accent/20 text-primary"
                      : "text-secondary-foreground hover:bg-accent/10"
                  }`}
                  onClick={() => setActiveExample(index)}
                >
                  {example.input.length > 50
                    ? `${example.input.substring(0, 47)}...`
                    : example.input}
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-2 p-4 md:p-6">
            <CodeExample
              input={examples[activeExample].input}
              output={examples[activeExample].output}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
