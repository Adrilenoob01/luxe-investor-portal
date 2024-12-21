import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface InvestmentPackProps {
  title: string;
  minAmount: number;
  returnRate: number;
  description: string;
  progress: number;
  imageUrl?: string | null;
  shortDescription?: string | null;
  location?: string | null;
  category?: string | null;
  implementationDate?: string | null;
  endDate?: string | null;
}

export const InvestmentPack = ({
  title,
  minAmount,
  returnRate,
  description,
  progress,
  imageUrl,
  shortDescription,
  location,
  category,
  implementationDate,
  endDate,
}: InvestmentPackProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden">
      {imageUrl && (
        <div className="relative h-48 w-full">
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        {category && (
          <span className="inline-block px-3 py-1 text-sm font-semibold text-primary-600 bg-primary-50 rounded-full mb-2">
            {category}
          </span>
        )}
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        {shortDescription && (
          <p className="text-gray-600 text-sm mb-3">{shortDescription}</p>
        )}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progression</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Objectif</p>
              <p className="font-semibold">{minAmount.toLocaleString()}€</p>
            </div>
            <div>
              <p className="text-gray-600">Rendement</p>
              <p className="font-semibold text-primary">{returnRate}%</p>
            </div>
          </div>
          {location && (
            <div className="text-sm">
              <p className="text-gray-600">Localisation</p>
              <p className="font-semibold">{location}</p>
            </div>
          )}
          {implementationDate && (
            <div className="text-sm">
              <p className="text-gray-600">Date de mise en œuvre</p>
              <p className="font-semibold">
                {new Date(implementationDate).toLocaleDateString()}
              </p>
            </div>
          )}
          <Button 
            className="w-full" 
            onClick={() => navigate("/payment")}
          >
            Investir
          </Button>
        </div>
      </div>
    </Card>
  );
};