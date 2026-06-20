import { Text, View } from '@react-pdf/renderer'
import { FlightLeg } from '@/types/FlightTypes'
import { ticketPdfStyles } from './ticketPdfStyles'

type PdfLegRowProps = {
  row: FlightLeg
  alternate?: boolean
}

export default function PdfLegRow({ row, alternate }: PdfLegRowProps) {
  return (
    <View style={alternate ? [ticketPdfStyles.row, ticketPdfStyles.rowAlt] : ticketPdfStyles.row}>
      <View style={[ticketPdfStyles.tableCell, { width: '24%' }]}>
        <Text style={ticketPdfStyles.flightAirline}>{row.airline}</Text>
        <Text style={ticketPdfStyles.flightNumber}>{row.flightNumber}</Text>
        <Text style={ticketPdfStyles.cabin}>{row.cabin}</Text>
      </View>

      <View style={[ticketPdfStyles.tableCell, { width: '24%' }]}>
        <Text style={ticketPdfStyles.time}>{row.fromTime}</Text>
        <Text style={ticketPdfStyles.date}>{row.fromDate}</Text>
        <Text style={ticketPdfStyles.city}>{row.fromCity}</Text>
        <Text style={ticketPdfStyles.airport}>{row.fromAirport}</Text>
      </View>

      <View style={[ticketPdfStyles.tableCell, { width: '24%' }]}>
        <Text style={ticketPdfStyles.time}>{row.toTime}</Text>
        <Text style={ticketPdfStyles.date}>{row.toDate}</Text>
        <Text style={ticketPdfStyles.city}>{row.toCity}</Text>
        <Text style={ticketPdfStyles.airport}>{row.toAirport}</Text>
      </View>

      <View style={[ticketPdfStyles.tableCell, { width: '16%', borderRightWidth: 0 }]}>
        <Text style={ticketPdfStyles.city}>{row.duration}</Text>
      </View>
    </View>
  )
}
