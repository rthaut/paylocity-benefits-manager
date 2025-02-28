"use client";

import { useState } from "react";

import type { Relationship } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface DependentFormProps {
  initialName?: string;
  initialRelationship?: Relationship;
  onSubmit: (name: string, relationship: Relationship) => void;
  onCancel: () => void;
}

export function DependentForm({
  initialName = "",
  initialRelationship = "spouse",
  onSubmit,
  onCancel,
}: DependentFormProps) {
  const [error, setError] = useState("");
  const [name, setName] = useState(initialName);
  const [relationship, setRelationship] =
    useState<Relationship>(initialRelationship);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name.trim().length < 3) {
      setError(
        "Dependent name is required and must be at least 3 characters long"
      );
      return;
    }

    onSubmit(name, relationship);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="dependent-name">Dependent Name</Label>
        <Input
          id="dependent-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          placeholder="Enter dependent name"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <div className="space-y-2">
        <Label>Relationship</Label>
        <RadioGroup
          value={relationship}
          onValueChange={(value) => setRelationship(value as Relationship)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="spouse" id="spouse" />
            <Label htmlFor="spouse">Spouse</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="child" id="child" />
            <Label htmlFor="child">Child</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
