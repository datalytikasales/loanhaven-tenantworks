import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Collateral {
  name: string;
  value: number;
  pic_1: string;
  pic_2: string;
}

interface CollateralFormProps {
  collaterals: Collateral[];
  setCollaterals: React.Dispatch<React.SetStateAction<Collateral[]>>;
}

export function CollateralForm({ collaterals, setCollaterals }: CollateralFormProps) {
  const handleAddCollateral = () => {
    setCollaterals([...collaterals, {
      name: "",
      value: 0,
      pic_1: "",
      pic_2: ""
    }]);
  };

  return (
    <div className="space-y-4">
      {collaterals.map((collateral, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded">
          <Input
            placeholder="Collateral Name"
            value={collateral.name}
            onChange={(e) => {
              const newCollaterals = [...collaterals];
              newCollaterals[index].name = e.target.value;
              setCollaterals(newCollaterals);
            }}
          />
          <Input
            type="number"
            placeholder="Value"
            value={collateral.value}
            onChange={(e) => {
              const newCollaterals = [...collaterals];
              newCollaterals[index].value = parseFloat(e.target.value);
              setCollaterals(newCollaterals);
            }}
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const newCollaterals = [...collaterals];
              newCollaterals[index].pic_1 = e.target.value;
              setCollaterals(newCollaterals);
            }}
            className="col-span-2"
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const newCollaterals = [...collaterals];
              newCollaterals[index].pic_2 = e.target.value;
              setCollaterals(newCollaterals);
            }}
            className="col-span-2"
          />
        </div>
      ))}
      <Button type="button" variant="outline" onClick={handleAddCollateral}>
        Add Another Collateral
      </Button>
    </div>
  );
}