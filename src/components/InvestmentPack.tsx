import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
  status?: string;
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
  status,
}: InvestmentPackProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'collecting':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string | undefined) => {
    switch (status) {
      case 'collecting':
        return 'En cours';
      case 'completed':
        return 'Terminée';
      case 'upcoming':
        return 'Prochainement';
      default:
        return status;
    }
  };

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
        <div className="flex justify-between items-start mb-4">
          {category && (
            <span className="inline-block px-3 py-1 text-sm font-semibold text-primary-600 bg-primary-50 rounded-full">
              {category}
            </span>
          )}
          {status && (
            <Badge className={getStatusColor(status)}>
              {getStatusText(status)}
            </Badge>
          )}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        {shortDescription && (
          <p className="text-gray-600 text-sm mb-3">{shortDescription}</p>
        )}
        <p className="text-gray-600 text-sm mb-4">{description}</p>
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
              <p className="text-gray-600">Date de début</p>
              <p className="font-semibold">
                {new Date(implementationDate).toLocaleDateString()}
              </p>
            </div>
          )}
          {endDate && (
            <div className="text-sm">
              <p className="text-gray-600">Date de fin</p>
              <p className="font-semibold">
                {new Date(endDate).toLocaleDateString()}
              </p>
            </div>
          )}
          <div className="text-sm">
            <p className="text-gray-600">Investissement minimum</p>
            <p className="font-semibold">{minAmount}€</p>
          </div>
          <Button 
            className="w-full" 
            onClick={() => navigate("/payment")}
            disabled={status === 'completed' || status === 'upcoming'}
          >
            {status === 'completed' 
              ? 'Objectif atteint' 
              : status === 'upcoming' 
                ? 'Prochainement' 
                : 'Investir'}
          </Button>
        </div>
      </div>
    </Card>
  );
};