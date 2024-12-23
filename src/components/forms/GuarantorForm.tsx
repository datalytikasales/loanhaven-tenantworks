import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Guarantor {
  name: string;
  phone_number: string;
  national_id: string;
  place_of_work: string;
  id_photo_front: string;
  id_photo_back: string;
  passport_photo: string;
}

interface GuarantorFormProps {
  guarantors: Guarantor[];
  setGuarantors: React.Dispatch<React.SetStateAction<Guarantor[]>>;
}

export function GuarantorForm({ guarantors, setGuarantors }: GuarantorFormProps) {
  const handleAddGuarantor = () => {
    setGuarantors([...guarantors, {
      name: "",
      phone_number: "",
      national_id: "",
      place_of_work: "",
      id_photo_front: "",
      id_photo_back: "",
      passport_photo: ""
    }]);
  };

  return (
    <div className="space-y-4">
      {guarantors.map((guarantor, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded">
          <Input
            placeholder="Name"
            value={guarantor.name}
            onChange={(e) => {
              const newGuarantors = [...guarantors];
              newGuarantors[index].name = e.target.value;
              setGuarantors(newGuarantors);
            }}
          />
          <Input
            placeholder="Phone Number"
            value={guarantor.phone_number}
            onChange={(e) => {
              const newGuarantors = [...guarantors];
              newGuarantors[index].phone_number = e.target.value;
              setGuarantors(newGuarantors);
            }}
          />
          <Input
            placeholder="National ID"
            value={guarantor.national_id}
            onChange={(e) => {
              const newGuarantors = [...guarantors];
              newGuarantors[index].national_id = e.target.value;
              setGuarantors(newGuarantors);
            }}
          />
          <Input
            placeholder="Place of Work"
            value={guarantor.place_of_work}
            onChange={(e) => {
              const newGuarantors = [...guarantors];
              newGuarantors[index].place_of_work = e.target.value;
              setGuarantors(newGuarantors);
            }}
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const newGuarantors = [...guarantors];
              newGuarantors[index].id_photo_front = e.target.value;
              setGuarantors(newGuarantors);
            }}
            className="col-span-2"
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const newGuarantors = [...guarantors];
              newGuarantors[index].id_photo_back = e.target.value;
              setGuarantors(newGuarantors);
            }}
            className="col-span-2"
          />
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const newGuarantors = [...guarantors];
              newGuarantors[index].passport_photo = e.target.value;
              setGuarantors(newGuarantors);
            }}
            className="col-span-2"
          />
        </div>
      ))}
      <Button type="button" variant="outline" onClick={handleAddGuarantor}>
        Add Another Guarantor
      </Button>
    </div>
  );
}