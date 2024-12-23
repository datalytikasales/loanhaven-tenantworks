import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NextOfKin {
  name: string;
  phone_number: string;
  relation: string;
  residence: string;
  national_id: string;
  id_photo_front: string;
  id_photo_back: string;
}

interface NextOfKinFormProps {
  nextOfKin: NextOfKin[];
  setNextOfKin: React.Dispatch<React.SetStateAction<NextOfKin[]>>;
  includeIdDetails?: boolean;
}

export function NextOfKinForm({ nextOfKin, setNextOfKin, includeIdDetails = false }: NextOfKinFormProps) {
  const handleAddNextOfKin = () => {
    setNextOfKin([...nextOfKin, { 
      name: "", 
      phone_number: "", 
      relation: "",
      residence: "",
      national_id: "",
      id_photo_front: "",
      id_photo_back: ""
    }]);
  };

  return (
    <div className="space-y-4">
      {nextOfKin.map((kin, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded">
          <Input
            placeholder="Name"
            value={kin.name}
            onChange={(e) => {
              const newKin = [...nextOfKin];
              newKin[index].name = e.target.value;
              setNextOfKin(newKin);
            }}
          />
          <Input
            placeholder="Phone Number"
            value={kin.phone_number}
            onChange={(e) => {
              const newKin = [...nextOfKin];
              newKin[index].phone_number = e.target.value;
              setNextOfKin(newKin);
            }}
          />
          <Input
            placeholder="Relation"
            value={kin.relation}
            onChange={(e) => {
              const newKin = [...nextOfKin];
              newKin[index].relation = e.target.value;
              setNextOfKin(newKin);
            }}
          />
          {includeIdDetails && (
            <>
              <Input
                placeholder="Residence"
                value={kin.residence}
                onChange={(e) => {
                  const newKin = [...nextOfKin];
                  newKin[index].residence = e.target.value;
                  setNextOfKin(newKin);
                }}
              />
              <Input
                placeholder="National ID"
                value={kin.national_id}
                onChange={(e) => {
                  const newKin = [...nextOfKin];
                  newKin[index].national_id = e.target.value;
                  setNextOfKin(newKin);
                }}
              />
              <Input
                placeholder="ID Photo Front"
                value={kin.id_photo_front}
                onChange={(e) => {
                  const newKin = [...nextOfKin];
                  newKin[index].id_photo_front = e.target.value;
                  setNextOfKin(newKin);
                }}
              />
              <Input
                placeholder="ID Photo Back"
                value={kin.id_photo_back}
                onChange={(e) => {
                  const newKin = [...nextOfKin];
                  newKin[index].id_photo_back = e.target.value;
                  setNextOfKin(newKin);
                }}
              />
            </>
          )}
        </div>
      ))}
      <Button type="button" variant="outline" onClick={handleAddNextOfKin}>
        Add Another Next of Kin
      </Button>
    </div>
  );
}