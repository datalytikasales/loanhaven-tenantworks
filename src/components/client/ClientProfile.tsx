import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface ClientProfileProps {
  client: any; // We'll properly type this later
}

export function ClientProfile({ client }: ClientProfileProps) {
  return (
    <div className="space-y-6">
      {/* Top Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              {client.passport_photo && (
                <img
                  src={client.passport_photo}
                  alt="Client"
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
              )}
              <h3 className="font-semibold text-lg">
                {client.first_name} {client.last_name}
              </h3>
              <p className="text-sm text-muted-foreground">
                Client since: {format(new Date(client.date_of_onboarding), 'MMM dd, yyyy')}
              </p>
              <p className="text-sm text-muted-foreground">
                ID: {client.national_id}
              </p>
              <p className="text-sm text-muted-foreground">
                Client ID: {client.client_id}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-center">TOTAL LOANS DISBURSED</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-center">
              {client.loans?.length || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-center">TOTAL PAYMENTS RECEIVED</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-center">
              KES 0.00
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-center">AMOUNTS DUE</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-center">
              KES 0.00
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Client Details */}
        <Card>
          <CardHeader>
            <CardTitle>Client Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Email</TableCell>
                  <TableCell>{client.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Phone Number</TableCell>
                  <TableCell>{client.phone_number}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">National ID</TableCell>
                  <TableCell>{client.national_id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Place of Work</TableCell>
                  <TableCell>{client.place_of_work || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Economic Activity</TableCell>
                  <TableCell>{client.work_economic_activity}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Nearest Building</TableCell>
                  <TableCell>{client.residence_nearest_building}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Nearest Road</TableCell>
                  <TableCell>{client.residence_nearest_road}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Date of Birth</TableCell>
                  <TableCell>
                    {format(new Date(client.date_of_birth), 'MMM dd, yyyy')}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Gender</TableCell>
                  <TableCell>{client.gender || 'N/A'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">ID Photos</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <a href={client.id_photo_front} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                        View ID Front
                      </a>
                      <a href={client.id_photo_back} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                        View ID Back
                      </a>
                      {client.passport_photo && (
                        <a href={client.passport_photo} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                          View Passport Photo
                        </a>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Loans Section */}
          <Card>
            <CardHeader>
              <CardTitle>Loans History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableBody>
                  {client.loans?.map((loan: any) => (
                    <TableRow key={loan.loan_id}>
                      <TableCell className="font-medium">{loan.loan_id}</TableCell>
                      <TableCell>KES {loan.principal}</TableCell>
                      <TableCell>{loan.loan_status}</TableCell>
                    </TableRow>
                  ))}
                  {(!client.loans || client.loans.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">No loans found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Next of Kin Section */}
          <Card>
            <CardHeader>
              <CardTitle>Next of Kin</CardTitle>
            </CardHeader>
            <CardContent>
              {client.client_next_of_kin?.map((kin: any) => (
                <Table key={kin.id} className="mb-4">
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Name</TableCell>
                      <TableCell>{kin.name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Phone Number</TableCell>
                      <TableCell>{kin.phone_number}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Relation</TableCell>
                      <TableCell>{kin.relation}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Residence</TableCell>
                      <TableCell>{kin.residence}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">National ID</TableCell>
                      <TableCell>{kin.national_id}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">ID Photos</TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <a href={kin.id_photo_front} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                            View ID Front
                          </a>
                          <a href={kin.id_photo_back} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                            View ID Back
                          </a>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ))}
              {(!client.client_next_of_kin || client.client_next_of_kin.length === 0) && (
                <p className="text-center text-muted-foreground">No next of kin information found</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}