interface ClientInfoDisplayProps {
  client: any;
}

export function ClientInfoDisplay({ client }: ClientInfoDisplayProps) {
  if (!client) return null;

  return (
    <div className="mt-4 p-4 bg-muted rounded-lg">
      <h3 className="font-semibold mb-2">Client Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <p>Name: {client.first_name} {client.last_name}</p>
        <p>Email: {client.email}</p>
        <p>Phone: {client.phone_number}</p>
        <p>ID: {client.national_id}</p>
      </div>
    </div>
  );
}