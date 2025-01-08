import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BankInfo } from "@/types/withdrawal";

interface WithdrawalFormProps {
  bankInfo: BankInfo;
  setBankInfo: (info: BankInfo) => void;
  amount: number;
}

export const WithdrawalForm = ({ bankInfo, setBankInfo, amount }: WithdrawalFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label>IBAN</Label>
        <Input
          value={bankInfo.iban}
          onChange={(e) => setBankInfo({ ...bankInfo, iban: e.target.value })}
          placeholder="FR76..."
        />
      </div>
      <div>
        <Label>Prénom</Label>
        <Input
          value={bankInfo.firstName}
          onChange={(e) => setBankInfo({ ...bankInfo, firstName: e.target.value })}
        />
      </div>
      <div>
        <Label>Nom</Label>
        <Input
          value={bankInfo.lastName}
          onChange={(e) => setBankInfo({ ...bankInfo, lastName: e.target.value })}
        />
      </div>
      <div>
        <Label>Adresse</Label>
        <Input
          value={bankInfo.address}
          onChange={(e) => setBankInfo({ ...bankInfo, address: e.target.value })}
        />
      </div>
      <div>
        <Label>Téléphone</Label>
        <Input
          value={bankInfo.phone}
          onChange={(e) => setBankInfo({ ...bankInfo, phone: e.target.value })}
          placeholder="+33..."
        />
      </div>
      <p className="text-sm text-gray-500">
        Montant net que vous recevrez : {amount > 0 ? (amount - 0.5).toFixed(2) : 0}€
        <br />
        (Montant demandé : {amount}€ - Frais : 0,50€)
      </p>
    </div>
  );
};