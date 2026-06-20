import { View, Text } from '@react-pdf/renderer'
import { TicketRow } from '@/types/FlightTypes'
import PdfLegRow from './PdfLegRow'
import PdfStopRow from './PdfStopRow'
import { ticketPdfStyles } from './ticketPdfStyles'

type PdfFlightRowsProps = {
  rows: TicketRow[]
}

export default function PdfFlightRows({ rows }: PdfFlightRowsProps) {
  return (
    <View style={ticketPdfStyles.section}>
      <View style={ticketPdfStyles.tableHeader}>
        <Text style={[ticketPdfStyles.tableHeaderCell, { width: '24%' }]}>Flight</Text>
        <Text style={[ticketPdfStyles.tableHeaderCell, { width: '24%' }]}>From</Text>
        <Text style={[ticketPdfStyles.tableHeaderCell, { width: '24%' }]}>To</Text>
        <Text style={[ticketPdfStyles.tableHeaderCell, { width: '16%', borderRightWidth: 0 }]}>Duration</Text>
      </View>

      {rows.map((row, index) =>
        row.type === 'stop' ? <PdfStopRow key={`stop-${index}`} row={row} /> : <PdfLegRow key={`leg-${index}`} row={row} alternate={index % 2 === 1} />
      )}
    </View>
  )
}
